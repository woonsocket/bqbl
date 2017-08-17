import collections
import itertools
import json
import optparse
import re
import requests
import sys

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import slack


parser = optparse.OptionParser(
    usage=("Usage: %prog [options] <file with list of NFL game IDs> "))
parser.add_option("-f", "--firebase", dest="firebase", default=False,
                  action="store_true",
                  help="Write output to firebase")
parser.add_option("-w", "--week", dest="week",
                  help="Week")
parser.add_option("-y", "--year", dest="year",
                  help="Year")
parser.add_option("-d", "--dump", dest="dump", action="store_true",
                  help="Dump data?")
parser.add_option("--firebase_creds", dest="firebase_cred_file",
                  help="File containing Firebase service account credentials")
parser.add_option("--slack_config", dest="slack_config",
                  help="JSON config file containing a Slack webhook URL")


def init_firebase(cred_file):
    cred = credentials.Certificate(cred_file)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://bqbl-591f3.firebaseio.com/',
        'databaseAuthVariableOverride': {
            'uid': 'score-scraper',
        },
    })


def ordinal(n):
    """Ordinals for quarter numbers."""
    return {'1': '1st', '2': '2nd', '3': '3rd', '4': '4th'}.get(n) or str(n)


def nflcom_week(w):
    """Converts a week number to the format used by NFL.com."""
    w = str(w)
    if w.startswith('P'):
        return 'PRE' + w[1:]
    return 'REG' + w


def parse_box(box, is_qb):
    outcomes = collections.defaultdict(int)
    for pid, passer in box.get('passing', {}).items():
        if not is_qb(pid):
            continue
        outcomes['ATT'] += passer.get('att', 0)
        outcomes['CMP'] += passer.get('cmp', 0)
        outcomes['PASSYD'] += passer.get('yds', 0)
        outcomes['TD'] += passer.get('tds', 0)
        # Interceptions are present here, but we'll read those from the
        # play-by-play instead, because we can tell if it was a pick-6.
    for pid, rusher in box.get('rushing', {}).items():
        if not is_qb(pid):
            continue
        outcomes['RUSHYD'] += rusher.get('yds', 0)
        outcomes['TD'] += rusher.get('tds', 0)
    for pid, receiver in box.get('receiving', {}).items():
        if not is_qb(pid):
            continue
        # This is a *receiving* TD for the QB. It's been known to happen!
        outcomes['TD'] += receiver.get('tds', 0)
    return outcomes


def parse_play(game_id, play_id, play, is_qb, events, notifier):
    """Parse a play and count BQBL-relevant events such as turnovers.

    We count turnovers here, because we can get info about whether the turnover
    led to a TD. And we count sacks because we have easy access to the sack
    yardage.

    We try to count safeties. Some cases are obvious (sacks), but some might
    still require judgment calls (e.g., bad snap from the center).

    Args:
        game_id: The ID of the game this play belongs to.
        play_id: The ID of the play.
        play: JSON data for one play.
        is_qb: Predicate that returns whether a player ID is a QB.
        events: An Events object in which to record turnovers.
        notifier: A slack.Notifier.
    """
    offense_team = play['posteam']
    qb_stats = []
    def_stats = []
    outcomes = collections.defaultdict(int)
    for pid, player_stats in play['players'].items():
        for stat in player_stats:
            if stat['clubcode'] == offense_team and is_qb(pid):
                qb_stats.append(stat)
            else:
                def_stats.append(stat)

    is_sack = False
    is_qb_fumble = False

    # http://www.nflgsis.com/gsis/documentation/Partners/StatIDs.html
    for stat in qb_stats:
        sid = stat.get('statId')
        player = stat.get('playerName')
        team = stat.get('clubcode')
        desc = play['desc']
        if sid in (15, 16):
            outcomes['LONG'] = max(outcomes['LONG'], stat.get('yards'))
        elif sid == 20:
            is_sack = True
            outcomes['SACK'] += 1
            outcomes['SACKYD'] += stat.get('yards', 0)  # Value is negative.
        elif sid == 19:
            outcomes['INT'] += 1
            opp_td = any(
                filter(lambda s: s.get('statId') in (26, 28), def_stats))
            if opp_td:
                outcomes['INT6'] += 1
                if play['qtr'] > 4:
                    outcomes['INT6OT'] += 1
            is_new = events.add_interception(game_id, play_id, play, opp_td)
            if opp_td and is_new:
                notifier.notify(slack.EventType.INT_TD, player, team, desc)
        elif sid in (52, 53):
            is_qb_fumble = True
            outcomes['FUM'] += 1
        elif sid == 106:
            is_qb_fumble = True
            outcomes['FUML'] += 1
            opp_td = any(
                filter(lambda s: s.get('statId') in (60, 62), def_stats))
            if opp_td:
                outcomes['FUM6'] += 1
            is_new = events.add_fumble(game_id, play_id, play, opp_td)
            if opp_td and is_new:
                notifier.notify(slack.EventType.FUM_TD, player, team, desc)

    is_safety = any(filter(lambda s: s.get('statId') == 89, def_stats))
    if is_safety:
        # Add all safeties to the events list, even if we're not sure that they
        # should count for BQBL points. Some might be false negatives, and
        # putting them in the events feed lets us easily override them later.
        is_new = events.add_safety(game_id, play_id, play)
        is_qb_fault = is_sack or is_qb_fumble

        if is_qb_fault:
            outcomes['SAF'] += 1
            if is_new:
                notifier.notify(slack.EventType.SAFETY, player, team, desc)

    return outcomes


class Events(object):
    """Data object for holding "interesting" events."""

    def __init__(self, fumbles, safeties, interceptions):
        self.fumbles = fumbles
        self.safeties = safeties
        self.interceptions = interceptions

    @staticmethod
    def _id(game_id, play_id):
        return '{g}-{p}'.format(g=game_id, p=play_id)

    @staticmethod
    def _summary(play):
        return {
            'desc': play['desc'],
            'team': play['posteam'],
            'quarter': play['qtr'],
            'time': play['time'],
        }

    def add_fumble(self, game_id, play_id, play, is_opponent_td):
        """Add a fumble event.

        Args:
            game_id: ID for this game. Looks like '2016122406'.
            play_id: The ID of the play. In the play-by-play data, each drive is
                represented as a key-value pairs, with play's key being a
                distinct integer ID.
            play: A play dict, decoded from JSON.
            is_opponent_td: Whether the fumble was returned for a touchdown.
        Returns:
            Whether this event is new (i.e., the play ID was not previously
            known to this Events object).
        """
        summary = Events._summary(play)
        summary['td'] = is_opponent_td
        id = Events._id(game_id, play_id)
        is_new = id not in self.fumbles
        self.fumbles[id] = summary
        return is_new

    def add_interception(self, game_id, play_id, play, is_opponent_td):
        """Adds an interception event.

        Args:
            game_id: ID for this game. Looks like '2016122406'.
            play_id: The ID of the play. In the play-by-play data, each drive is
                represented as a key-value pairs, with play's key being a
                distinct integer ID.
            play: A play dict, decoded from JSON.
            is_opponent_td: Whether the fumble was returned for a touchdown.
        Returns:
            Whether this event is new (i.e., the play ID was not previously
            known to this Events object).
        """
        summary = Events._summary(play)
        summary['td'] = is_opponent_td
        id = Events._id(game_id, play_id)
        is_new = id not in self.interceptions
        self.interceptions[id] = summary
        return is_new

    def add_safety(self, game_id, play_id, play):
        """Adds a safety event.

        Args:
            game_id: ID for this game. Looks like '2016122406'.
            play_id: The ID of the play. In the play-by-play data, each drive is
                represented as a key-value pairs, with play's key being a
                distinct integer ID.
            play: A play dict, decoded from JSON.
        Returns:
            Whether this event is new (i.e., the play ID was not previously
            known to this Events object).
        """
        summary = Events._summary(play)
        id = Events._id(game_id, play_id)
        is_new = id not in self.safeties
        self.safeties[Events._id(game_id, play_id)] = summary
        return is_new

    @staticmethod
    def create_from_db(year, week):
        ref = db.reference('/events/{y}/{w}'.format(y=year, w=week))
        db_events = ref.get() or {}
        return Events(
            fumbles=db_events.get('fumbles', {}),
            safeties=db_events.get('safeties', {}),
            interceptions=db_events.get('interceptions', {}))


class Plays(object):

    def __init__(self, player_cache, events, notifier):
        self.events = events
        self.outcomes_by_team = collections.defaultdict(
            lambda: collections.defaultdict(int))
        self.player_cache = player_cache
        self.notifier = notifier

    def process(self, season, week, game_id, data):
        data = data.get(game_id)
        if not data:
            # Empty data file. Maybe the game hasn't started yet.
            return

        drives = data['drives']

        home_box = data['home']
        away_box = data['away']
        home_abbr = home_box['abbr']
        away_abbr = away_box['abbr']

        passers = (set(home_box['stats'].get('passing', {}).keys()) |
                   set(away_box['stats'].get('passing', {}).keys()))

        def is_qb(pid):
            return (pid in passers and
                    self.player_cache.lookup_position(pid) == 'QB')

        # Actually, this component of the path doesn't seem to matter at all, as
        # long as it's non-empty. NFL.com puts the team nicknames in there
        # ('patriots@falcons'), but it appears to be purely for URL aesthetics.
        at_code = '{0}@{1}'.format(away_abbr, home_abbr)
        box_url = ('http://www.nfl.com/gamecenter/{0}/{1}/{2}/{3}'
                   '#tab=analyze&analyze=boxscore'
                   .format(game_id, season, nflcom_week(week), at_code))
        self.outcomes_by_team[home_abbr]['URL'] = box_url
        self.outcomes_by_team[away_abbr]['URL'] = box_url

        quarter = data['qtr']
        if quarter == 'Final':
            clock = 'Final'
        else:
            clock = '{time} - {quarter}'.format(
                time=data['clock'], quarter=ordinal(quarter))
        self.outcomes_by_team[home_abbr]['CLOCK'] = clock
        self.outcomes_by_team[away_abbr]['CLOCK'] = clock
        self.outcomes_by_team[home_abbr]['OPP'] = away_abbr
        self.outcomes_by_team[away_abbr]['OPP'] = home_abbr

        # Read box score stats.
        for k, v in parse_box(home_box['stats'], is_qb).items():
            self.outcomes_by_team[home_abbr][k] += v
        for k, v in parse_box(away_box['stats'], is_qb).items():
            self.outcomes_by_team[away_abbr][k] += v

        # Read play-by-play info for slightly more complex stats like turnovers
        # and sack yardage.
        for drive_num, drive in drives.items():
            # skip junk in there about current drive
            if drive_num == 'crntdrv':
                continue
            for play_id, play in drive['plays'].items():
                desc = play['desc']

                outcomes = parse_play(
                    game_id, play_id, play, is_qb, self.events, self.notifier)
                for k, v in outcomes.items():
                    if k == 'LONG':
                        old = self.outcomes_by_team[play['posteam']][k]
                        self.outcomes_by_team[play['posteam']][k] = max(old, v)
                    else:
                        self.outcomes_by_team[play['posteam']][k] += v


class PlayerCache(object):
    PLAYER_POSITION_REGEX = re.compile(
        r'<span class="player-number">#\d* ([A-Z]*)</span>', flags=re.I)

    def __init__(self, positions):
        self.positions = positions
        self.new_keys = {}  # Keys that need to be written back to Firebase.

    def lookup_position(self, player_id):
        position = self._read_from_local_cache(player_id)
        if position is None:
            position = self._read_from_web(player_id)
            self._write_to_local_cache(player_id, position)
        return position

    def _read_from_local_cache(self, player_id):
        return self.positions.get(player_id, None)

    def _write_to_local_cache(self, player_id, position):
        self.positions[player_id] = position
        self.new_keys[player_id] = position

    def _read_from_web(self, player_id):
        url = 'http://www.nfl.com/players/profile?id={id}'.format(id=player_id)
        profile = requests.get(url).text
        match = PlayerCache.PLAYER_POSITION_REGEX.search(profile)
        if not match:
            # Sometimes a bogus player ID (e.g., '0') is used when a stat is
            # credited to a whole team, or it's not clear which player was
            # involved.
            return 'UNKNOWN'
        return match.group(1).upper()


def to_old_format(team, stats):
    stats = collections.defaultdict(int, stats)
    return {
        'team': team,
        'completions': stats['CMP'],
        'attempts': stats['ATT'],
        # Lump all the TDs into pass_tds. We never distinguished between
        # pass/rush.
        'pass_tds': stats['TD'],
        'rush_tds': 0,
        'interceptions_notd': stats['INT'] - stats['INT6'],
        'interceptions_td': stats['INT6'] - stats['INT6OT'],
        'fumbles_lost_notd': stats['FUML'] - stats['FUM6'],
        'fumbles_lost_td': stats['FUM6'],
        'fumbles_kept': stats['FUM'] - stats['FUML'],
        'pass_yards': stats['PASSYD'] + stats['SACKYD'],
        'rush_yards': stats['RUSHYD'],
        'sacks': stats['SACK'],
        'sack_yards': -stats['SACKYD'],
        'long_pass': stats['LONG'],
        'game_time': stats['CLOCK'],
        'safeties': stats['SAF'],
        'game_losing_taint': stats['INT6OT'],
        'opponent': stats['OPP'],
        'boxscore_url': stats['URL'],
        # Missing:
        # 'benchings' (BENCH)
        # 'street_free_agent' (FREEAGENT)
    }


def main():
    options, args = parser.parse_args()
    if len(args) < 1:
        parser.print_usage(file=sys.stderr)
        sys.exit(1)

    if not options.firebase_cred_file:
        sys.stderr.write('must supply --firebase_creds\n')
        parser.print_help(file=sys.stderr)
        sys.exit(1)
    # We need this even if --firebase is false because we read some cached data
    # from Firebase.
    init_firebase(options.firebase_cred_file)
    if options.slack_config:
        try:
            notifier = slack.Notifier.from_json_file(options.slack_config)
        except slack.ConfigError as e:
            print('Error reading {0}: {1}'.format(options.slack_config, e),
                  file=sys.stderr)
            sys.exit(1)
    else:
        notifier = slack.NoOpNotifier()

    gameIds = open(args[0]).readlines()

    player_cache = PlayerCache(db.reference('/playerpositions').get() or {})
    events = Events.create_from_db(options.year, options.week)
    plays = Plays(player_cache, events, notifier)
    for id in gameIds:
        id = id.strip()
        url = "http://www.nfl.com/liveupdate/game-center/%s/%s_gtd.json" % (
            id, id)
        resp = requests.get(url)
        if resp.status_code >= 400:
            if resp.status_code != 404:
                print('error fetching {url}: {err}'.format(url=url, err=e),
                      file=sys.stderr)
            continue
        plays.process(options.year, options.week, id, resp.json())

    if player_cache.new_keys:
        db.reference('/playerpositions').update(player_cache.new_keys)

    if options.firebase:
        fumble_ref = db.reference(
            '/events/%s/%s/fumbles' % (options.year, options.week))
        fumble_ref.set(plays.events.fumbles)

        safety_ref = db.reference(
            '/events/%s/%s/safeties' % (options.year, options.week))
        safety_ref.set(plays.events.safeties)

        interception_ref = db.reference(
            '/events/%s/%s/interceptions' % (options.year, options.week))
        interception_ref.set(plays.events.interceptions)

        db.reference('/score/%s/%s' % (options.year, options.week)).update(
            {team: to_old_format(team, stats)
             for team, stats in plays.outcomes_by_team.items()})
        db.reference('/stats/%s/%s' % (options.year, options.week)).update(
            plays.outcomes_by_team)
    else:
        all_events = itertools.chain(
            plays.events.fumbles.items(),
            plays.events.safeties.items(),
            plays.events.interceptions.items())
        for id, ev in all_events:
            print('{0}: {1}'.format(id, ev))
        print(json.dumps(plays.outcomes_by_team))


if __name__ == '__main__':
    main()
