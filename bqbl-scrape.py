# Usage: bqbl-scrape.py <file with list of ESPN game IDs>
import collections
import json
import optparse
import sys
import time
import traceback
import urllib

from bs4 import BeautifulSoup

OUTPUT_FORMATS = ['tab', 'json']

parser = optparse.OptionParser(
  usage=("Usage: %prog [options] <file with list of ESPN game IDs> "
         "[<corrections file>]"))
parser.add_option("-o", "--output_format", dest="output_format", default="tab",
                  help="Output format. Valid values: %s." % OUTPUT_FORMATS)
options, args = parser.parse_args()

if len(args) < 1 or len(args) > 2:
  parser.print_usage()
  sys.exit(1)

if options.output_format not in OUTPUT_FORMATS:
  print >> sys.stderr, 'output format %s is not valid' % options.output_format
  sys.exit(1)


ALL_TEAMS = ("ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN","DET",
             "GB","HOU","IND","JAX","KC","MIA","MIN","NE","NO","NYG","NYJ",
             "OAK", "PHI","PIT","SD","SEA","SF","STL","TB","TEN","WSH")


# Gross global variables
notes = []
scores = []


class ScrapeException(Exception):
  @property
  def message(self):
    return self.args[0]


class InvalidCorrectionError(Exception):
  """Raised when the manual correction data can't be parsed."""


class QbStats(object):
  """A collection of stats.

  Attributes might be strings; be careful when you do math on them.
  """

  def __init__(self, team=0, completions=0, attempts=0, pass_tds=0,
               interceptions_notd=0, interceptions_td=0, rush_tds=0,
               fumbles_lost_notd=0, fumbles_lost_td=0, fumbles_kept=0,
               pass_yards=0, rush_yards=0, sacks=0, sack_yards=0, long_pass=0,
               safeties=0, game_losing_taint=False, benchings=0,
               street_free_agent=0, game_time='', boxscore_url='', opponent=''):
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
    self.sacks = sacks
    self.sack_yards = sack_yards
    self.long_pass = long_pass
    self.safeties = safeties
    self.game_losing_taint = game_losing_taint
    self.benchings = benchings
    self.street_free_agent = street_free_agent
    self.game_time = game_time
    self.boxscore_url = boxscore_url
    self.opponent = opponent

  def _StringifyStat(self, stat):
    if not stat:
      return ""
    else:
      return str(stat)

  def AsSpreadsheetRow(self, delimiter="\t"):
    # Intentionally omits game_time and opponent.
    return delimiter.join(
        [self._StringifyStat(item) for item in
         [self.team, self.completions, self.attempts, self.pass_tds,
          self.interceptions_notd, self.interceptions_td, self.rush_tds,
          self.fumbles_lost_notd, self.fumbles_kept, self.fumbles_lost_td,
          self.pass_yards, self.rush_yards, self.sacks, self.sack_yards,
          self.long_pass, self.safeties, self.game_losing_taint, self.benchings,
          self.street_free_agent]])

  def AsDictionary(self):
    # This is a little risky if we start including additional fields that
    # shouldn't be exported.
    return self.__dict__.copy()


Team = collections.namedtuple('Team', ['long_name', 'short_name', 'abbrev'])


def ApplyCorrections(qbstats, delta_dict):
  for attribute, value_delta in delta_dict.items():
    try:
      old_value = getattr(qbstats, attribute)
      setattr(qbstats, attribute, int(old_value) + int(value_delta))
    except AttributeError:
      raise InvalidCorrectionError(
          'Invalid attribute "%s" in corrections file' % attribute)


def SelectAndGetText(soup, selector, default='0'):
  if soup:
    elem = soup.select_one(selector)
    if elem:
      return elem.get_text()

  if default is None:
    raise ScrapeException('found no match for "%s" in element: %s' %
                          (selector, soup))
  else:
    return str(default)


def FindTeams(boxscore_soup):
  """Returns the 2-tuple of teams in the box score.

  Raises ScrapeException if not exactly 2 teams are found.
  """
  team_elems = boxscore_soup.select('.team-info .team-name')
  teams = []
  abbrs = []
  for t in team_elems:
    teams.append(
        Team(long_name=SelectAndGetText(t, '.long-name', default=None),
             short_name=SelectAndGetText(t, '.short-name', default=None),
             abbrev=SelectAndGetText(t, '.abbrev', default=None)))
  if len(teams) != 2:
    raise ScrapeException('expected exactly 2 teams, but found %s' %
                          [t.abbrev for t in teams])
  return teams


def QbNames(passing_soup):
  return [e.get_text() for e in passing_soup.select('tbody .name')
          if e.get_text() != 'TEAM']


def IntOrZero(s):
  try:
    return int(s)
  except ValueError:
    return 0


def Scrape(url, corrections=None):
  """Scrape the given URL, and add the results to the global state.

  Args:
    url: An ESPN box score URL.
    corrections: A dict defining manual corrections to apply to the scraped
        scores. Each key is a team name. Each value is a dict whose keys are
        the names of QbStats attributes, and whose values are integers, which
        may be negative. The integer is added to the QbStats attribute obtained
        from the scrape for that team.
  """
  global notes

  corrections = corrections or {}
  box_html = urllib.urlopen(url).read()
  box_soup = BeautifulSoup(box_html, 'lxml')

  teams = FindTeams(box_soup)

  def Section(sec, col):
    return box_soup.select_one('#gamepackage-%s .column-%s .mod-data' %
                               (sec, col))
  
  for team, opponent, col, opp_col in ((teams[0], teams[1], 'one', 'two'),
                                       (teams[1], teams[0], 'two', 'one')):
    qbstats = QbStats()

    qbstats.team = team.abbrev
    qbstats.opponent = opponent.abbrev
    qbstats.boxscore_url = url
    passing = Section('passing', col)
    if not passing:
      continue
    qb_names = set(QbNames(passing))
    if len(qb_names) > 1:
      notes.append('%s had %d passers: %s' %
                   (team.abbrev, len(qb_names), ', '.join(qb_names)))

    team_passing = passing.select_one('tbody tr.highlight')
    if team_passing:
      if SelectAndGetText(team_passing, '.name', default='') == 'TEAM':
        # Is the sacks column always present? In the past, it wasn't always.
        comp_stats = SelectAndGetText(team_passing, '.c-att', default='0/0')
        comp, att = comp_stats.split('/', 1)
        qbstats.completions = IntOrZero(comp)
        qbstats.attempts = IntOrZero(att)
        qbstats.pass_yards = IntOrZero(SelectAndGetText(team_passing, '.yds'))
        qbstats.pass_tds = IntOrZero(SelectAndGetText(team_passing, '.td'))
        sack_stats = SelectAndGetText(team_passing, '.sacks', default='0-0')
        sacks, sack_yards = sack_stats.split('-', 1)
        qbstats.sacks = IntOrZero(sacks)
        qbstats.sack_yards = IntOrZero(sack_yards)
      else:
        # TODO(juangj): Log warning.
        pass

    rushing = Section('rushing', col)
    if rushing:
      for row in rushing.select('tbody tr'):
        name = SelectAndGetText(row, '.name', default='')
        if name in qb_names:
          qbstats.rush_yards += IntOrZero(SelectAndGetText(row, '.yds'))
          qbstats.rush_tds += IntOrZero(SelectAndGetText(row, '.td'))

    interceptions = Section('interceptions', opp_col)
    if interceptions:
      opp_interceptions = interceptions.select_one('tbody tr.highlight')
      # tr.highlight won't exist if the opponents made no interceptions.
      if opp_interceptions:
        num_ints = IntOrZero(SelectAndGetText(opp_interceptions, '.int'))
        num_int_tds = IntOrZero(SelectAndGetText(opp_interceptions, '.td'))
        qbstats.interceptions_td = num_int_tds
        qbstats.interceptions_notd = num_ints - num_int_tds

    fumbles = Section('fumbles', col)
    if fumbles:
      for row in fumbles.select('tbody tr'):
        name_cell = row.select_one('.name')
        if not name_cell:  # Occurs if there were no fumbles.
          continue
        name = name_cell.get_text()
        if name in qb_names:
          fums = IntOrZero(SelectAndGetText(row, '.fum'))
          fums_lost = IntOrZero(SelectAndGetText(row, '.lost'))
          # TODO: Scrape the play-by-play to determine when a fumble is lost for a
          # TD. Until then, we have to keep manually-correcting all such
          # occurrences. The scoring summary also no longer appears on the page,
          # so we no longer get a warning when there was a fumble return TD.
          qbstats.fumbles_kept += fums - fums_lost
          qbstats.fumbles_lost_notd += fums_lost

    receiving = Section('receiving', col)
    if receiving:
      team_receiving = receiving.select_one('tbody tr.highlight')
      if SelectAndGetText(team_receiving, '.name', default='') == 'TEAM':
        qbstats.long_pass = IntOrZero(SelectAndGetText(team_receiving, '.long'))
      else:
        # TODO(juangj): Log warning.
        pass

    qbstats.game_time = SelectAndGetText(box_soup, '.game-status .game-time',
                                         default='(game clock unknown)')

    if team.abbrev in corrections:
      ApplyCorrections(qbstats, corrections[team.abbrev])

    scores.append(qbstats)


gameIds = open(args[0]).readlines()
corrections = {}
if len(args) > 1:
  try:
    parsed_json = json.loads(open(args[1]).read())
  except ValueError as e:
    raise InvalidCorrectionError('JSON file %s could not be parsed: %s' %
                                 (args[1], e))
  try:
    corrections_list = parsed_json['corrections']
  except KeyError:
    raise InvalidCorrectionError('Required key "corrections" not found in JSON')
  for team_num, team_dict in enumerate(corrections_list):
    try:
      team_name = team_dict['team']
      if team_name not in ALL_TEAMS:
        raise InvalidCorrectionError(
            'Invalid corrections entry: Unrecognized team %s' % team_name)
      corrections[team_name] = team_dict['deltas']
    except KeyError as e:
      raise InvalidCorrectionError(
          'Invalid corrections entry at position %d' % team_num)
      

for gameId in gameIds:
  url = 'http://scores.espn.com/nfl/boxscore?gameId=' + gameId.strip()
  try:
    Scrape(url, corrections)
  except Exception as e:
    traceback.print_exc(file=sys.stderr)

now = time.time()

if options.output_format == 'tab':
  # Add dummy lines for teams that haven't played.
  lines = [score.AsSpreadsheetRow() for score in scores]
  found_teams = set([score.team for score in scores])
  for t in ALL_TEAMS:
    if t not in found_teams:
      lines.append(t)
  lines.sort()
  print "\n".join(lines)
  print "Updated: %s" % time.strftime("%Y-%m-%d %H:%M:%S %Z",
                                      time.localtime(now))
  print "\n".join(notes)
elif options.output_format == 'json':
  print json.dumps({
      'lastUpdate': now,
      'scores': [score.AsDictionary() for score in scores],
      })
