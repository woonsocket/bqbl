import requests
import json
import re

def mickey_ids(yearId, weekId, dst, preseason=False):
  url = 'https://www.espn.com/nfl/scoreboard/_/year/%s/seasontype/2/week/%s' %(yearId, weekId)
  if preseason:
    url = 'https://www.espn.com/nfl/scoreboard/_/year/%s/seasontype/1/week/%s' %(yearId, weekId)
  headers = {'Content-Type': 'text/html', 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'}
  response = requests.get(url, headers=headers)
  html = response.text
  pat = re.compile('href="/nfl/game/_/gameId/([0-9]{9})')
  ids = pat.findall(html)
  print(yearId, weekId, ids)
  if preseason: weekId += 'P'
  year = dst.get(yearId, {})
  year[weekId] = ids
  dst[yearId] = year


if __name__ == "__main__":
  dst = {}
  # ANNUAL
  years = [str(y) for y in range(2023, 2024)]
  try:
    for year in years:
      for week in range(1, 6):
        mickey_ids(year, str(week), dst, preseason=True)
      for week in range(1, 19):
        mickey_ids(year, str(week), dst)
  except: pass
  print(dst)
