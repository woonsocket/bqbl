import requests
import json
import re

def find_end(str):
  i = 0
  bracket = 0
  for c in str:
    i+=1
    if c == "{":
      bracket += 1
    elif c == '}':
      bracket -= 1
      if bracket == 0:
        return i 

def mickey_ids(yearId, weekId, dst):
  url = 'https://www.espn.com/nfl/scoreboard/_/year/%s/seasontype/2/week/%s' %(yearId, weekId)
  headers = {'Content-Type': 'text/html',}
  response = requests.get(url, headers=headers)
  html = response.text
  pat = re.compile('.*<script>window.espn.scoreboardData \t=(.*)</script>')
  match = pat.search(html)
  trimmed = match.group(1)[0:find_end(match.group(1))]
  data = json.loads(trimmed)
  ids = [game['id'] for game in data['events']]
  print(yearId, weekId, ids)
  year = dst.get(yearId, {})
  year[weekId] = ids
  dst[yearId] = year


if __name__ == "__main__":
  dst = {}
  # ANNUAL
  years = [str(y) for y in range(2009, 2022)]
  try:
    for year in years:
      for week in range(1, 19):
        mickey_ids(year, str(week), dst)
  except: pass
  print(dst)
