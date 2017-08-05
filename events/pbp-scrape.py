import collections
import copy
import json
import optparse
import sys
import urllib.request

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


def parse_play(play):
  offense_team = play['posteam']
  qbs = []
  defenders = []
  outcomes = collections.defaultdict(int)
  for pid, player in play['players'].items():
    if player[0]['clubcode'] == offense_team:
      # TODO(aerion): Look up player's position and only count stats by QBs.
      qbs.append(player)
    else:
      defenders.append(player)
  # TODO(aerion): Check other stats, like safeties.
  for qb in qbs:
    for stat in qb:
      sid = stat['statId']
      if sid == 19:
        outcomes['INT'] += 1
      elif sid in (52, 53):
        outcomes['FUM'] += 1
      elif sid == 106:
        outcomes['FUML'] += 1
  for defender in defenders:
    for stat in defender:
      sid = stat['statId']
      if sid in (26, 28):
        outcomes['INT6'] += 1
      elif sid in (60, 62):
        outcomes['FUM6'] += 1
  return outcomes


class Plays(object):

  def __init__(self):
    self.fumbles = []
    self.safeties = []
    self.interceptions = []
    self.outcomes_by_team = collections.defaultdict(lambda: collections.defaultdict(int))

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

        outcomes = parse_play(play)
        for k, v in outcomes.items():
          self.outcomes_by_team[play['posteam']][k] += v

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
    print(json.dumps(plays.outcomes_by_team))


main()
