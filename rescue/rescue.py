import json
f= open("/Users/harveyj/Downloads/2018-02-13T02_30_05Z_bqbl-591f3_data.json")
nf = open("/Users/harveyj/2017-nbqbl.json", "w+")
af = open("/Users/harveyj/2017-abqbl.json", "w+")
data = json.load(f)
dst = {}
for k, v in data['users'].items():
  league = v['leagueName']
  leagueVal = dst.get(league, {})
  leagueVal[k] = {}
  for i, val in enumerate(v['weeks'].values()):
    leagueVal[k][str(i+1)] = val
  dst[league] = leagueVal
nf.write(json.dumps(dst['NBQBL']))
af.write(json.dumps(dst['ABQBL']))

print(dst)