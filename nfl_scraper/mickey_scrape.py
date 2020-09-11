import collections
import datetime
import itertools
import json
import optparse
import re
import requests
import sys
import mickey_parse

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


def main():
    options, args = parser.parse_args()

    season, week = options.year, options.week
    if not (season and week):
        print('--year and --week are required if a game ID file is used',
                file=sys.stderr)
        sys.exit(1)
    # game_ids = [gid.strip() for gid in open(args[0])]
    # games_with_alerts = set()

    if not options.firebase_cred_file:
        sys.stderr.write('must supply --firebase_creds\n')
        parser.print_help(file=sys.stderr)
        sys.exit(1)

    init_firebase(options.firebase_cred_file, options.firebase_project)

    # scrape_status_ref = db.reference(
    #     '/scrapestatus/{0}/{1}'.format(season, week))
    # if options.all:
    #     scrape_status = collections.defaultdict(dict)
    # else:
    #     scrape_status = collections.defaultdict(dict,
    #                                             scrape_status_ref.get() or {})
    now = datetime.datetime.now(tz=datetime.timezone.utc)
    urls = ["https://www.espn.com/nfl/boxscore?gameId=401220225"]
    dst = {}
    for url in urls:
        mickey_parse.mickey_parse(url, dst)
    for team_name, value in dst.items():
        db.reference('/stats/%s/%s/%s' % (season, week, team_name)).update(value)
    # for id in game_ids:
    #     # IDs might be integers if we read them out of JSON, but we always use
    #     # string keys in the database.
    #     id = str(id)
    #     if scrape_status[id].get('isFinal'):
    #         continue
    #     last_scrape = datetime.datetime.fromtimestamp(
    #         scrape_status[id].get('lastScrape', 0), tz=datetime.timezone.utc)
    #     if last_scrape + SCRAPE_INTERVAL > now and id not in games_with_alerts:
    #         continue
    #     url = ('http://www.nfl.com/liveupdate/game-center/{0}/{0}_gtd.json'
    #            .format(id))
    #     resp = requests.get(url)
    #     if resp.status_code >= 400:
    #         if resp.status_code != 404:
    #             print('error fetching {url}: {err}'.format(url=url, err=e),
    #                   file=sys.stderr)
    #         continue
    #     data = resp.json()
    #     plays.process(season, week, id, data)
    #     scrape_status[id]['lastScrape'] = now.timestamp()
    #     # TODO: We shouldn't be parsing data here.
    #     scrape_status[id]['isFinal'] = data[id]['qtr'] == 'Final'

    # # Log which teams were updated. In prod, we'll write this to disk for later
    # # inspection.
    # print('{0} {1}'.format(datetime.datetime.now(),
    #                        ' '.join(sorted(plays.outcomes_by_team.keys()))))

    # if options.firebase:
    #     if player_cache.new_keys:
    #         db.reference('/playerpositions').update(player_cache.new_keys)

    #     if scrape_status:
    #         scrape_status_ref.update(scrape_status)

    #     if options.publish_events:
    #         events_ref = db.reference('/events/{0}/{1}'.format(season, week))
    #         if plays.events.fumbles:
    #             events_ref.child('fumbles').update(plays.events.fumbles)
    #         if plays.events.safeties:
    #             events_ref.child('safeties').update(plays.events.safeties)
    #         if plays.events.interceptions:
    #             events_ref.child('interceptions').update(
    #                 plays.events.interceptions)
    #         if plays.events.passers:
    #             events_ref.child('passers').update(plays.events.passers)

    #     if plays.outcomes_by_team:
    #         db.reference('/stats/%s/%s' % (season, week)).update(
    #             plays.outcomes_by_team)
    # else:
    #     print('-- scrape status--')
    #     statuses = sorted(scrape_status.items(),
    #                       key=lambda it: it[1]['lastScrape'])
    #     for id, status in statuses:
    #         print('{0}: {1}'.format(id, status['lastScrape']))
    #     print('-- events --')
    #     all_events = itertools.chain(
    #         plays.events.fumbles.items(),
    #         plays.events.safeties.items(),
    #         plays.events.interceptions.items(),
    #         plays.events.passers.items())
    #     for id, ev in all_events:
    #         print('{0}: {1}'.format(id, ev))
    #     print('-- scraped stats --')
    #     print(json.dumps(plays.outcomes_by_team))


if __name__ == '__main__':
    main()
