# Usage: bqbl-scrape.py <file with list of ESPN URLs>
import json
import optparse
import re
import sys
import time
import urllib

parser = optparse.OptionParser(
  usage="Usage: %prog [options] <file with list of ESPN URLs>")
parser.add_option("-o", "--output_format", dest="output_format", default="tab",
                  help="Output format. Valid values: ['tab', 'json'].")
options, args = parser.parse_args()

if len(args) < 1:
  parser.print_usage()
  sys.exit(1)

qb_stats = r"<th>(\d+).(\d+)<.th><th>(\d+)<.th><th>.*<.th><th>(\d+)<.th><th>(\d+)<.th>"
qb_re = re.compile(qb_stats)
name_re = re.compile("(\w. \w+)</a>")
int_re = re.compile("(Interception Return)")
fumret_re = re.compile("Fumble Return")
team_re = re.compile(">(...?) Passing")

notes = []
scores = []
teams = ["ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN","DET",
         "GB","HOU","IND","JAC","KC","MIA","MIN","NE","NO","NYG","NYJ","OAK",
         "PHI","PIT","SD","SEA","SF","STL","TB","TEN","WSH"]
found_teams = []


class QbStats(object):
  """A collection of stats.

  Attributes might be strings; be careful when you do math on them.
  """

  def __init__(self, team=0, completions=0, attempts=0, pass_tds=0,
               interceptions_notd=0, interceptions_td=0, rush_tds=0,
               fumbles_lost_notd=0, fumbles_lost_td=0, fumbles_kept=0,
               pass_yards=0, rush_yards=0, over25=False):
    """Initializer.

    If you don't pass arguments by name, you're gonna have a bad time.
    """
    self.team = team
    self.completions = completions
    self.attempts = attempts
    self.pass_tds = pass_tds
    self.interceptions_notd = interceptions_notd
    self.interceptions_td = interceptions_td
    self.rush_tds = rush_tds
    self.fumbles_lost_notd = fumbles_lost_notd
    self.fumbles_lost_td = fumbles_lost_td
    self.fumbles_kept = fumbles_kept
    self.pass_yards = pass_yards
    self.rush_yards = rush_yards
    self.over25 = over25

  def _StringifyStat(self, stat):
    if stat is None:
      return ""
    else:
      return str(stat)

  def AsSpreadsheetRow(self, delimiter="\t"):
    return delimiter.join(
        [self._StringifyStat(item) for item in
         [self.team, self.completions, self.attempts, self.pass_tds,
          self.interceptions_notd, self.interceptions_td, self.rush_tds,
          self.fumbles_lost_notd, self.fumbles_kept, self.fumbles_lost_td,
          self.pass_yards, self.rush_yards, self.over25]])

  def AsDictionary(self):
    # This is a little risky if we start including additional fields that
    # shouldn't be exported.
    return self.__dict__.copy()


def qb_rush(rush_data, fum_data,  qb):
  rush_re = re.compile(r">%s<.a><.td><td>(.?\d+)<.td><td>(.?\d+)<.td><td>.*?<.td><td>(.?\d+)<.td>" % qb)
  fum_re = re.compile(r">%s<.a><.td><td>(\d+)<.td><td>(\d+)<.td>" % qb)
  rushy, rushtd, fumlost, fumkept = (0,0,0,0)

  rush_match = rush_re.search(rush_data)
  if rush_match:
    rushy = int(rush_match.group(2))
    rushtd = int(rush_match.group(3))

  fum_match = fum_re.search(fum_data)
  if fum_match:
    fum = int(fum_match.group(1))
    fumlost = int(fum_match.group(2))
    fumkept = fum - fumlost

  return (rushy, rushtd, fumlost, fumkept)


def team_int(int_data):
  """Returns (non-TD interceptions, int TDs).
  If data couldn't be parsed, returns two non-integer strings.
  """
  # Match the first and last columns, because sometimes ESPN sticks a "yards"
  # column in the middle.
  team_int_re = re.compile(r"Team</th><th>(\d+)</th>.*?<th>(\d+)</th></tr>")
  int_match = team_int_re.search(int_data)
  if not int_data:
    return "int", "int6"
  all_ints, td_ints = int_match.group(1, 2)
  try:
    return int(all_ints) - int(td_ints), int(td_ints)
  except ValueError:
    return "int", "int6"


def team_rec(rec_data):
  """Returns "TRUE" iff there was a reception > 25 yards.
  If data couldn't be parsed, returns "??".
  """
  team_rec_re = re.compile(r"Team</th><th>\d+</th><th>\d+</th><th>.*</th><th>\d+</th><th>(\d+)</th><th>\d+</th></tr>")
  rec_match = team_rec_re.search(rec_data)
  if not rec_data:
    return "??"
  lg = rec_match.group(1)
  if int(lg) > 24:
    return "TRUE"
  return "FALSE"


def scrape(url):
  global notes, found_teams
  data = urllib.urlopen(url).read()
  passing1 =  data.split("Passing</th>")[1].split("Rushing")[0]
  passing2 = data.split("Passing</th>")[2].split("Rushing")[0]
  passing_total1 = passing1.split("Team")[1]
  passing_total2 = passing2.split("Team")[1]

  rushing1 = data.split("Rushing</th>")[1].split("Receiving")[0]
  rushing2 = data.split("Rushing</th>")[2].split("Receiving")[0]

  receiving1 = data.split("Receiving</th>")[1].split("Fumbles")[0]
  receiving2 = data.split("Receiving</th>")[2].split("Fumbles")[0]

  if "Fumbles</th>" in data:
    fumbles1 = data.split("Fumbles</th>")[1].split("Interceptions")[0]
    fumbles2 = data.split("Fumbles</th>")[2].split("Interceptions")[0]
  else:
    fumbles1 = ""
    fumbles2 = ""

  team1 = team_re.findall(data)[0]
  team2 = team_re.findall(data)[1]
  found_teams += [team1, team2]

  rushy1, rushtd1, fumlost1, fumkept1 = (0,0,0,0)
  qb1s = name_re.findall(passing1)
  for qb in qb1s:
    rushy1qb, rushtd1qb, fumlost1qb, fumkept1qb = qb_rush(rushing1, fumbles1, qb)
    rushy1   += rushy1qb
    rushtd1  += rushtd1qb
    fumlost1 += fumlost1qb
    fumkept1 += fumkept1qb

  rushy2, rushtd2, fumlost2, fumkept2 = (0,0,0,0)
  qb2s = name_re.findall(passing2)
  for qb in qb2s:
    rushy2qb, rushtd2qb, fumlost2qb, fumkept2qb = qb_rush(rushing2, fumbles2, qb)
    rushy2   += rushy2qb
    rushtd2  += rushtd2qb
    fumlost2 += fumlost2qb
    fumkept2 += fumkept2qb

  pass1_match = qb_re.search(passing_total1)
  if pass1_match:
    comp1 = pass1_match.group(1)
    att1  = pass1_match.group(2)
    yds1  = pass1_match.group(3)
    td1   = pass1_match.group(4)
  else:
    comp1, att1, yds1, td1 = (0, 0, 0, 0)

  pass2_match = qb_re.search(passing_total2)
  if pass2_match:
    comp2 = pass2_match.group(1)
    att2  = pass2_match.group(2)
    yds2  = pass2_match.group(3)
    td2   = pass2_match.group(4)
  else:
    comp2, att2, yds2, td2 = (0, 0, 0, 0)

  # ints1 = interceptions thrown by team 1 (i.e., interceptions made by team 2)
  if "Interceptions</th>" in data:
    ints1 = data.split("Interceptions</th>")[2].split("Kick Returns")[0]
    ints2 = data.split("Interceptions</th>")[1].split("Kick Returns")[0]

    int1, inttd1 = team_int(ints1)
    int2, inttd2 = team_int(ints2)
  else:
    int1, inttd1, int2, inttd2 = (0, 0, 0, 0)

  longpass1 = team_rec(receiving1)
  longpass2 = team_rec(receiving2)

  scores.append(
      QbStats(team=team1,
              completions=comp1,
              attempts=att1,
              pass_tds=td1,
              interceptions_notd=int1,
              interceptions_td=inttd1,
              rush_tds=rushtd1,
              fumbles_lost_notd=fumlost1,  # Includes fumble return TDs...
              fumbles_lost_td=None,  # ... because we can't compute this yet.
              fumbles_kept=fumkept1,
              pass_yards=yds1,
              rush_yards=rushy1,
              over25=longpass1))
  scores.append(
      QbStats(team=team2,
              completions=comp2,
              attempts=att2,
              pass_tds=td2,
              interceptions_notd=int2,
              interceptions_td=inttd2,
              rush_tds=rushtd2,
              fumbles_lost_notd=fumlost2,
              fumbles_lost_td=None,
              fumbles_kept=fumkept2,
              pass_yards=yds2,
              rush_yards=rushy2,
              over25=longpass2))

  if fumret_re.findall(data):
    notes.append(" %s %s Fumble Return" % (team1, team2))

urls=open(args[0]).readlines()

for url in urls:
  scrape(url)

if options.output_format == 'tab':
  # Add dummy lines for teams that haven't played.
  lines = [score.AsSpreadsheetRow() for score in scores]
  for team in teams:
    if team not in found_teams:
      lines.append(team)
  lines.sort()
  print "\n".join(lines)
  print "Updated: %s" % time.strftime("%Y-%m-%d %H:%M:%S %Z")
  print "\n".join(notes)
elif options.output_format == 'json':
  print json.dumps([score.AsDictionary() for score in scores])
