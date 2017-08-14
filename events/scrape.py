import collections
import json
import optparse
import re
import sys
import urllib.error
import urllib.request

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


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


def init_firebase():
    cred = credentials.Certificate('BQBL-2c621a7cef1f.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://bqbl-591f3.firebaseio.com/',
        'databaseAuthVariableOverride': {
            'uid': 'score-scraper',
        },
    })


def ordinal(n):
    """Ordinals for quarter numbers."""
    return {'1': '1st', '2': '2nd', '3': '3rd', '4': '4th'}.get(n) or str(n)


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


def parse_play(play, is_qb):
    """Parse a play and count BQBL-relevant events such as turnovers.

    We count turnovers here, because we can get info about whether the turnover
    led to a TD. And we count sacks because we have easy access to the sack
    yardage.

    We try to count safeties. Some cases are obvious (sacks), but some might
    still require judgment calls (e.g., bad snap from the center).

    Args:
        play: JSON data for one play.
        is_qb: Predicate that returns whether a player ID is a QB.
    """
    offense_team = play['posteam']
    qb_stats = []
    def_stats = []
    outcomes = collections.defaultdict(int)
    for pid, player_stats in play['players'].items():
        if player_stats[0]['clubcode'] == offense_team and is_qb(pid):
            qb_stats.extend(player_stats)
        else:
            def_stats.extend(player_stats)
    # http://www.nflgsis.com/gsis/documentation/Partners/StatIDs.html
    for stat in qb_stats:
        sid = stat['statId']
        if sid in (15, 16):
            outcomes['LONG'] = max(outcomes['LONG'], stat.get('yards'))
        elif sid == 20:
            outcomes['SACK'] += 1
            outcomes['SACKYD'] += stat.get('yards', 0)  # Value is negative.
            if any(filter(lambda s: s.get('statId') == 89, def_stats)):
                outcomes['SAF'] += 1
        elif sid == 19:
            outcomes['INT'] += 1
            if any(filter(lambda s: s.get('statId') in (26, 28), def_stats)):
                outcomes['INT6'] += 1
        elif sid in (52, 53):
            outcomes['FUM'] += 1
        elif sid == 106:
            outcomes['FUML'] += 1
            if any(filter(lambda s: s.get('statId') in (60, 62), def_stats)):
                outcomes['FUM6'] += 1
    return outcomes


class Plays(object):

    def __init__(self, player_cache):
        self.fumbles = []
        self.safeties = []
        self.interceptions = []
        self.outcomes_by_team = collections.defaultdict(
            lambda: collections.defaultdict(int))
        self.player_cache = player_cache

    def process(self, game_id, raw):
        data = json.loads(str(raw, 'utf-8')).get(game_id)
        if not data:
            # Empty data file. Maybe the game hasn't started yet.
            return

        drives = data['drives']

        home_box = data['home']
        away_box = data['away']
        passers = (set(home_box['stats'].get('passing', {}).keys()) |
                   set(away_box['stats'].get('passing', {}).keys()))

        def is_qb(pid):
            return (pid in passers and
                    self.player_cache.lookup_position(pid) == 'QB')

        quarter = data['qtr']
        if quarter == 'Final':
            clock = 'Final'
        else:
            clock = '{time} - {quarter}'.format(
                time=data['clock'], quarter=ordinal(quarter))
        self.outcomes_by_team[home_box['abbr']]['CLOCK'] = clock
        self.outcomes_by_team[away_box['abbr']]['CLOCK'] = clock

        # Read box score stats.
        for k, v in parse_box(home_box['stats'], is_qb).items():
            self.outcomes_by_team[home_box['abbr']][k] += v
        for k, v in parse_box(away_box['stats'], is_qb).items():
            self.outcomes_by_team[away_box['abbr']][k] += v

        # Read play-by-play info for slightly more complex stats like turnovers
        # and sack yardage.
        for drive_num, drive in drives.items():
            # skip junk in there about current drive
            if drive_num == 'crntdrv':
                continue
            for play in drive['plays'].values():
                desc = play['desc']

                outcomes = parse_play(play, is_qb)
                for k, v in outcomes.items():
                    if k == 'LONG':
                        old = self.outcomes_by_team[play['posteam']][k]
                        self.outcomes_by_team[play['posteam']][k] = max(old, v)
                    else:
                        self.outcomes_by_team[play['posteam']][k] += v

                summary = {
                    'desc': desc,
                    'team': play['posteam'],
                    'quarter': play['qtr'],
                    'time': play['time'],
                }
                if "SAFETY" in desc:
                    self.safeties.append(summary)
                elif "FUMBLE" in desc and "TOUCHDOWN" in desc:
                    self.fumbles.append(summary)
                if "INTERCEPT" in desc:
                    self.interceptions.append(summary)


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
        profile_bytes = urllib.request.urlopen(url).read()
        profile = str(profile_bytes, 'utf-8')
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
      'interceptions_td': stats['INT6'],
      'fumbles_lost_notd': stats['FUML'] - stats['FUM6'],
      'fumbles_lost_td': stats['FUM6'],
      'fumbles_kept': stats['FUM'] - stats['FUML'],
      'pass_yards': stats['PASSYD'] + stats['SACKYD'],
      'rush_yards': stats['RUSHYD'],
      'sacks': stats['SACK'],
      'sack_yards': -stats['SACKYD'],
      'long_pass': stats['LONG'],
      'game_time': stats['CLOCK'],
      # Missing: 'safeties', 'game_losing_taint', 'benchings'
      # Missing: 'boxscore_url', 'opponent'
    }


def main():
    options, args = parser.parse_args()
    if len(args) < 1:
        parser.print_usage()
        sys.exit(1)

    init_firebase()

    gameIds = open(args[0]).readlines()

    player_cache = PlayerCache(db.reference('/playerpositions').get() or {})
    plays = Plays(player_cache)
    for id in gameIds:
        id = id.strip()
        url = "http://www.nfl.com/liveupdate/game-center/%s/%s_gtd.json" % (
            id, id)
        try:
            raw = urllib.request.urlopen(url).read()
        except urllib.error.HTTPError as e:
            if e.code != 404:
                print('error fetching {url}: {err}'.format(url=url, err=e),
                      file=sys.stderr)
            continue
        plays.process(id, raw)

    if player_cache.new_keys:
        db.reference('/playerpositions').update(player_cache.new_keys)

    if options.firebase:
        fumble_ref = db.reference(
            '/events/%s/%s/fumbles' % (options.year, options.week))
        fumble_ref.set(plays.fumbles)

        safety_ref = db.reference(
            '/events/%s/%s/safeties' % (options.year, options.week))
        safety_ref.set(plays.safeties)

        interception_ref = db.reference(
            '/events/%s/%s/interception' % (options.year, options.week))
        interception_ref.set(plays.interceptions)

        db.reference('/score/%s/%s' % (options.year, options.week)).update(
            {team: to_old_format(team, stats)
             for team, stats in plays.outcomes_by_team.items()})
    else:
        for f in plays.fumbles:
            print(f)
        for s in plays.safeties:
            print(s)
        for i in plays.interceptions:
            print(i)
        print(json.dumps(plays.outcomes_by_team))


if __name__ == '__main__':
    main()
