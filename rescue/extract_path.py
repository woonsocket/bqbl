import json, sys
f= open(sys.argv[1])
of = open(sys.argv[2], "w+")
data = json.load(f)
segments = "leaguespec/abqbl/plays".split("/")
for segment in segments:
  data = data[segment]
of.write(json.dumps(data))

print(data)