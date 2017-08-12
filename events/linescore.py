"""Reads line score data.

This gives us the scores and possession status for every game at once, se we can
decide which box scores to refresh next.
"""

import collections
import datetime
import json
import urllib.request


_SCORES_URL = 'https://feeds.nfl.com/feeds-rs/scores.json'


Game = collections.namedtuple(
    'Game', ('home', 'hscore', 'away', 'ascore', 'start_time'))
Game.__doc__ = """The score and schedule for a game.

Attributes:
    home_team: The home team abbreviation, e.g., 'ATL'.
    away_team: The away team abbreviation, e.g., 'NE'.
    home_score: The home team's score. None if the game hasn't started.
        Otherwise, an integer, such as 28.
    away_team: The away team's score. None if the game hasn't started.
        Otherwise, an integer, such as 3.
    start_time: The start time of the game, as a datetime.datetime.
"""


def parse_game_json(json_obj):
    sched = json_obj.get('gameSchedule')
    score = json_obj.get('score')
    home_team = sched['homeTeamAbbr']
    away_team = sched['visitorTeamAbbr']
    if score:
        home_score = score['homeTeamScore']['pointTotal']
        away_score = score['visitorTeamScore']['pointTotal']
    else:
        home_score = None
        away_score = None
    start_time = datetime.datetime.fromtimestamp(sched['isoTime'] / 1000)
    return Game(home=home_team,
                away=away_team,
                hscore=home_score,
                ascore=away_score,
                start_time=start_time)


def main():
    # TODO: Get rid of this and make this module actually do something.
    raw = urllib.request.urlopen(_SCORES_URL).read()
    data = json.loads(str(raw, 'utf-8')).get('gameScores')
    if not data:
        return
    games = []
    for obj in data:
        games.append(parse_game_json(obj))
    for g in games:
        delta = datetime.datetime.now() - g.start_time
        if delta > datetime.timedelta(0):
            print('{delta} ago: {ateam} {ascore} - {hteam} {hscore}'
                  .format(delta=delta, ateam=g.away, ascore=g.ascore,
                          hteam=g.home, hscore=g.hscore))
        else:
            print('in {delta}: {ateam} - {hteam}'
                  .format(delta=-delta, ateam=g.away, hteam=g.home))


if __name__ == '__main__':
    main()
