import collections
import datetime
import itertools
import json
import optparse
import re
import requests
import sys

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import event
import linescore


# Default time to wait between scrapes for a given game ID. Scrapes may occur
# more frequently if we think an "interesting" event has occurred (e.g., if the
# line score shows that a TD was scored).
SCRAPE_INTERVAL = datetime.timedelta(seconds=150)


parser = optparse.OptionParser(
    usage=("Usage: %prog [options] [file with list of NFL game IDs]"))
parser.add_option("-f", "--firebase", dest="firebase", default=False,
                  action="store_true",
                  help="Write output to firebase")
parser.add_option("--firebase_project", dest="firebase_project",
                  default="bqbl-591f3",
                  help="Firebase project ID to use")
parser.add_option("-w", "--week", dest="week",
                  help="Week")
parser.add_option("-y", "--year", dest="year",
                  help="Year")
parser.add_option("-d", "--dump", dest="dump", action="store_true",
                  help="Dump data?")
parser.add_option("--all", dest="all", action="store_true",
                  help="Scrape all games, not just those that are 'due'")
parser.add_option("--firebase_creds", dest="firebase_cred_file",
                  help="File containing Firebase service account credentials")
parser.add_option("--no_events", dest="publish_events", default=True,
                  action="store_false",
                  help=("Don't publish new events to the event ticker. The "
                        "ticker feeds things like the BQBL Red Zone bot. Use "
                        "this flag when backfilling historical data."))


def init_firebase(cred_file, firebase_project):
    cred = credentials.Certificate(cred_file)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://{0}.firebaseio.com/'.format(firebase_project),
        'databaseAuthVariableOverride': {
            'uid': 'score-scraper',
        },
    })


def ordinal(n):
    """Ordinals for quarter numbers."""
    return ({'1': '1st', '2': '2nd', '3': '3rd', '4': '4th', '5': 'OT'}.get(n)
            or str(n))


def parse_yard_line(yard_line_str, offense_abbr):
    """Parses the yard line stat.

    Args:
      yard_line_str: The string describing the yard line, e.g., "NE 35" for the
          Patriots 35-yard line.
      offense_abbr: The abbreviation of the team who started the play with
          possession.

    Returns:
      The yard line, expressed as a number of yards away from the offense's own
      goal line. For example, if the Patriots have the ball, then "NE 28" is 28
      and "ATL 28" is 72. Returns None if the string could not be parsed.
    """
    if not yard_line_str:
        return None
    try:
        team, line_num_str = yard_line_str.split()
        line_num = int(line_num_str)
    except ValueError:
        return None
    return line_num if team == offense_abbr else 100 - line_num


def parse_box(qbs):
    # {player_id: {stat_name: value}}
    outcomes = collections.defaultdict(lambda: collections.defaultdict(int))
    for pid, passer in qbs.items():
        passerStats = passer['gameStats']
        outcomes[pid]['ATT'] += passerStats.get('passingAttempts', 0)
        outcomes[pid]['CMP'] += passerStats.get('passingCompletions', 0)
        outcomes[pid]['PASSYD'] += passerStats.get('passingYards', 0)
        outcomes[pid]['TD'] += passerStats.get('passingTouchdowns', 0)
        # We need to know the number of passing TDs in order to compute the
        # passer rating.
        outcomes[pid]['PASSTD'] += passerStats.get('passingTouchdowns', 0)
        # outcomes[pid]['INT'] += passerStats.get('passingInterceptions', 0)
        # outcomes[pid]['FUM'] += passerStats.get('fumblesLost', 0)
        # outcomes[pid]['FUML'] += passerStats.get('fumblesTotal', 0)
        outcomes[pid]['RUSHYD'] += passerStats.get('rushingYards', 0)
        outcomes[pid]['TD'] += passerStats.get('rushingTouchdowns', 0)

        # The Philly special
        outcomes[pid]['TD'] += passerStats.get('receivingTouchdowns', 0)
    return outcomes


def parse_play(game_id, play_id, play, is_qb, events):
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
    """
    offense_team = play['possessionTeam']['abbreviation']
    # {player_id: [plays]}
    qb_stats = collections.defaultdict(list)
    def_stats = []
    # {player_id: {stat_name: value}}
    outcomes = collections.defaultdict(lambda: collections.defaultdict(int))
    for stat in play['playStats']:
        pid = stat['gsisPlayer']['id']
        if stat['team']['abbreviation'] == offense_team and is_qb(pid):
            qb_stats[pid].append(stat)
        else:
            def_stats.append(stat)

    # http://www.nflgsis.com/gsis/documentation/Partners/StatIDs.html
    for pid, stats in qb_stats.items():
        is_sack = False
        is_qb_fumble = False
        player = '(no QB)'
        for stat in stats:
            sid = stat.get('statId')
            player = stat.get('playerName')

            # The `stats` list represents all events that occurred on a single
            # play. We're assigning values to the outcomes dict instead of
            # summing, because it's generally only possible, e.g., to throw one
            # interception on a play. While it IS possible for the same QB to
            # fumble multiple times in one play, it's more common for there to
            # be an error in the data feed where multiple fumble events are
            # incorrectly recorded for a single statistical fumble.
            if sid in (15, 16):
                outcomes[pid]['LONG'] = max(
                    outcomes[pid]['LONG'], stat.get('yards'))
            elif sid == 20:
                is_sack = True
                outcomes[pid]['SACK'] = 1
                # Value in the source data is negative, which is what we want.
                outcomes[pid]['SACKYD'] = stat.get('yards', 0)
            elif sid == 19:
                outcomes[pid]['INT'] = 1
                opp_td = any(
                    filter(lambda s: s.get('statId') in (26, 28), def_stats))
                if opp_td:
                    outcomes[pid]['INT6'] = 1
                    if play['quarter'] > 4:
                        outcomes[pid]['INT6OT'] = 1
                events.add_interception(game_id, play_id, player, play, opp_td)
            elif sid in (52, 53):
                is_qb_fumble = True
                outcomes[pid]['FUM'] = 1
            elif sid == 106:
                is_qb_fumble = True
                outcomes[pid]['FUML'] = 1
                opp_td = any(
                    filter(lambda s: s.get('statId') in (60, 62), def_stats))
                if opp_td:
                    outcomes[pid]['FUM6'] = 1
                events.add_fumble(game_id, play_id, player, play, opp_td)

        is_safety = any(filter(lambda s: s.get('statId') == 89, def_stats))
        if is_safety:
            # Add all safeties to the events list, even if we're not sure that
            # they should count for BQBL points. Some might be false negatives,
            # and putting them in the events feed lets us easily override them
            # later.
            is_qb_fault = is_sack or is_qb_fumble
            events.add_safety(game_id, play_id, player, play, is_qb_fault)

            if is_qb_fault:
                outcomes[pid]['SAF'] = 1

    return outcomes


class Plays(object):

    def __init__(self, player_cache, events):
        self.events = events
        self.outcomes_by_team = collections.defaultdict(
            lambda: collections.defaultdict(int))
        self.player_cache = player_cache

    def __str__(self):
        return str(self.events) + str(self.outcomes_by_team)

    def filter_qbs(self, players, team_abbr):
        return {p['gameStats']['playerId']: p for p in players if
             p['player']['currentPlayer']['position'] == 'QB' and p['team']['abbreviation'] == team_abbr}

    def process(self, season, week, game_id, data, players, home_box, away_box):
        data = data['data']['viewer']['gameDetail']
        home_box = home_box['data']['viewer']['live']['teamGameStats'][0]['teamGameStats']
        away_box = away_box['data']['viewer']['live']['teamGameStats'][0]['teamGameStats']
        players = players['data']['viewer']['live']['playerGameStats']

        # {team_id: {player_id: {stat_name: value}}}
        outcomes_by_player = collections.defaultdict(
            lambda: collections.defaultdict(
                lambda: collections.defaultdict(int)))

        if not data:
            # Empty data file. Maybe the game hasn't started yet.
            return

        home_team = data['homeTeam']
        away_team = data['visitorTeam']
        home_abbr = home_team['abbreviation']
        away_abbr = away_team['abbreviation']

        self.outcomes_by_team[home_abbr]['ID'] = game_id
        self.outcomes_by_team[away_abbr]['ID'] = game_id
        self.outcomes_by_team[home_abbr]['OPP'] = away_abbr
        self.outcomes_by_team[away_abbr]['OPP'] = home_abbr

        phase = data['phase']
        period = data['period']
        if phase == 'FINAL':
            clock = 'Final'
        else:
            clock = '{time} - {quarter}'.format(
                time=data['gameClock'], quarter=ordinal(period)) ##
        self.outcomes_by_team[home_abbr]['CLOCK'] = clock
        self.outcomes_by_team[away_abbr]['CLOCK'] = clock

        home_score = data['homePointsTotal']
        away_score = data['visitorPointsTotal']
        score_obj = {
            'HOME': home_abbr,
            'AWAY': away_abbr,
            'HSCORE': home_score,
            'ASCORE': away_score,
        }
        self.outcomes_by_team[home_abbr]['SCORE'] = score_obj
        self.outcomes_by_team[away_abbr]['SCORE'] = score_obj

        passers = set()

        # players
        home_passers = self.filter_qbs(players, home_abbr)
        passers |= home_passers.keys()
        for id, p in home_passers.items():
            name = p['player'].get('displayName', 'UNKNOWN')
            outcomes_by_player[home_abbr][id]['NAME'] = name
            # If there's more than one, insert an event that lets us manually
            # flag one of them as having been benched.
            if len(home_passers) > 1:
                self.events.add_passer(home_abbr, id, name)
        away_passers = self.filter_qbs(players, away_abbr)
        passers |= away_passers.keys()
        for id, p in away_passers.items():
            name = p['player'].get('displayName', 'UNKNOWN')
            outcomes_by_player[away_abbr][id]['NAME'] = name
            if len(away_passers) > 1:
                self.events.add_passer(away_abbr, id, name)

        def is_qb(pid):
            return pid in passers

        for pid, qb_outcomes in parse_box(home_passers).items(): ##
            for k, v in qb_outcomes.items():
                outcomes_by_player[home_abbr][pid][k] += v
                self.outcomes_by_team[home_abbr][k] += v
        for pid, qb_outcomes in parse_box(away_passers).items():
            for k, v in qb_outcomes.items():
                outcomes_by_player[away_abbr][pid][k] += v
                self.outcomes_by_team[away_abbr][k] += v

        # Read play-by-play info for slightly more complex stats like turnovers
        # and sack yardage.
        for play_num, play in enumerate(data.get('plays', [])):
            outcomes = parse_play(
                     game_id, play_num, play, is_qb, self.events)
            for pid, qb_outcomes in outcomes.items():
                for k, v in qb_outcomes.items():
                    team = play['possessionTeam']['abbreviation']
                    if k == 'LONG':
                        pold = outcomes_by_player[team][pid][k]
                        outcomes_by_player[team][pid][k] = max(pold, v)
                        old = self.outcomes_by_team[team][k]
                        self.outcomes_by_team[team][k] = max(old, v)
                    else:
                        outcomes_by_player[team][pid][k] += v
                        self.outcomes_by_team[team][k] += v
            # Compute best field position from drive-wide stats. Field position
            # is recorded as the number of yards from the team's own goal line.
            # We ignore field position on drives where the team never gained a
            # first down (or received one via penalty) so that offenses aren't
            # rewarded for going 3-and-out after their defense gives them good
            # position.
            # drive_team = drive['posteam']
            # if drive['fds'] > 0 and drive_team:
            #     old = self.outcomes_by_team[drive_team]['FIELDPOS']
            #     new = 0
            #     if drive['result'] == 'Touchdown':
            #         new = 100
            #     else:
            #         for _, play in drive['plays'].items():
            #             team = play['posteam']
            #             if drive_team != team:
            #                 continue
            #             if not play['down']:
            #                 # Exclude tries (extra points) and free kicks.
            #                 continue
            #             yard_line = parse_yard_line(play['yrdln'], team)
            #             if yard_line:
            #                 new = max(new, yard_line)
            #     self.outcomes_by_team[drive_team]['FIELDPOS'] = max(old, new)

        self.outcomes_by_team[home_abbr]['FIELDPOS'] = 100
        self.outcomes_by_team[away_abbr]['FIELDPOS'] = 100
        self.outcomes_by_team[home_abbr]['passers'] = (
            outcomes_by_player[home_abbr])
        self.outcomes_by_team[away_abbr]['passers'] = (
            outcomes_by_player[away_abbr])


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


def main():
    options, args = parser.parse_args()

    if args:
        season, week = options.year, options.week
        if not (season and week):
            print('--year and --week are required if a game ID file is used',
                  file=sys.stderr)
            sys.exit(1)
        game_ids = [gid.strip() for gid in open(args[0])]
        games_with_alerts = set()
    else:
        season, week, games = linescore.fetch(options.year, options.week)
        game_ids = [g.id for g in games.values()
                    if g.start_time < datetime.datetime.now()]
        games_with_alerts = {g.id for g in games.values() if g.alert}

    if not options.firebase_cred_file:
        sys.stderr.write('must supply --firebase_creds\n')
        parser.print_help(file=sys.stderr)
        sys.exit(1)
    # We need this even if --firebase is false because we read some cached data
    # from Firebase.
    init_firebase(options.firebase_cred_file, options.firebase_project)

    player_cache = PlayerCache(db.reference('/playerpositions').get() or {})
    plays = Plays(player_cache, event.Events())
    scrape_status_ref = db.reference(
        '/scrapestatus/{0}/{1}'.format(season, week))
    if options.all:
        scrape_status = collections.defaultdict(dict)
    else:
        scrape_status = collections.defaultdict(dict,
                                                scrape_status_ref.get() or {})
    now = datetime.datetime.now(tz=datetime.timezone.utc)

    payload = {"clientKey":"4cFUW6DmwJpzT9L7LrG3qRAcABG5s04g","clientSecret":"CZuvCL49d9OwfGsR","deviceId":"9c716807-a922-4f27-9d1a-3ea8a3a4259e","deviceInfo":"eyJtb2RlbCI6ImRlc2t0b3AiLCJ2ZXJzaW9uIjoiQ2hyb21lIiwib3NOYW1lIjoiV2luZG93cyIsIm9zVmVyc2lvbiI6IjEwIn0=","networkType":"other"}
    r = requests.post("https://api.nfl.com/identity/v3/token", data=payload)
    access_token = json.loads(r.text)['accessToken']
    headers_2 = {'Authorization': 'Bearer ' + access_token}


    for id in game_ids:
        # IDs might be integers if we read them out of JSON, but we always use
        # string keys in the database.
        id = str(id)
        if scrape_status[id].get('isFinal'):
            continue
        last_scrape = datetime.datetime.fromtimestamp(
            scrape_status[id].get('lastScrape', 0), tz=datetime.timezone.utc)
        if last_scrape + SCRAPE_INTERVAL > now and id not in games_with_alerts:
            continue

        url = ('https://api.nfl.com/experience/v1/gamedetails/{0}'
               .format(id))
        resp = requests.get(url, headers=headers_2)
        if resp.status_code >= 400:
            if resp.status_code != 404:
                print('error fetching {url}: {err}'.format(url=url, err=e),
                      file=sys.stderr)
            continue
        data = resp.json()

        home_id = data['data']['viewer']['gameDetail']['homeTeam']['id']
        away_id = data['data']['viewer']['gameDetail']['visitorTeam']['id']

        url = ('https://api.nfl.com/experience/v1/stats/{0}/players'
               .format(id))
        resp = requests.get(url, headers=headers_2)
        if resp.status_code >= 400:
            if resp.status_code != 404:
                print('error fetching {url}: {err}'.format(url=url, err=e),
                      file=sys.stderr)
            continue
        players = resp.json()

        url = ('https://api.nfl.com/experience/v1/stats/{0}/teams/{1}'
               .format(id, home_id))
        resp = requests.get(url, headers=headers_2)
        if resp.status_code >= 400:
            if resp.status_code != 404:
                print('error fetching {url}: {err}'.format(url=url, err=e),
                      file=sys.stderr)
            print('err', resp)
            continue
        home_team = resp.json()

        url = ('https://api.nfl.com/experience/v1/stats/{0}/teams/{1}'
               .format(id, away_id))
        resp = requests.get(url, headers=headers_2)
        if resp.status_code >= 400:
            if resp.status_code != 404:
                print('error fetching {url}: {err}'.format(url=url, err=e),
                      file=sys.stderr)
            print('err', resp)
            continue
        away_team = resp.json()
        plays.process(season, week, id, data, players, home_team, away_team)
        scrape_status[id]['lastScrape'] = now.timestamp()
        # TODO: We shouldn't be parsing data here.
        try:
            scrape_status[id]['isFinal'] = data['viewer']['phase'] == 'FINAL'
        except:
            scrape_status[id]['isFinal'] = False

    # Log which teams were updated. In prod, we'll write this to disk for later
    # inspection.
    print('{0} {1}'.format(datetime.datetime.now(),
                           ' '.join(sorted(plays.outcomes_by_team.keys()))))

    if options.firebase:
        if player_cache.new_keys:
            db.reference('/playerpositions').update(player_cache.new_keys)

        if scrape_status:
            scrape_status_ref.update(scrape_status)

        if options.publish_events:
            events_ref = db.reference('/events/{0}/{1}'.format(season, week))
            if plays.events.fumbles:
                events_ref.child('fumbles').update(plays.events.fumbles)
            if plays.events.safeties:
                events_ref.child('safeties').update(plays.events.safeties)
            if plays.events.interceptions:
                events_ref.child('interceptions').update(
                    plays.events.interceptions)
            if plays.events.passers:
                events_ref.child('passers').update(plays.events.passers)

        if plays.outcomes_by_team:
            db.reference('/stats/%s/%s' % (season, week)).update(
                plays.outcomes_by_team)
    else:
        print('-- scrape status--')
        statuses = sorted(scrape_status.items(),
                          key=lambda it: it[1]['lastScrape'])
        for id, status in statuses:
            print('{0}: {1}'.format(id, status['lastScrape']))
        print('-- events --')
        all_events = itertools.chain(
            plays.events.fumbles.items(),
            plays.events.safeties.items(),
            plays.events.interceptions.items(),
            plays.events.passers.items())
        for id, ev in all_events:
            print('{0}: {1}'.format(id, ev))
        print('-- scraped stats --')
        print(json.dumps(plays.outcomes_by_team))


if __name__ == '__main__':
    main()
