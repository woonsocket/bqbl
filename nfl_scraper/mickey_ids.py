import requests
import json
import re

def mickey_ids(yearId, weekId, dst):
  url = 'https://www.espn.com/nfl/scoreboard/_/year/%s/seasontype/2/week/%s' %(yearId, weekId)
  headers = {'Content-Type': 'text/html',}
  response = requests.get(url, headers=headers)
  html = response.text
  pat = re.compile('href="/nfl/game/_/gameId/([0-9]{9})')
  ids = pat.findall(html)
  print(yearId, weekId, ids)
  year = dst.get(yearId, {})
  year[weekId] = ids
  dst[yearId] = year


if __name__ == "__main__":
  dst = {}
  # ANNUAL
  years = [str(y) for y in range(2009, 2023)]
  try:
    for year in years:
      for week in range(1, 19):
        mickey_ids(year, str(week), dst)
  except: pass
  print(dst)
