import { SCORES } from "./scores2021";
import { SCORES_247 } from "./scores-247-2021";
import { STARTS } from "./plays2020";
import { USERS } from "./users2020";
import { useContext, useEffect } from "react";
import { FirebaseContext } from "../components/Firebase";
import store from "../redux/store";

export class MockFirebase {
  auth = {
    onAuthStateChanged: function () {},
    currentUser: {
      uid: "One",
    },
  };

  scores = SCORES;

  getLeagueSpecThen(leagueId, cb) {
    cb({ users: { 2023: USERS }, plays: { 2023: STARTS } });
  }

  getLockedWeeksThen(time, cb) {
    cb(new Set());
  }

  getScoresYearThen(year, cb) {
    // console.log(this.scores['3']);
    cb({ dbScores: this.scores, dbScores247: SCORES_247 });
    return () => {};
  }

  getScoresWeekThen(year, week, cb) {
    let vals = SCORES[week];
    const valsList = Object.keys(vals).map((key) => ({
      ...vals[key],
      teamName: key,
    }));
    cb(valsList);
    return () => {};
  }

  getScoresStartsUsersThen(league, year, cb) {
    cb({
      dbScores: SCORES,
      dbScores247: SCORES_247,
      dbStarts: STARTS,
      dbUsers: USERS,
    });

    return () => {};
  }

  // Calls back with an array of objects, one per player. Each describes the
  // player and their starts:
  //   {name: 'Player name', starts: ['Team1', 'Team2', ...]}

  getProBowlStartsForLeagueThen(league, year, cb) {
    if (league == "abqbl") {
      cb([{ name: "Trevor", starts: ["NO", "DEN"] }]);
    } else {
      cb([{ name: "Ryan", starts: ["MIA", "WAS", "BUF", "NYJ", "TB", "TEN"] }]);
    }
  }
}

export const MOCK_APP_STATE = {
  league: "nbqbl",
  year: "2023",
  week: "3",
};

export const MOCK_REDUX_STATE = {
  // this naming is terrible and should match the db
  league: {spec: { users: { 2023: USERS }, plays: { 2023: STARTS }}},
  testVal: 5
};

export function MockApp(props) {
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    //    store.dispatch({type: 'year/set', year: year, firebase: firebase});
    // console.log('mockapp')
    store.dispatch({
      type: "league/set",
      leagueId: props.league,
      firebase: firebase,
    });
    store.dispatch({
      type: "scores/load",
      leagueId: props.league,
      year: props.year,
      firebase: firebase,
    });
    store.dispatch({
      type: "scores247/load",
      leagueId: props.league,
      year: props.year,
      firebase: firebase,
    });
  }, [firebase, props.league, props.year]);

  return props.children;
}
