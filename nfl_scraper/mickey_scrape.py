import collections
import datetime
import optparse
import sys
import mickey_parse

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


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
parser.add_option("--ids", dest="ids",
                  help="Scrape specifically these games")


def init_firebase(cred_file, firebase_project):
    cred = credentials.Certificate(cred_file)
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://{0}.firebaseio.com/'.format(firebase_project),
        'databaseAuthVariableOverride': {
            'uid': 'score-scraper',
        },
    })

def consolidate_passers(data):
    passers = {}
    for id, item in data.items():
        # If there's more than one, insert events for each passer. The events
        # can be used to manually flag a passer as having been benched.
        if len(item['PASSERS']) > 1:
            for passer_key, passer in item['PASSERS'].items():
                passers[passer_key] = {"name": passer['NAME'], "team": id}
    return passers

def main():
    options, args = parser.parse_args()

    season, week = options.year, options.week
    if not (season and week):
        print('--year and --week are required if a game ID file is used',
                file=sys.stderr)
        sys.exit(1)
    games_with_alerts = set()
    if options.ids:
        game_ids = options.ids.split(',')
    else:
        game_ids = mickey_parse.all_games(season, week)
    if options.firebase:
        if not options.firebase_cred_file:
            sys.stderr.write('must supply --firebase_creds if --firebase is set\n')
            parser.print_help(file=sys.stderr)
            sys.exit(1)
        init_firebase(options.firebase_cred_file, options.firebase_project)

    scrape_status_ref = None
    if options.firebase:
        scrape_status_ref = db.reference(
            '/scrapestatus/{0}/{1}'.format(season, week))
    if options.all:
        scrape_status = collections.defaultdict(dict)
    else:
        initial_status = scrape_status_ref.get() if scrape_status_ref else {}
        scrape_status = collections.defaultdict(dict, initial_status or {})
    now = datetime.datetime.now(tz=datetime.timezone.utc)
    data = {}
    for id in game_ids:
        # if scrape_status[id].get('isFinal'):
        #     continue
        print(id)
        last_scrape = datetime.datetime.fromtimestamp(
            scrape_status[id].get('lastScrape', 0), tz=datetime.timezone.utc)
        if last_scrape + SCRAPE_INTERVAL > now and id not in games_with_alerts:
            continue

        url = ('https://www.espn.com/nfl/boxscore?gameId={0}'
               .format(id))
        try:
            team_key_1, team_key_2 = mickey_parse.mickey_parse(url, data, game_id=id)
            if not team_key_1 in data:
                print('skipping', id)
                continue
            scrape_status[id]['lastScrape'] = now.timestamp()
            # TODO: We shouldn't be parsing data here.
            scrape_status[id]['isFinal'] = data[team_key_1]['CLOCK'] == 'Final'
        except Exception as e:
            print("ERROR", season, week, id, e)
    passers = consolidate_passers(data)

    if options.firebase:
        if scrape_status:
            scrape_status_ref.update(scrape_status)

        for team_name, value in data.items():
            db.reference('/stats/%s/%s/%s' % (season, week, team_name)).update(value)

        if options.publish_events:
            events_ref = db.reference('/events/{0}/{1}'.format(season, week))
            if passers:
                events_ref.child('passers').update(passers)
    else:
        for team_name, value in data.items():
            print('%s => %s', team_name, value)
        if passers:
            print('passers list:')
            print(passers)


# TODO: What's up with 311121017, 310911025, 400554375, 330922016, 321118017,330922029,330922033 331208018, 330922010, 
if __name__ == '__main__':
    main()
