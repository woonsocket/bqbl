import { Injectable } from '@angular/core';
import { Set } from 'immutable';

const ALL_WEEKS_2018: WeekSpec[] = [
  { 'name': 'Preseason 1', 'val': 'P1', 'displayUntil': new Date('2018-08-15') },
  { 'name': 'Preseason 2', 'val': 'P2', 'displayUntil': new Date('2018-08-22') },
  { 'name': 'Preseason 3', 'val': 'P3', 'displayUntil': new Date('2018-08-29') },
  { 'name': 'Preseason 4', 'val': 'P4', 'displayUntil': new Date('2018-09-05') },
  { 'name': 'Week 1', 'val': '1', 'displayUntil': new Date('2018-09-12') },
  { 'name': 'Week 2', 'val': '2', 'displayUntil': new Date('2018-09-19') },
  { 'name': 'Week 3', 'val': '3', 'displayUntil': new Date('2018-09-26') },
  { 'name': 'Week 4', 'val': '4', 'displayUntil': new Date('2018-10-03') },
  { 'name': 'Week 5', 'val': '5', 'displayUntil': new Date('2018-10-10') },
  { 'name': 'Week 6', 'val': '6', 'displayUntil': new Date('2018-10-17') },
  { 'name': 'Week 7', 'val': '7', 'displayUntil': new Date('2018-10-24') },
  { 'name': 'Week 8', 'val': '8', 'displayUntil': new Date('2018-10-31') },
  { 'name': 'Week 9', 'val': '9', 'displayUntil': new Date('2018-11-07') },
  { 'name': 'Week 10', 'val': '10', 'displayUntil': new Date('2018-11-14') },
  { 'name': 'Week 11', 'val': '11', 'displayUntil': new Date('2018-11-21') },
  { 'name': 'Week 12', 'val': '12', 'displayUntil': new Date('2018-11-28') },
  { 'name': 'Week 13', 'val': '13', 'displayUntil': new Date('2018-12-05') },
  { 'name': 'Week 14', 'val': '14', 'displayUntil': new Date('2018-12-12') },
  { 'name': 'Week 15', 'val': '15', 'displayUntil': new Date('2018-12-19') },
  { 'name': 'Week 16', 'val': '16', 'displayUntil': new Date('2018-12-26') },
  { 'name': 'Week 17', 'val': '17', 'displayUntil': new Date('2019-08-01') },
];

const ALL_WEEKS_2017: WeekSpec[] = [
  { 'name': 'Preseason 1', 'val': 'P1', 'displayUntil': new Date('2017-08-16') },
  { 'name': 'Preseason 2', 'val': 'P2', 'displayUntil': new Date('2017-08-23') },
  { 'name': 'Preseason 3', 'val': 'P3', 'displayUntil': new Date('2017-08-30') },
  { 'name': 'Preseason 4', 'val': 'P4', 'displayUntil': new Date('2017-09-06') },
  { 'name': 'Week 1', 'val': '1', 'displayUntil': new Date('2017-09-13') },
  { 'name': 'Week 2', 'val': '2', 'displayUntil': new Date('2017-09-20') },
  { 'name': 'Week 3', 'val': '3', 'displayUntil': new Date('2017-09-27') },
  { 'name': 'Week 4', 'val': '4', 'displayUntil': new Date('2017-10-04') },
  { 'name': 'Week 5', 'val': '5', 'displayUntil': new Date('2017-10-11') },
  { 'name': 'Week 6', 'val': '6', 'displayUntil': new Date('2017-10-18') },
  { 'name': 'Week 7', 'val': '7', 'displayUntil': new Date('2017-10-25') },
  { 'name': 'Week 8', 'val': '8', 'displayUntil': new Date('2017-11-01') },
  { 'name': 'Week 9', 'val': '9', 'displayUntil': new Date('2017-11-08') },
  { 'name': 'Week 10', 'val': '10', 'displayUntil': new Date('2017-11-15') },
  { 'name': 'Week 11', 'val': '11', 'displayUntil': new Date('2017-11-22') },
  { 'name': 'Week 12', 'val': '12', 'displayUntil': new Date('2017-11-29') },
  { 'name': 'Week 13', 'val': '13', 'displayUntil': new Date('2017-12-06') },
  { 'name': 'Week 14', 'val': '14', 'displayUntil': new Date('2017-12-13') },
  { 'name': 'Week 15', 'val': '15', 'displayUntil': new Date('2017-12-20') },
  { 'name': 'Week 16', 'val': '16', 'displayUntil': new Date('2017-12-27') },
  { 'name': 'Week 17', 'val': '17', 'displayUntil': new Date('2018-08-01') },
];

const ALL_TEAMS = Set([
  'ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN', 'DET',
  'GB', 'HOU', 'IND', 'JAX', 'KC', 'LA', 'LAC', 'MIA', 'MIN', 'NE', 'NO',
  'NYG', 'NYJ', 'OAK', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS',
]);

const NBQBL_USERS_2017 = [
  [{'name': 'NYJ'}, {'name': 'MIN'}, {'name': 'CIN'}, {'name': 'NE'}],
  [{'name': 'LA'},  {'name': 'ARI'}, {'name': 'NYG'}, {'name': 'ATL'}],
  [{'name': 'CLE'}, {'name': 'DET'}, {'name': 'KC'}, {'name': 'GB'}],
  [{'name': 'JAX'}, {'name': 'DEN'}, {'name': 'IND'}, {'name': 'OAK'}],
  [{'name': 'PHI'}, {'name': 'TEN'}, {'name': 'CAR'}, {'name': 'SEA'}],
  [{'name': 'SF'},  {'name': 'BUF'}, {'name': 'WAS'}, {'name': 'PIT'}],
  [{'name': 'MIA'}, {'name': 'HOU'}, {'name': 'LAC'}, {'name': 'TB'}],
  [{'name': 'BAL'}, {'name': 'CHI'}, {'name': 'NO'}, {'name': 'DAL'}],
  ];

const ABQBL_USERS_2017 = [
  [{'name': 'NYJ'}, {'name': 'NYG'}, {'name': 'KC'},  {'name': 'NE'}],
  [{'name': 'CLE'}, {'name': 'PHI'}, {'name': 'SEA'}, {'name': 'ATL'}],
  [{'name': 'LA'},  {'name': 'IND'}, {'name': 'CIN'}, {'name': 'GB'}],
  [{'name': 'CHI'}, {'name': 'ARI'}, {'name': 'CAR'}, {'name': 'NO'}],
  [{'name': 'SF'},  {'name': 'MIN'}, {'name': 'WAS'}, {'name': 'OAK'}],
  [{'name': 'JAX'}, {'name': 'DEN'}, {'name': 'TEN'}, {'name': 'DET'}],
  [{'name': 'HOU'}, {'name': 'MIA'}, {'name': 'LAC'}, {'name': 'TB'}],
  [{'name': 'BUF'}, {'name': 'BAL'}, {'name': 'DAL'}, {'name': 'PIT'}],
  ];


const SCHEDULE_MAP_2018 = {
  'ARI': ['WSH', '@LAR', 'CHI', 'SEA', '@SF', '@MIN', 'DEN', 'SF', 'BYE', '@KC', 'OAK', '@LAC', '@GB', 'DET', '@ATL', 'LAR', '@SEA',],
  'ATL': ['@PHI', 'CAR', 'NO', 'CIN', '@PIT', 'TB', 'NYG', 'BYE', '@WSH', '@CLE', 'DAL', '@NO', 'BAL', '@GB', 'ARI', '@CAR', '@TB',],
  'BAL': ['BUF', '@CIN', 'DEN', '@PIT', '@CLE', '@TEN', 'NO', '@CAR', 'PIT', 'BYE', 'CIN', 'OAK', '@ATL', '@KC', 'TB', '@LAC', 'CLE',],
  'BUF': ['@BAL', 'LAC', '@MIN', '@GB', 'TEN', '@HOU', '@IND', 'NE', 'CHI', '@NYJ', 'BYE', 'JAX', '@MIA', 'NYJ', 'DET', '@NE', 'MIA',],
  'CAR': ['DAL', '@ATL', 'CIN', 'BYE', 'NYG', '@WSH', '@PHI', 'BAL', 'TB', '@PIT', '@DET', 'SEA', '@TB', '@CLE', 'NO', 'ATL', '@NO',],
  'CHI': ['@GB', 'SEA', '@ARI', 'TB', 'BYE', '@MIA', 'NE', 'NYJ', '@BUF', 'DET', 'MIN', '@DET', '@NYG', 'LAR', 'GB', '@SF', '@MIN',],
  'CIN': ['@IND', 'BAL', '@CAR', '@ATL', 'MIA', 'PIT', '@KC', 'TB', 'BYE', 'NO', '@BAL', 'CLE', 'DEN', '@LAC', 'OAK', '@CLE', '@PIT',],
  'CLE': ['PIT', '@NO', 'NYJ', '@OAK', 'BAL', 'LAC', '@TB', '@PIT', 'KC', 'ATL', 'BYE', '@CIN', '@HOU', 'CAR', '@DEN', 'CIN', '@BAL',],
  'DAL': ['@CAR', 'NYG', '@SEA', 'DET', '@HOU', 'JAX', '@WSH', 'BYE', 'TEN', '@PHI', '@ATL', 'WSH', 'NO', 'PHI', '@IND', 'TB', '@NYG',],
  'DEN': ['SEA', 'OAK', '@BAL', 'KC', '@NYJ', 'LAR', '@ARI', '@KC', 'HOU', 'BYE', '@LAC', 'PIT', '@CIN', '@SF', 'CLE', '@OAK', 'LAC',],
  'DET': ['NYJ', '@SF', 'NE', '@DAL', 'GB', 'BYE', '@MIA', 'SEA', '@MIN', '@CHI', 'CAR', 'CHI', 'LAR', '@ARI', '@BUF', 'MIN', '@GB',],
  'GB': ['CHI', 'MIN', '@WSH', 'BUF', '@DET', 'SF', 'BYE', '@LAR', '@NE', 'MIA', '@SEA', '@MIN', 'ARI', 'ATL', '@CHI', '@NYJ', 'DET',],
  'HOU': ['@NE', '@TEN', 'NYG', '@IND', 'DAL', 'BUF', '@JAX', 'MIA', '@DEN', 'BYE', '@WSH', 'TEN', 'CLE', 'IND', '@NYJ', '@PHI', 'JAX',],
  'IND': ['CIN', '@WSH', '@PHI', 'HOU', '@NE', '@NYJ', 'BUF', '@OAK', 'BYE', 'JAX', 'TEN', 'MIA', '@JAX', '@HOU', 'DAL', 'NYG', '@TEN',],
  'JAX': ['@NYG', 'NE', 'TEN', 'NYJ', '@KC', '@DAL', 'HOU', 'PHI', 'BYE', '@IND', 'PIT', '@BUF', 'IND', '@TEN', 'WSH', '@MIA', '@HOU',],
  'KC': ['@LAC', '@PIT', 'SF', '@DEN', 'JAX', '@NE', 'CIN', 'DEN', '@CLE', 'ARI', '@LAR', 'BYE', '@OAK', 'BAL', 'LAC', '@SEA', 'OAK',],
  'LAR': ['@OAK', 'ARI', 'LAC', 'MIN', '@SEA', '@DEN', '@SF', 'GB', '@NO', 'SEA', 'KC', 'BYE', '@DET', '@CHI', 'PHI', '@ARI', 'SF',],
  'LAC': ['KC', '@BUF', '@LAR', 'SF', 'OAK', '@CLE', 'TEN', 'BYE', '@SEA', '@OAK', 'DEN', 'ARI', '@PIT', 'CIN', '@KC', 'BAL', '@DEN',],
  'MIA': ['TEN', '@NYJ', 'OAK', '@NE', '@CIN', 'CHI', 'DET', '@HOU', 'NYJ', '@GB', 'BYE', '@IND', 'BUF', 'NE', '@MIN', 'JAX', '@BUF',],
  'MIN': ['SF', '@GB', 'BUF', '@LAR', '@PHI', 'ARI', '@NYJ', 'NO', 'DET', 'BYE', '@CHI', 'GB', '@NE', '@SEA', 'MIA', '@DET', 'CHI',],
  'NE': ['HOU', '@JAX', '@DET', 'MIA', 'IND', 'KC', '@CHI', '@BUF', 'GB', '@TEN', 'BYE', '@NYJ', 'MIN', '@MIA', '@PIT', 'BUF', 'NYJ',],
  'NO': ['TB', 'CLE', '@ATL', '@NYG', 'WSH', 'BYE', '@BAL', '@MIN', 'LAR', '@CIN', 'PHI', 'ATL', '@DAL', '@TB', '@CAR', 'PIT', 'CAR',],
  'NYG': ['JAX', '@DAL', '@HOU', 'NO', '@CAR', 'PHI', '@ATL', 'WSH', 'BYE', '@SF', 'TB', '@PHI', 'CHI', '@WSH', 'TEN', '@IND', 'DAL',],
  'NYJ': ['@DET', 'MIA', '@CLE', '@JAX', 'DEN', 'IND', 'MIN', '@CHI', '@MIA', 'BUF', 'BYE', 'NE', '@TEN', '@BUF', 'HOU', 'GB', '@NE',],
  'OAK': ['LAR', '@DEN', '@MIA', 'CLE', '@LAC', 'SEA', 'BYE', 'IND', '@SF', 'LAC', '@ARI', '@BAL', 'KC', 'PIT', '@CIN', 'DEN', '@KC',],
  'PHI': ['ATL', '@TB', 'IND', '@TEN', 'MIN', '@NYG', 'CAR', '@JAX', 'BYE', 'DAL', '@NO', 'NYG', 'WSH', '@DAL', '@LAR', 'HOU', '@WSH',],
  'PIT': ['@CLE', 'KC', '@TB', 'BAL', 'ATL', '@CIN', 'BYE', 'CLE', '@BAL', 'CAR', '@JAX', '@DEN', 'LAC', '@OAK', 'NE', '@NO', 'CIN',],
  'SF': ['@MIN', 'DET', '@KC', '@LAC', 'ARI', '@GB', 'LAR', '@ARI', 'OAK', 'NYG', 'BYE', '@TB', '@SEA', 'DEN', 'SEA', 'CHI', '@LAR',],
  'SEA': ['@DEN', '@CHI', 'DAL', '@ARI', 'LAR', '@OAK', 'BYE', '@DET', 'LAC', '@LAR', 'GB', '@CAR', 'SF', 'MIN', '@SF', 'KC', 'ARI',],
  'TB': ['@NO', 'PHI', 'PIT', '@CHI', 'BYE', '@ATL', 'CLE', '@CIN', '@CAR', 'WSH', '@NYG', 'SF', 'CAR', 'NO', '@BAL', '@DAL', 'ATL',],
  'TEN': ['@MIA', 'HOU', '@JAX', 'PHI', '@BUF', 'BAL', '@LAC', 'BYE', '@DAL', 'NE', '@IND', '@HOU', 'NYJ', 'JAX', '@NYG', 'WSH', 'IND',],
  'WSH': ['@ARI', 'IND', 'GB', 'BYE', '@NO', 'CAR', 'DAL', '@NYG', 'ATL', '@TB', 'HOU', '@DAL', '@PHI', 'NYG', '@JAX', '@TEN', 'PHI',],
}

const SCHEDULE_MAP_2017 = {
  'ARI': ['@DET', '@IND', 'DAL', 'SF', '@PHI', 'TB', '@LA', 'BYE', '@SF', 'SEA', '@HOU', 'JAX', 'LA', 'TEN', '@WAS', 'NYG', '@SEA'],
  'ATL': ['@CHI', 'GB', '@DET', 'BUF', 'BYE', 'MIA', '@NE', '@NYJ', '@CAR', 'DAL', '@SEA', 'TB', 'MIN', 'NO', '@TB', '@NO', 'CAR'],
  'BAL': ['@CIN', 'CLE', '@JAX', 'PIT', '@OAK', 'CHI', '@MIN', 'MIA', '@TEN', 'BYE', '@GB', 'HOU', 'DET', '@PIT', '@CLE', 'IND', 'CIN'],
  'BUF': ['NYJ', '@CAR', 'DEN', '@ATL', '@CIN', 'BYE', 'TB', 'OAK', '@NYJ', 'NO', '@LAC', '@KC', 'NE', 'IND', 'MIA', '@NE', '@MIA'],
  'CAR': ['@SF', 'BUF', 'NO', '@NE', '@DET', 'PHI', '@CHI', '@TB', 'ATL', 'MIA', 'BYE', '@NYJ', '@NO', 'MIN', 'GB', 'TB', '@ATL'],
  'CHI': ['ATL', '@TB', 'PIT', '@GB', 'MIN', '@BAL', 'CAR', '@NO', 'BYE', 'GB', 'DET', '@PHI', 'SF', '@CIN', '@DET', 'CLE', '@MIN'],
  'CIN': ['BAL', 'HOU', '@GB', '@CLE', 'BUF', 'BYE', '@PIT', 'IND', '@JAX', '@TEN', '@DEN', 'CLE', 'PIT', 'CHI', '@MIN', 'DET', '@BAL'],
  'CLE': ['PIT', '@BAL', '@IND', 'CIN', 'NYJ', '@HOU', 'TEN', 'MIN', 'BYE', '@DET', 'JAX', '@CIN', '@LAC', 'GB', 'BAL', '@CHI', '@PIT'],
  'DAL': ['NYG', '@DEN', '@ARI', 'LA', 'GB', 'BYE', '@SF', '@WAS', 'KC', '@ATL', 'PHI', 'LAC', 'WAS', '@NYG', '@OAK', 'SEA', '@PHI'],
  'DEN': ['LAC', 'DAL', '@BUF', 'OAK', 'BYE', 'NYG', '@LAC', '@KC', '@PHI', 'NE', 'CIN', '@OAK', '@MIA', 'NYJ', '@IND', '@WAS', 'KC'],
  'DET': ['ARI', '@NYG', 'ATL', '@MIN', 'CAR', '@NO', 'BYE', 'PIT', '@GB', 'CLE', '@CHI', 'MIN', '@BAL', '@TB', 'CHI', '@CIN', 'GB'],
  'GB': ['SEA', '@ATL', 'CIN', 'CHI', '@DAL', '@MIN', 'NO', 'BYE', 'DET', '@CHI', 'BAL', '@PIT', 'TB', '@CLE', '@CAR', 'MIN', '@DET'],
  'HOU': ['JAX', '@CIN', '@NE', 'TEN', 'KC', 'CLE', 'BYE', '@SEA', 'IND', '@LA', 'ARI', '@BAL', '@TEN', 'SF', '@JAX', 'PIT', '@IND'],
  'IND': ['@LA', 'ARI', 'CLE', '@SEA', 'SF', '@TEN', 'JAX', '@CIN', '@HOU', 'PIT', 'BYE', 'TEN', '@JAX', '@BUF', 'DEN', '@BAL', 'HOU'],
  'JAX': ['@HOU', 'TEN', 'BAL', '@NYJ', '@PIT', 'LA', '@IND', 'BYE', 'CIN', 'LAC', '@CLE', '@ARI', 'IND', 'SEA', 'HOU', '@SF', '@TEN'],
  'KC': ['@NE', 'PHI', '@LAC', 'WAS', '@HOU', 'PIT', '@OAK', 'DEN', '@DAL', 'BYE', '@NYG', 'BUF', '@NYJ', 'OAK', 'LAC', 'MIA', '@DEN'],
  'LA': ['IND', 'WAS', '@SF', '@DAL', 'SEA', '@JAX', 'ARI', 'BYE', '@NYG', 'HOU', '@MIN', 'NO', '@ARI', 'PHI', '@SEA', '@TEN', 'SF'],
  'LAC': ['@DEN', 'MIA', 'KC', 'PHI', '@NYG', '@OAK', 'DEN', '@NE', 'BYE', '@JAX', 'BUF', '@DAL', 'CLE', 'WAS', '@KC', '@NYJ', 'OAK'],
  'MIA': ['TB', '@LAC', '@NYJ', 'NO', 'TEN', '@ATL', 'NYJ', '@BAL', 'OAK', '@CAR', 'TB', '@NE', 'DEN', 'NE', '@BUF', '@KC', 'BUF'],
  'MIN': ['NO', '@PIT', 'TB', 'DET', '@CHI', 'GB', 'BAL', '@CLE', 'BYE', '@WAS', 'LA', '@DET', '@ATL', '@CAR', 'CIN', '@GB', 'CHI'],
  'NE': ['KC', '@NO', 'HOU', 'CAR', '@TB', '@NYJ', 'ATL', 'LAC', 'BYE', '@DEN', '@OAK', 'MIA', '@BUF', '@MIA', '@PIT', 'BUF', 'NYJ'],
  'NO': ['@MIN', 'NE', '@CAR', '@MIA', 'BYE', 'DET', '@GB', 'CHI', 'TB', '@BUF', 'WAS', '@LA', 'CAR', '@ATL', 'NYJ', 'ATL', '@TB'],
  'NYG': ['@DAL', 'DET', '@PHI', '@TB', 'LAC', '@DEN', 'SEA', 'BYE', 'LA', '@SF', 'KC', '@WAS', '@OAK', 'DAL', 'PHI', '@ARI', 'WAS'],
  'NYJ': ['@BUF', '@OAK', 'MIA', 'JAX', '@CLE', 'NE', '@MIA', 'ATL', 'BUF', '@TB', 'BYE', 'CAR', 'KC', '@DEN', '@NO', 'LAC', '@NE'],
  'OAK': ['@TEN', 'NYJ', '@WAS', '@DEN', 'BAL', 'LAC', 'KC', '@BUF', '@MIA', 'BYE', 'NE', 'DEN', 'NYG', '@KC', 'DAL', '@PHI', '@LAC'],
  'PHI': ['@WAS', '@KC', 'NYG', '@LAC', 'ARI', '@CAR', 'WAS', 'SF', 'DEN', 'BYE', '@DAL', 'CHI', '@SEA', '@LA', '@NYG', 'OAK', 'DAL'],
  'PIT': ['@CLE', 'MIN', '@CHI', '@BAL', 'JAX', '@KC', 'CIN', '@DET', 'BYE', '@IND', 'TEN', 'GB', '@CIN', 'BAL', 'NE', '@HOU', 'CLE'],
  'SF': ['CAR', '@SEA', 'LA', '@ARI', '@IND', '@WAS', 'DAL', '@PHI', 'ARI', 'NYG', 'BYE', 'SEA', '@CHI', '@HOU', 'TEN', 'JAX', '@LA'],
  'SEA': ['@GB', 'SF', '@TEN', 'IND', '@LA', 'BYE', '@NYG', 'HOU', 'WAS', '@ARI', 'ATL', '@SF', 'PHI', '@JAX', 'LA', '@DAL', 'ARI'],
  'TB': ['@MIA', 'CHI', '@MIN', 'NYG', 'NE', '@ARI', '@BUF', 'CAR', '@NO', 'NYJ', '@MIA', '@ATL', '@GB', 'DET', 'ATL', '@CAR', 'NO'],
  'TEN': ['OAK', '@JAX', 'SEA', '@HOU', '@MIA', 'IND', '@CLE', 'BYE', 'BAL', 'CIN', '@PIT', '@IND', 'HOU', '@ARI', '@SF', 'LA', 'JAX'],
  'WAS': ['PHI', '@LA', 'OAK', '@KC', 'BYE', 'SF', '@PHI', 'DAL', '@SEA', 'MIN', '@NO', 'NYG', '@DAL', '@LAC', 'ARI', 'DEN', '@NYG'],
};

@Injectable()
export class ConstantsService {
  // TODO(harveyj): Make ConstantsService take year as an input.
  getAllWeeks(): WeekSpec[] { return ALL_WEEKS_2018; }
  getAllTeams() { return ALL_TEAMS; }
  getDummyLeague() { return ABQBL_USERS_2017; }
  getDefaultYear(): string { return '2017'; }
  getDefaultWeekId(): string {
    const now = new Date(Date.now());
    let i = 0;
    while (ALL_WEEKS_2018[i].displayUntil < now) {
      i++;
    }
    return ALL_WEEKS_2018[i].val;
  }

  getSchedule() {
    return SCHEDULE_MAP_2018;
  }
}

class WeekSpec {
  name: string;
  val: string;
  displayUntil: Date;
}
