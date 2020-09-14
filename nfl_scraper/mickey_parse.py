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
CLOCK = '//span[contains(@class,"status-detail")]'
GAMES = "//a[@name='&lpos=nfl:scoreboard:boxscore']"


# let ids = []; for (let anchor of $x("//a[@name='&lpos=nfl:scoreboard:gamecast']")) {let components = anchor.href.split('/'); ids.push(components[components.length - 1])}; console.log(ids)
def all_games(year, week):
  if week == "1":
    return ["401220225", "401220131", "401220352", "401220313", "401220116", "401220282", "401220300", "401220268", "401220370", "401220195", "401220147", "401220161", "401220369", "401220347", "401220256", "401220217"]
  elif week == "2":
    return ["401220163", "401220144", "401220365", "401220281", "401220249", "401220291", "401220204", "401220192", "401220122", "401220261", "401220177", "401220329", "401220340", "401220235", "401220181", "401220231"]
  elif week == "3":
    return ["401220201", "401220134", "401220254", "401220309", "401220119", "401220168", "401220304", "401220264", "401220173", "401220193", "401220240", "401220216", "401220343", "401220363", "401220323", "401220153"]
  elif week == "4":
    return ["401220141", "401220221", "401220355", "401220280", "401220157", "401220247", "401220285", "401220206", "401220128", "401220334", "401220271", "401220320", "401220184", "401220348", "401220229", "401220293"]
  elif week == "5":
    return ["401220278", "401220133", "401220358", "401220306", "401220209", "401220219", "401220143", "401220175", "401220269", "401220146", "401220179", "401220166", "401220242", "401220367", "401220326"]
  elif week == "6":
    return ["401220117", "401220353", "401220202", "401220190", "401220301", "401220252", "401220263", "401220172", "401220317", "401220200", "401220214", "401220238", "401220331", "401220245"]
  elif week == "7":
    return ["401220259", "401220136", "401220310", "401220155", "401220126", "401220322", "401220138", "401220266", "401220148", "401220183", "401220338", "401220210", "401220232", "401220351"]
  elif week == "8":
    return ["401220314", "401220115", "401220361", "401220158", "401220169", "401220288", "401220292", "401220222", "401220127", "401220241", "401220277", "401220258", "401220257"]
  elif week == "9":
    return ["401220359", "401220311", "401220120", "401220207", "401220189", "401220224", "401220299", "401220267", "401220194", "401220236", "401220248", "401220342", "401220330", "401220140"]
  elif week == "10":
    return ["401220203", "401220327", "401220137", "401220165", "401220289", "401220295", "401220251", "401220171", "401220368", "401220226", "401220124", "401220341", "401220346", "401220276"]
  elif week == "11":
    return ["401220360", "401220185", "401220167", "401220191", "401220321", "401220272", "401220318", "401220198", "401220150", "401220212", "401220305", "401220227", "401220335"]
  elif week == "12":
    return ["401220287", "401220244", "401220170", "401220135", "401220345", "401220312", "401220118", "401220160", "401220188", "401220302", "401220139", "401220197", "401220215", "401220333", "401220290", "401220262"]
  elif week == "13":
    return ["401220151", "401220237", "401220307", "401220274", "401220205", "401220129", "401220303", "401220142", "401220176", "401220178", "401220336", "401220364", "401220297", "401220218", "401220357"]
  elif week == "14":
    return ["401220349", "401220356", "401220279", "401220159", "401220283", "401220125", "401220253", "401220332", "401220319", "401220196", "401220233", "401220366", "401220265", "401220239", "401220121", "401220162"]
  elif week == "15":
    return ["401220228", "401220123", "401220246", "401220213", "401220294", "401220208", "401220186", "401220350", "401220308", "401220298", "401220255", "401220270", "401220149", "401220339", "401220325", "401220156"]
  elif week == "16":
    return ["401220324", "401220337", "401220286", "401220230", "401220145", "401220234", "401220223", "401220174", "401220273", "401220199", "401220152", "401220182", "401220362", "401220243", "401220296", "401220130"]
  elif week == "17":
    return ["401220132", "401220354", "401220114", "401220275", "401220154", "401220164", "401220284", "401220187", "401220220", "401220250", "401220260", "401220328", "401220315", "401220180", "401220211", "401220344"]
  


def all_passers(tree):
  if not tree: return []
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
  team = {'ATT': 0, 'CLOCK': 0, 'CMP': 0, 'FIELDPOS': 100, 'ID': 0, 'INT': 0, 'LONG': 0, 'FUM': 0, 'FUMLOST': 0,
   'OPP': opp_name, 'PASSERS': [], 'PASSTD': 0, 'PASSYD': 0, 'RUSHYD': 0, 'RUSHTD': 0, 'SACK': 0, 'SACKYD': 0, 'SCORE': [], 'TD': 0
  }
  team["CLOCK"] = tree.xpath(CLOCK)[0].text
  if not team["CLOCK"]:
    # Game hasn't started yet
    return None, team_name
  extract_pass_attrs(tree.xpath(PASSING + column + TOTAL), team)
  extract_receiving_attrs(tree.xpath(RECEIVING + column + TOTAL), team)
  extract_interception_attrs(tree.xpath(INTERCEPTIONS + other_column + TOTAL), team)
  team['PASSERS'] = all_passers(tree.xpath(PASSING + column))

  for passer_id in team['PASSERS']:
    extract_passer_rushing(tree.xpath(RUSHING + column), team['PASSERS'][passer_id]['NAME'], team['PASSERS'][passer_id])
    extract_passer_fumbling(tree.xpath(FUMBLING + column), team['PASSERS'][passer_id]['NAME'], team['PASSERS'][passer_id])
    team['FUM'] += team['PASSERS'][passer_id].get('FUM', 0)
    team['FUMLOST'] += team['PASSERS'][passer_id].get('FUMLOST', 0)
    
  team['TD'] = team['RUSHTD'] + team["PASSTD"]
  return team, team_name

def mickey_parse(url, dst):
  headers = {'Content-Type': 'text/html',}
  response = requests.get(url, headers=headers)
  html = response.text
  tree = etree.HTML(html)
  team, team_key = extract_game(tree, home=False)
  if team:
    dst[team_key] = team
  team_2, team_key_2 = extract_game(tree, home=True)
  if team_2:
    dst[team_key_2] = team_2
  return team_key, team_key_2

if __name__ == "__main__":
  url = 'https://www.espn.com/nfl/boxscore?gameId=401128096'
  url = 'https://www.espn.com/nfl/boxscore?gameId=401128100'
  url = 'https://www.espn.com/nfl/boxscore?gameId=401220268'
  dst = {}
  mickey_parse(url, dst)
  print(dst)
