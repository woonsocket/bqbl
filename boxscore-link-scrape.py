# Grabs the game IDs for all the NFL games in a given week and outputs
# the box score URLs for the games.
# Usage: %prog <weeknum>

import re
import sys
import urllib

WEEKLY_SCOREBOARD_URL_PATTERN = (
    'http://scores.espn.go.com/nfl/scoreboard?seasonYear=2014&seasonType=2'
    '&weekNumber=%s')

BOX_SCORE_URL_PATTERN = (
    'http://scores.espn.go.com/nfl/boxscore?gameId=%s')

week_num = int(sys.argv[1])

scoreboard_data = urllib.urlopen(
    WEEKLY_SCOREBOARD_URL_PATTERN % week_num).read()

GAME_ID_RE = re.compile('class="sort".*?>([\d]+?)<')
matches = GAME_ID_RE.findall(scoreboard_data)

for match in matches:
    print BOX_SCORE_URL_PATTERN % match
