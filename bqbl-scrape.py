# Usage: bqbl-scrape.py <file with list of ESPN URLs>
import re
import sys
import urllib

qb_stats = r"<th>(\d+).(\d+)<.th><th>(\d+)<.th><th>.*<.th><th>(\d+)<.th><th>(\d+)<.th>"
qb_re = re.compile(qb_stats)
name_re = re.compile("(\w. \w+)</a>")
int_re = re.compile("(Interception Return)")
fumret_re = re.compile("Fumble Return")
team_re = re.compile(">(...?) Passing")

notes = ""
lines = []
teams = ["ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN","DET",
         "GB","HOU","IND","JAC","KC","MIA","MIN","NE","NO","NYG","NYJ","OAK",
         "PHI","PIT","SD","SEA","SF","STL","TB","TEN","WSH"]
found_teams = []

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


def scrape(url):
  global notes, found_teams
  data = urllib.urlopen(url).read()
  passing1 =  data.split("Passing</th>")[1].split("Rushing")[0]
  passing2 = data.split("Passing</th>")[2].split("Rushing")[0]
  passing_total1 = passing1.split("Team")[1]
  passing_total2 = passing2.split("Team")[1]

  rushing1 = data.split("Rushing</th>")[1].split("Receiving")[0]
  rushing2 = data.split("Rushing</th>")[2].split("Receiving")[0]
  fumbles1 = data.split("Fumbles</th>")[1].split("Interceptions")[0]
  fumbles2 = data.split("Fumbles</th>")[2].split("Interceptions")[0]

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
    int1  = pass1_match.group(5)

  pass2_match = qb_re.search(passing_total2)
  if pass2_match:
    comp2 = pass2_match.group(1)
    att2  = pass2_match.group(2)
    yds2  = pass2_match.group(3)
    td2   = pass2_match.group(4)
    int2  = pass2_match.group(5)

  lines.append(
    "\t".join([str(item) for item in
               [team1, comp1, att1, td1, int1, "i6", rushtd1, fumlost1,
                fumkept1, "fum6", yds1, rushy1]]))
  lines.append(
      "\t".join([str(item) for item in
                 [team2, comp2, att2, td2, int2, "i6", rushtd2, fumlost2,
                  fumkept2, "fum6", yds2, rushy2]]))

  if int_re.findall(data):
    notes += " %s %s Interception Return" % (team1, team2)
  if fumret_re.findall(data):
    notes += " %s %s Fumble Return" % (team1, team2)

urls=open(sys.argv[1]).readlines()

for url in urls:
  scrape(url)

# Add dummy lines for teams that haven't played.
for team in teams:
  if team not in found_teams:
    lines.append(team)
lines.sort()
print "\n".join(lines)
print notes
