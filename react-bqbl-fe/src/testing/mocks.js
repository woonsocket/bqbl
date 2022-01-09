import SCORES from './scores2021';
import SCORES_247 from './scores-247-2021';

export class MockFirebase {
  getScoresYear(year) {
    return [new Promise((resolve, reject) =>
      resolve({ dbScores: SCORES, dbScores247: SCORES_247 })
    ), a => a];
  }
}

export class MockAppState {
}

