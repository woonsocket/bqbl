import { SCORES } from './scores2021';
import SCORES_247 from './scores-247-2021';

export class MockFirebase {
  getScoresYear(year) {
    return [new Promise((resolve, reject) =>
      resolve({ dbScores: SCORES, dbScores247: SCORES_247 })
    ), a => a];
  }

  getScoresWeek(year, week) {
    console.log(week)
    return [new Promise((resolve, reject) => {
      console.log(week)
      let vals = SCORES[week];
      const valsList = Object.keys(vals).map(key => ({
        ...vals[key],
        teamName: key,
      }));
      resolve(valsList);
    }
    ), a => a];
  }
}

export const MOCK_APP_STATE = {
  'league': 'nbqbl',
  'year': '2020',
  'week': '3',
};

