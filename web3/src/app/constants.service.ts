import { Injectable } from '@angular/core';

let ALL_WEEKS = [
{'name': 'Preseason 1', 'val': 'P1'},
{'name': 'Preseason 2', 'val': 'P2'},
{'name': 'Preseason 3', 'val': 'P3'},
{'name': 'Preseason 4', 'val': 'P4'},
{'name': 'Week 1', 'val': '1'},
{'name': 'Week 2', 'val': '2'},
{'name': 'Week 3', 'val': '3'},
{'name': 'Week 4', 'val': '4'},
{'name': 'Week 5', 'val': '5'},
{'name': 'Week 6', 'val': '6'},
{'name': 'Week 7', 'val': '7'},
{'name': 'Week 8', 'val': '8'},
{'name': 'Week 9', 'val': '9'},
{'name': 'Week 10', 'val': '10'},
{'name': 'Week 11', 'val': '11'},
{'name': 'Week 12', 'val': '12'},
{'name': 'Week 13', 'val': '13'},
{'name': 'Week 14', 'val': '14'},
{'name': 'Week 15', 'val': '15'},
{'name': 'Week 16', 'val': '16'},
{'name': 'Week 17', 'val': '17'},
];

let ALL_TEAMS = ["ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN","DET",
"GB","HOU","IND","JAX","KC","LA","MIA","MIN","NE","NO","NYG","NYJ",
"OAK", "PHI","PIT","SD","SEA","SF","TB","TEN","WSH"];

let FULLY_POPULATED_LEAGUE_USERS = [
  [{'name': 'ARI'}, {'name': 'ATL'}, {'name': 'BAL'}, {'name': 'BUF'}], 
  [{'name': 'CAR'}, {'name': 'CHI'}, {'name': 'CIN'}, {'name': 'CLE'}], 
  [{'name': 'DAL'}, {'name': 'DEN'}, {'name': 'DET'}, {'name': 'GB'}], 
  [{'name': 'HOU'}, {'name': 'IND'}, {'name': 'JAX'}, {'name': 'KC'}], 
  [{'name': 'LAC'}, {'name': 'LAR'}, {'name': 'MIA'}, {'name': 'MIN'}], 
  [{'name': 'NE'}, {'name': 'NO'}, {'name': 'NYG'}, {'name': 'NYJ'}], 
  [{'name': 'OAK'}, {'name': 'PHI'}, {'name': 'PIT'}, {'name': 'SEA'}], 
  [{'name': 'SF'}, {'name': 'TB'}, {'name': 'TEN'}, {'value': 'WAS'}]
  ];

@Injectable()
export class ConstantsService {
  getAllWeeks() { return ALL_WEEKS; }
  getAllTeams() { return ALL_TEAMS; }
  getDummyLeague() { return FULLY_POPULATED_LEAGUE_USERS; }
}