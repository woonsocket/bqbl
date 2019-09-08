import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import * as TEMPLATES from '../../middle/templates'

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const PREFIX = "";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
    this.functions = app.functions();
  }

  addAuthListener(listener) {
    this.auth.onAuthStateChanged(listener)
  }

  doSignInWithGoogle() {
    let googleProvider = new app.auth.GoogleAuthProvider();
    return this.auth.signInWithPopup(googleProvider);
  }

  doSignOut = () => this.auth.signOut();

  getCurrentUser() {
    return this.auth.currentUser;
  }

  scoresYearPromise(year) {
    return this.db.ref(`scores/${year}`).once('value').then(
      snapshot => {
        const vals = snapshot.val();
        if (!vals) {
          throw new Error('no scores')
        }
        return vals;
      })
  }
  
  scoresWeekPromise(year, week) {
    return this.db.ref(`scores/${year}/${week}`).once('value').then(
      snapshot => {
        const vals = snapshot.val();
        if (!vals) {
          throw new Error('no scores')
        }
        const valsList = Object.keys(vals).map(key => ({
          ...vals[key],
          teamName: key,
        }));
        return valsList;
      }
    )
  }

  league_spec(leagueId) {
    return this.db.ref(`${PREFIX}leaguespec/${leagueId}`);
  }

  getStartsYear(uid, league, year, callback) {
    this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}/${uid}`).on('value',
      snapshot => {
        if (!snapshot.val()) {
          alert("can't find you in this league");
          callback({ weeks: [] })
        }
        callback(snapshot.val());
      })
  }

  setStartsRow(uid, league, year, weekIndex, row) {
    this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}/${uid}/${weekIndex}`).update(row);
  }

  hasDh(leagueId, year, callback) {
    return this.db.ref(`${PREFIX}leaguespec/${leagueId}`).on('value',
      snapshot => {
        let lsdp = new LeagueSpecDataProxy({ year })
        callback(lsdp.hasDh(snapshot.val(), year));
      })
  }

  draftTeam() {
    return this.functions.httpsCallable('draftTeam');
  }

  leagueSpecDataProxy(year) {
    return new LeagueSpecDataProxy({ year });
  }

  getAllLeagues() {
    // TODO: Pull all the leagues this user is in from the db
    return ['nbqbl', 'abqbl'];
  }

  scoresStartsUsersPromise(league, year) {
    let scoresPromise = this.db.ref(`scores/${year}`).once('value');
    let startsPromise = this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}`).once('value');
    let usersPromise = this.db.ref(`${PREFIX}leaguespec/${league}/users/2019`).once('value');

    return Promise.all([scoresPromise, startsPromise, usersPromise]).then(
      ([scoresSnapshot, startsSnapshot, usersSnapshot]) => {
        const dbScores = scoresSnapshot.val();
        const dbStarts = startsSnapshot.val();
        const dbUsers = usersSnapshot.val();
        if (!dbScores || !dbStarts || !dbUsers) {
          console.log(dbScores, dbStarts, dbUsers);
          throw new Error("Can't find one of scores, starts, users");
        }
        return {dbScores, dbStarts, dbUsers}
      })
  }

  processYearScores(dbScores, dbStarts, dbPlayers, legal_weeks) {
    const players = {};

    for (const playerKey of Object.keys(dbStarts)) {
      players[playerKey] = {};
      players[playerKey].name = dbPlayers[playerKey].name;
    }
    let playerTable = {};
    for (const [playerId, player] of Object.entries(players)) {
      let start_rows = {};
      for (const weekId of Object.values(legal_weeks)) {
        const startedTeams = getStartedTeams(dbStarts, playerId, weekId)
        const scores = startedTeams.map(scoreForTeam.bind(null, dbScores, weekId)) || [0, 0]
        start_rows[weekId] = TEMPLATES.StartRow(dbStarts[playerId][weekId].name,
          TEMPLATES.Start(startedTeams[0], scores[0]), TEMPLATES.Start(startedTeams[1], scores[1]));
      }
      const name = (player.name);
      playerTable[playerId] = createPlayer(name, 30, start_rows);
    }
    for (const player of Object.values(playerTable)) {
      let playerTotal = 0;
      for (const row of Object.values(player.start_rows)) {
        playerTotal += row.team_1.score + row.team_2.score;
      }
      player.total = playerTotal;
    }
    return playerTable;
  }

  joinScores(dbScores, dbStarts, dbUsers, week) {
    let dbWeekScores = sanitizeScoresDataWeek(dbScores)[week];
    let allStarts = this.getAllFromWeek(dbStarts, week);
    this.mergeData(dbWeekScores, allStarts);
    const playerList = []
    for (let [playerKey, playerVal] of Object.entries(allStarts)) {
      let starts = [];
      for (let start of playerVal.teams) {
        if (start.selected) {
          starts.push(TEMPLATES.Start(start.name, start.total))
        }
      }
      if (starts.length === 0) {
        starts.push(TEMPLATES.Start('none', 0))
        starts.push(TEMPLATES.Start('none', 0))
      }
      if (starts.length === 1) {
        starts.push(TEMPLATES.Start('none', 0))
      }

      playerList.push(TEMPLATES.StartRow(dbUsers[playerKey].name, ...starts))
    }
    return playerList;
  }

  getAllFromWeek(startsDataValue, week) {
    let allStarts = {}

    for (let [playerKey, playerVal] of Object.entries(startsDataValue)) {
      allStarts[playerKey] = playerVal[week];
    }
    return allStarts;
  }

  mergeData(scores, starts) {
    for (let playerVal of Object.values(starts)) {
      if (!playerVal.teams) { // For example, player didn't start anyone
        continue;
      }
      for (let team of playerVal.teams) {
        team.total = (scores[team.name] && scores[team.name].total) || 0;
      }
    }
  }

}

function sanitizeScoresDataWeek(dbScoresWeek) {
  dbScoresWeek['none'] = { total: 0 }
  return dbScoresWeek;
}

function createPlayer(name, total, start_rows) {
  return { name, total, start_rows };
}

function scoreForTeam(dbScores, week, team) {
  if (!team) {
    return 0;
  }
  return (dbScores[week] && dbScores[week][team] && dbScores[week][team].total) || 0;
}
function getStartedTeams(dbStarts, uid, week) {
  let starts = dbStarts[uid][week].teams.filter(team => team.selected).map(team => team.name);
  if (!starts || starts.length === 0) {
    starts = ['none', 'none'];
  }
  return starts;
}


class LeagueSpecDataProxy {
  constructor(props) {
    this.year = props.year;
  }

  isInLeague(uid, leagueData) {
    const users = (leagueData.users && leagueData.users[this.year]) || [];
    for (let i = 0; i < users.length; i++) {
      if (users[i].uid === uid) {
        return true;
      }
    }
    return false;
  }

  addUser(uid, leagueData) {
    if (!leagueData.users) {
      leagueData.users = {};
      leagueData.users[this.year] = [];
    }

    let users = leagueData.users[this.year];
    users.push({ name: "Foo", uid: uid, teams: [] });
    return leagueData;
  }

  getTakenTeams(leagueData) {
    return (leagueData.draft && leagueData.draft[this.year].map(draftItem => { return draftItem.team })) || [];
  }

  getDraftList(leagueData) {
    return (leagueData.draft && leagueData.draft[this.year]) || [];
  }

  hasDh(leagueData, year) {
    return leagueData['settings'][year].dh;
  }

}

export default Firebase;
