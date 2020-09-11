import requests
from lxml import etree

PASSING = './/*[@id="gamepackage-passing"]'
ONE= '//div[@class="col column-one gamepackage-away-wrap"]'
TWO= '//div[@class="col column-two gamepackage-home-wrap"]'
TOTAL= '//tr[@class="highlight"]'
C_ATT= './/td[@class="c-att"]'
YDS = './/td[@class="yds"]'
TD = './/td[@class="td"]'
INT = './/td[@class="int"]'
SACKS = './/td[@class="sacks"]'
FUM = './/td[@class="fum"]'
LOST = './/td[@class="lost"]'
REC = './/td[@class="rec"]'
LONG = './/td[@class="long"]'
TEAM_NAME = '//div[@class="team-name"]'
RUSHING = './/*[@id="gamepackage-rushing"]'
FUMBLING = './/*[@id="gamepackage-fumbles"]'
RECEIVING = './/*[@id="gamepackage-receiving"]'
INTERCEPTIONS = './/*[@id="gamepackage-interceptions"]'
PLAYER = './/td[@class="name"]'
ONE_NAME = '//div[contains(@class, "away")]//span[@class="abbrev"]'
TWO_NAME = '//div[contains(@class, "home")]//span[@class="abbrev"]'
CLOCK = '//span[@class="status-detail"]'
GAMES = "//a[@name='&lpos=nfl:scoreboard:boxscore']"


# let ids = []; for (let anchor of $x("//a[@name='&lpos=nfl:scoreboard:gamecast']")) {let components = anchor.href.split('/'); ids.push(components[components.length - 1])}; console.log(ids)
def all_games(year, week):
  if week == "1":
    return ["401220225", "401220131", "401220352", "401220313", "401220116", "401220282", "401220300", "401220268", "401220370", "401220195", "401220147", "401220161", "401220369", "401220347", "401220256", "401220217"]


def all_passers(tree):
  if not tree: return
  assert len(tree) == 1
  tree = tree[0]

  # Omit last element, which is the total
  passer_paths = tree.xpath(PLAYER)[:-1]
  passers = {}
  for path in passer_paths:
    root = path.getparent()
    link = path.xpath(".//a")[0]
    name = path.xpath(".//a//span")[0].text
    uid = link.get('data-player-uid').split(":")[-1]
    passer = {'NAME': name}
    extract_pass_attrs([root], passer)
    passers[uid] = passer
  return passers

def extract_pass_attrs(tree, dst):
  if not tree: return
  assert len(tree) == 1
  tree = tree[0]
  dst["CMP"], dst["ATT"] = map(int, tree.xpath(C_ATT)[0].text.split('/'))
  dst["SACK"], dst["SACKYD"] = map(int, tree.xpath(SACKS)[0].text.split('-'))
  dst["PASSYD"] = int(tree.xpath(YDS)[0].text)
  dst["PASSTD"] = int(tree.xpath(TD)[0].text)
  dst["INT"] = int(tree.xpath(INT)[0].text)

def extract_rush_attrs(tree, dst):
  if not tree: return
  assert len(tree) == 1
  tree = tree[0]
  dst["RUSHYD"] = int(tree.xpath(YDS)[0].text)
  dst["RUSHTD"] = int(tree.xpath(TD)[0].text)
  
def extract_fumble_attrs(tree, dst):
  if not tree: return
  assert len(tree) == 1
  tree = tree[0]
  dst["FUM"] = int(tree.xpath(FUM)[0].text)
  dst["FUMLOST"] = int(tree.xpath(LOST)[0].text)
  dst["REC"] = int(tree.xpath(REC)[0].text)

def extract_receiving_attrs(tree, dst):
  if not tree: return
  assert len(tree) == 1
  tree = tree[0]
  dst["LONG"] = int(tree.xpath(LONG)[0].text)

def extract_interception_attrs(tree, dst):
  if not tree: return
  assert len(tree) == 1
  tree = tree[0]
  dst["INT6"] = int(tree.xpath(TD)[0].text)

def extract_passer_rushing(tree, name, dst):
  assert len(tree) == 1
  tree = tree[0]

  # Omit last element, which is the total
  rusher_paths = tree.xpath(PLAYER)[:-1]
  for path in rusher_paths:
    # TODO pull out name into function
    root = path.getparent()
    rusher_name = path.xpath(".//a//span")[0].text
    if rusher_name != name: continue
    extract_rush_attrs([root], dst)

def extract_passer_fumbling(tree, name, dst):
  assert len(tree) == 1
  tree = tree[0]

  # Omit last element, which is the total
  fumbler_paths = tree.xpath(PLAYER)[:-1]
  for path in fumbler_paths:
    # TODO pull out name into function
    root = path.getparent()
    fumbler_name = path.xpath(".//a//span")[0].text
    if fumbler_name != name: continue
    extract_fumble_attrs([root], dst)


def extract_game(tree, home=True): 
  column = TWO if home else ONE
  other_column = ONE if home else TWO
  team_path = TWO_NAME if home else ONE_NAME
  opp_path = ONE_NAME if home else TWO_NAME
  team_name = tree.xpath(team_path)[0].text
  opp_name = tree.xpath(team_path)[0].text
  team = {'ATT': 0, 'CLOCK': 0, 'CMP': 0, 'FIELDPOS': 100, 'ID': 0, 'INT': 0, 'LONG': 0,
   'OPP': opp_name, 'PASSERS': [], 'PASSTD': 0, 'PASSYD': 0, 'RUSHYD': 0, 'RUSHTD': 0, 'SACK': 0, 'SACKYD': 0, 'SCORE': [], 'TD': 0
  }
  team["CLOCK"] = tree.xpath(CLOCK)[0].text
  extract_pass_attrs(tree.xpath(PASSING + column + TOTAL), team)
  extract_receiving_attrs(tree.xpath(RECEIVING + column + TOTAL), team)
  extract_interception_attrs(tree.xpath(INTERCEPTIONS + other_column + TOTAL), team)
  team['PASSERS'] = all_passers(tree.xpath(PASSING + column))

  for passer_id in team['PASSERS']:
    extract_passer_rushing(tree.xpath(RUSHING + column), team['PASSERS'][passer_id]['NAME'], team['PASSERS'][passer_id])
    extract_passer_fumbling(tree.xpath(FUMBLING + column), team['PASSERS'][passer_id]['NAME'], team['PASSERS'][passer_id])
  team['TD'] = team['RUSHTD'] + team["PASSTD"]
  return team, team_name

# stats/YEAR/WEEK/TEAM(3-letter)/
def mickey_parse(url, dst):
  headers = {'Content-Type': 'text/html',}
  response = requests.get(url, headers=headers)
  html = response.text
  tree = etree.HTML(html)
  # print(html)
  team, team_key  = extract_game(tree, home=False)
  dst[team_key] = team
  team, team_key  = extract_game(tree, home=True)
  dst[team_key] = team

if __name__ == "__main__":
  url = 'https://www.espn.com/nfl/boxscore?gameId=401128096'
  url = 'https://www.espn.com/nfl/boxscore?gameId=401128100'
  dst = {}
  mickey_parse(url, dst)
  print(dst)