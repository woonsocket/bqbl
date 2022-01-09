import { SCORES } from './scores2021';
import { SCORES_247 } from './scores-247-2021';
import { STARTS } from './plays2020';
import { USERS } from './users2020';

export class MockFirebase {
  getScoresYear(year) {
    return [new Promise((resolve, reject) =>
      resolve({ dbScores: SCORES, dbScores247: SCORES_247 })
    ), a => a];
  }

  getScoresWeek(year, week) {
    return [new Promise((resolve, reject) => {
      let vals = SCORES[week];
      const valsList = Object.keys(vals).map(key => ({
        ...vals[key],
        teamName: key,
      }));
      resolve(valsList);
    }
    ), a => a];
  }

  getScoresStartsUsers(league, year) {
    // console.log({SCORES, SCORES_247, STARTS, USERS})
    const promise = new Promise((resolve, reject) => {
      resolve({dbScores: SCORES, dbScores247: SCORES_247, dbStarts: STARTS, dbUsers: USERS});
    });

    return [promise, null];
  }
}

export const MOCK_APP_STATE = {
  'league': 'nbqbl',
  'year': '2020',
  'week': '3',
};

