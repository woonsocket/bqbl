import { Injectable } from '@angular/core';

let ALL_WEEKS = [
{'name': 'Preseason 1', 'val': 'P1', 'displayUntil': new Date('2017-08-16')},
{'name': 'Preseason 2', 'val': 'P2', 'displayUntil': new Date('2017-08-23')},
{'name': 'Preseason 3', 'val': 'P3', 'displayUntil': new Date('2017-08-30')},
{'name': 'Preseason 4', 'val': 'P4', 'displayUntil': new Date('2017-09-06')},
{'name': 'Week 1', 'val': '1', 'displayUntil': new Date('2017-09-13')},
{'name': 'Week 2', 'val': '2', 'displayUntil': new Date('2017-09-20')},
{'name': 'Week 3', 'val': '3', 'displayUntil': new Date('2017-09-27')},
{'name': 'Week 4', 'val': '4', 'displayUntil': new Date('2017-10-04')},
{'name': 'Week 5', 'val': '5', 'displayUntil': new Date('2017-10-11')},
{'name': 'Week 6', 'val': '6', 'displayUntil': new Date('2017-10-18')},
{'name': 'Week 7', 'val': '7', 'displayUntil': new Date('2017-10-25')},
{'name': 'Week 8', 'val': '8', 'displayUntil': new Date('2017-11-01')},
{'name': 'Week 9', 'val': '9', 'displayUntil': new Date('2017-11-08')},
{'name': 'Week 10', 'val': '10', 'displayUntil': new Date('2017-11-15')},
{'name': 'Week 11', 'val': '11', 'displayUntil': new Date('2017-11-22')},
{'name': 'Week 12', 'val': '12', 'displayUntil': new Date('2017-11-29')},
{'name': 'Week 13', 'val': '13', 'displayUntil': new Date('2017-12-06')},
{'name': 'Week 14', 'val': '14', 'displayUntil': new Date('2017-12-13')},
{'name': 'Week 15', 'val': '15', 'displayUntil': new Date('2017-12-20')},
{'name': 'Week 16', 'val': '16', 'displayUntil': new Date('2017-12-27')},
{'name': 'Week 17', 'val': '17', 'displayUntil': new Date('2018-08-01')},
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
  getDefaultWeek() {
    let now = new Date(Date.now());
    let i = 0;
    while (ALL_WEEKS[i].displayUntil < now) {
      i++;
    }
    return ALL_WEEKS[i].val;
  }
}