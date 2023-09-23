"""Reads line score data.

This gives us the scores and possession status for every game at once, se we can
decide which box scores to refresh next.
"""

import collections
import datetime
import json
import requests

_SCORES_URL_TPL = 'https://api.nfl.com/experience/v1/games?season=%s&seasonType=REG'
_WEEK_TPL = '&week=%s'

Game = collections.namedtuple(
    'Game',
    ('id', 'home', 'hscore', 'away', 'ascore', 'poss', 'start_time', 'clock',
     'alert', 'is_over'))
Game.__doc__ = """The score and schedule for a game.

Attributes:
    id: The game ID.
    home: The home team abbreviation, e.g., 'ATL'.
    away: The away team abbreviation, e.g., 'NE'.
    hscore: The home team's score. None if the game hasn't started.
        Otherwise, an integer, such as 28.
    ascore: The away team's score. None if the game hasn't started.
        Otherwise, an integer, such as 3.
    poss: The team that currently has possession. This is either the home team,
        the away team, or the empty string if nobody has possession (the game is
        over, it's halftime, etc.).
    start_time: The start time of the game, as a datetime.datetime.
    clock: Number of seconds elapsed on the game clock since the start of the
        game. 0 if the game hasn't started. This value is not well-defined if
        the game is over. Check is_over instead.
    alert: A "big play" that just happened. Usually the empty string, but is
        populated for a few minutes after a major event. Known values include:
        FG, FOURTH_FAIL, FUM_LOST, INT, PAT, TD
    is_over: Whether this game is over.
"""


def parse_game_json(json_obj):
    # sched = json_obj.get('gameSchedule')
    # score = json_obj.get('score')
    detail = json_obj.get('detail')
    game_id = json_obj.get('id')
    home_team = json_obj.get('homeTeam').get('abbreviation')
    away_team = json_obj.get('awayTeam').get('abbreviation')
    if detail:
        home_score = detail['homePointsTotal']
        away_score = detail['visitorPointsTotal']
        poss = ''
        clock = parse_game_clock(detail['phase'], detail['gameClock'])
        # alert = score['alertPlayType'] or ''
        alert = ''
        is_over = detail['phase'].upper() == 'FINAL'
    else:
        home_score = None
        away_score = None
        poss = ''
        clock = 0
        alert = ''
        is_over = False
    start_time = datetime.datetime.fromisoformat(json_obj.get('time')[:-1])
    return Game(id=game_id,
                home=home_team,
                away=away_team,
                hscore=home_score,
                ascore=away_score,
                poss=poss,
                start_time=start_time,
                clock=clock,
                alert=alert,
                is_over=is_over)


def parse_game_clock(phase, clock):
    """Parses the game clock.

    Args:
        phase: The phase of the game, e.g., 'Q1', 'Q3', 'FINAL'. Not sure what
            overtime is, but it's probably 'OT'.
        clock: The current game clock, as a string, e.g., '03:28'.
    Returns:
        The number of seconds elapsed on the game clock since the start of the
        game. For example, 920 means the clock shows 14:40 in the 2nd quarter.
        If the game is over, returns some large value.
    """
    if not clock:
        return 0
    # TODO: Find out what the phase is for overtime. Also, whether overtime
    # finals are shown differently ('F/OT'?)
    if phase.upper() == 'FINAL':
        # Larger than any regulation game (5 quarters at most).
        return 5 * 900 + 1
    if phase.upper() == 'HALFTIME':
        return 1800
    if phase.upper() in ('Q1', 'Q2', 'Q3', 'Q4'):
        qnum = int(phase[1])
    elif phase.upper() == 'OT':
        qnum = 5
    else:
        # Unknown phase.
        return 0
    if ':' not in clock:
        # Unknown clock format.
        return 0
    try:
        mm_str, ss_str = clock.split(':')
        mm = int(mm_str)
        ss = int(ss_str)
    except ValueError:
        return 0
    clock_secs = 60 * mm + ss
    return qnum * 900 - clock_secs


# TODO fix override
def fetch(season='2023', week=2):
    """Get line scores for whatever the current week is.

    Returns:
        (season, week, games)
        games is a dict mapping game IDs to Games. Each game's ID is unique, and
        is constant between fetches, so you can compare Games fetched at
        different times.
    """
    week_section = _WEEK_TPL % week if week else ''
    url = _SCORES_URL_TPL % season + week_section
    payload = {"clientKey":"4cFUW6DmwJpzT9L7LrG3qRAcABG5s04g","clientSecret":"CZuvCL49d9OwfGsR","deviceId":"9c716807-a922-4f27-9d1a-3ea8a3a4259e","deviceInfo":"eyJtb2RlbCI6ImRlc2t0b3AiLCJ2ZXJzaW9uIjoiQ2hyb21lIiwib3NOYW1lIjoiV2luZG93cyIsIm9zVmVyc2lvbiI6IjEwIn0=","networkType":"other"}
    r = requests.post("https://api.nfl.com/identity/v3/token", data=payload)
    access_token = json.loads(r.text)['accessToken']
    headers_2 = {'Authorization': 'Bearer ' + access_token}
    resp = requests.get(url, headers=headers_2)
    data = json.loads(resp.text)
    scores = data.get('games')
    if not scores:
        return {}
    games = {}
    for obj in scores:
        game = parse_game_json(obj)
        games[game.id] = game
    week = scores[0]['week']
    if scores[0]['seasonType'] == 'PRE':
        week = 'P{0}'.format(week)
    return scores[0]['season'], week, games
