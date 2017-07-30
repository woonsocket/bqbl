import urllib.request
import optparse
import re

parser = optparse.OptionParser(
  usage=("Usage: %prog [options] "))
parser.add_option("-o", "--output_file", dest="output_file", default="tab",
                  help="Output file")
parser.add_option("-w", "--week", dest="week", default="1",
                  help="Week")
parser.add_option("-y", "--year", dest="year", default="2016",
                  help="Year")

options, args = parser.parse_args()

pat = r"/gamecenter/(\d+)/"
url = "http://www.nfl.com/scores/%s/REG%s" % (options.year, options.week)
raw = str(urllib.request.urlopen(url).read(), 'utf-8')

ids = {}
for id in re.findall(pat, raw):
    ids[id] = 1

f = open(options.output_file, "w")
for id in ids.keys():
    f.write(id + "\n")

