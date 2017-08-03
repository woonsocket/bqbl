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
parser.add_option("-d", "--dump", dest="dump", action="store_true",
                  help="Dump data?")

options, args = parser.parse_args()
if len(args) < 1:
  parser.print_usage()
  sys.exit(1)

def process(raw, fumbles, safeties, interceptions):
  data = json.loads(str(raw, 'utf-8'))
  drives = data[id]['drives']
  # 5 is for overtime
  quarters = {1: {}, 2: {}, 3:{}, 4:{}, 5:{}}

  for drive_key in drives:
    # skip junk in there about current drive
    if drive_key == 'crntdrv': continue
    plays = copy.deepcopy(drives[drive_key]['plays'])
    for play_key in plays:
      play = plays[play_key]
      quarter = play['qtr']
      time = play['time']
      play['key'] = play_key
      quarters[quarter][time] = play

  for n in range(1, 6):
    for t in sorted(quarters[n].keys())[::-1]:
      play = quarters[n][t]
      desc = play['desc']
      if "SAFETY" in desc:
        safeties.append(play_to_obj(play))
      elif "FUMBLE" in desc and "TOUCHDOWN" in desc:
        fumbles.append(play_to_obj(play))
      if "INTERCEPT" in desc:
        interceptions.append(play_to_obj(play))

def play_to_obj(play):
  return {
    'desc': play['desc'],
    'team': play['posteam'],
    'quarter': play['qtr'],
    'time': play['time'],
    'key': play['key']
    }


gameIds = open(args[0]).readlines()
fumbles = []
safeties = []
interceptions = []

for id in gameIds:
  id = id.strip()
  url = "http://www.nfl.com/liveupdate/game-center/%s/%s_gtd.json" % (id, id)
  raw = urllib.request.urlopen("http://www.nfl.com/liveupdate/game-center/%s/%s_gtd.json" % (id, id)).read()
  if options.dump:
    print(url)
    print(raw)
    continue
  process(raw, fumbles, safeties, interceptions)

if options.firebase:
  fumble_ref = db.reference('/events/%s/%s/fumbles' % (options.year, options.week))
  fumble_ref.set(fumbles)

  safety_ref = db.reference('/events/%s/%s/safeties' % (options.year, options.week))
  safety_ref.set(safeties)

  interception_ref = db.reference('/events/%s/%s/interceptions' % (options.year, options.week))
  interception_ref.set(interceptions)

