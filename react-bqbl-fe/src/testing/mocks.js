import { SCORES } from './scores2021';
import { SCORES_247 } from './scores-247-2021';
import { STARTS } from './plays2020';
import { USERS } from './users2020';

export class MockFirebase {
  getScoresYearThen(year, cb) {
    cb({ dbScores: SCORES, dbScores247: SCORES_247 })
    return () => {};
  }

  getScoresWeekThen(year, week, cb) {
    let vals = SCORES[week];
    const valsList = Object.keys(vals).map(key => ({
      ...vals[key],
      teamName: key,
    }));
    cb(valsList);
    return () => {};
  }

  getScoresStartsUsersThen(league, year, cb) {
    // console.log({SCORES, SCORES_247, STARTS, USERS})
    cb({ dbScores: SCORES, dbScores247: SCORES_247, dbStarts: STARTS, dbUsers: USERS });

    return () => {};
  }

  // Calls back with an array of objects, one per player. Each describes the
  // player and their starts:
  //   {name: 'Player name', starts: ['Team1', 'Team2', ...]}

  getProBowlStartsForLeagueThen(league, year, cb) {
    if (league == 'abqbl') {
      cb([{ name: "Trevor", starts: ['NO', "DEN"] }]);
    } else {
      cb([{ name: "Ryan", starts: ['MIA', "WAS", "BUF", "NYJ", "TB", "TEN"] }]);
    }
  };
}

export const MOCK_APP_STATE = {
  'league': 'nbqbl',
  'year': '2020',
  'week': '3',
};

