# Grabs the game IDs for all the NFL games in a given week and outputs
# the box score URLs for the games.
# Usage: %prog <weeknum>

import sys
import urllib

from bs4 import BeautifulSoup

SCHEDULE_URL_PATTERN = (
    'http://espn.go.com/nfl/schedule/_/seasontype/2/week/%s')

CONVERSATION_URL_PREFIX = (
    'http://espn.go.com/nfl/conversation?gameId=')

week_num = int(sys.argv[1])
url = SCHEDULE_URL_PATTERN % week_num

scoreboard_data = urllib.urlopen(url).read()
scoreboard_soup = BeautifulSoup(scoreboard_data, 'lxml')

# Hm, looks like the <article> tags are rendered by JS
game_links = scoreboard_soup.find_all(
    href=lambda s: s and s.startswith(CONVERSATION_URL_PREFIX))
if not game_links:
    raise Exception('no games found on %s' % url)
print len(game_links)
for game in game_links:
    print game['href'].replace('/conversation', '/boxscore')
