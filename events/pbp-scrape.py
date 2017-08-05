import json
import copy
import optparse
import urllib.request
import sys
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate('BQBL-2c621a7cef1f.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://bqbl-591f3.firebaseio.com/',
    'databaseAuthVariableOverride': {
        'uid': 'score-scraper',
    },
})

parser = optparse.OptionParser(
  usage=("Usage: %prog [options] <file with list of NFL game IDs> "))
parser.add_option("-f", "--firebase", dest="firebase", default=False,
                  action="store_true",
                  help="Write output to firebase")
parser.add_option("-w", "--week", dest="week",
                  help="Week")
parser.add_option("-y", "--year", dest="year",
                  help="Year")

options, args = parser.parse_args()
if len(args) < 1:
  parser.print_usage()
  sys.exit(1)


class Plays(object):

  def __init__(self):
    self.fumbles = []
    self.safeties = []
    self.interceptions = []

  def process(self, game_id, raw):
    data = json.loads(str(raw, 'utf-8'))
    drives = data[game_id]['drives']
    # 5 is for overtime
    quarters = {1: {}, 2: {}, 3:{}, 4:{}, 5:{}}

    for drive in drives:
      # skip junk in there about current drive
      if drive == 'crntdrv': continue
      plays = copy.deepcopy(drives[drive]['plays'])
      for play_key in plays:
        play = plays[play_key]
        quarter = play['qtr']
        time = play['time']
        quarters[quarter][time] = play

    for n in range(1, 6):
      for t in sorted(quarters[n].keys())[::-1]:
        play = quarters[n][t]
        desc = play['desc']
        if "SAFETY" in desc:
          self.safeties.append({
              'desc': desc, 'team': play['posteam'], 'quarter': n, 'time': t})
        elif "FUMBLE" in desc and "TOUCHDOWN" in desc:
          self.fumbles.append({
              'desc': desc, 'team': play['posteam'], 'quarter': n, 'time': t})
        if "INTERCEPT" in desc:
          self.interceptions.append({
              'desc': desc, 'team': play['posteam'], 'quarter': n, 'time': t})


def main():
  gameIds = open(args[0]).readlines()

  plays = Plays()
  for id in gameIds:
    id = id.strip()
    url = "http://www.nfl.com/liveupdate/game-center/%s/%s_gtd.json" % (id, id)
    raw = urllib.request.urlopen("http://www.nfl.com/liveupdate/game-center/%s/%s_gtd.json" % (id, id)).read()
    plays.process(id, raw)

  if options.firebase:
    fumble_ref = db.reference('/events/%s/%s/fumbles' % (options.year, options.week))
    fumble_ref.set(plays.fumbles)

    safety_ref = db.reference('/events/%s/%s/safeties' % (options.year, options.week))
    safety_ref.set(plays.safeties)

    interception_ref = db.reference('/events/%s/%s/interception' % (options.year, options.week))
    interception_ref.set(plays.interceptions)
  else:
    for f in plays.fumbles:
      print(f)
    for s in plays.safeties:
      print(s)
    for i in plays.interceptions:
      print(i)


main()
