import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const PREFIX = "tmp/";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.db = app.database();
    this.functions = app.functions();

    this.auth.onAuthStateChanged(this.authChanged.bind(this));
    this.uid = "";
  }

  addAuthListener(listener) {
    this.auth.onAuthStateChanged(listener)
  }

  doSignInWithGoogle() {
    return this.auth.signInWithPopup(this.googleProvider);
  }
  doSignOut = () => this.auth.signOut();
  getCurrentUser() {
    return this.auth.currentUser;
  }

  /* Users api */
  getUserPath(uid) {
    return this.db.ref(`users/${uid}`);
  }

  users = () => {
    return this.db.ref('users');
  };

  scores_year(year) {
    return this.db.ref(`scores/${year}`);
  }

  scores_week(year, week) {
    return this.db.ref(`scores/${year}/${week}`);
  }

  starts_year(uid, year) {
    return this.db.ref(`${PREFIX}users/${uid}/plays/${year}`);
  }

  starts_week(uid, year, week) {
    return this.db.ref(`${PREFIX}users/${uid}/plays/${year}/${week}`);
  }

  league_starts_week(leagueId, year, week) {
    return this.db.ref(`${PREFIX}leagues/${leagueId}/${year}/${week}`)
  }

  league_starts_year(leagueId, year) {
    return this.db.ref(`${PREFIX}leagues/${leagueId}/${year}`);
  }

  league_spec(leagueId) {
    return this.db.ref(`${PREFIX}leaguespec/${leagueId}`);
  }

  authChanged(user) {
    if (!user) {
      console.log("bail!");
      return;
    }
    this.uid = user.uid;
    this.getUserPath(this.uid).on('value', snapshot => {
      const vals = snapshot.val();
      this.leagueId = vals.leagueId;
      this.leagueChanged();
    })
  }

  hasDh(leagueId, year, callback) {
    return this.db.ref(`${PREFIX}leaguespec/${leagueId}`).on('value',
      snapshot => {
        let lsdp = new LeagueSpecDataProxy({ year })
        callback(lsdp.hasDh(snapshot.val(), year));
      })
  }

  // TODO: delete
  leagueChanged() {
  }

  draftTeam() {
    return this.functions.httpsCallable('draftTeam');
  }

  leagueSpecDataProxy(year) {
    return new LeagueSpecDataProxy({ year });
  }

  // have a getter
  // db-derived vals prefixed with db
  getScores(leagueId, year, legal_weeks, callback) {
    var scoresPromise = this.scores_year(year).once('value');
    var startsPromise = this.league_starts_year(leagueId, year).once('value');

    Promise.all([scoresPromise, startsPromise]).then(
      ([scoresSnapshot, startsSnapshot]) => {
        const dbScores = scoresSnapshot.val();
        const dbStarts = startsSnapshot.val();
        const players = {};
        for (const weekIndex of Object.keys(dbStarts)) {
          const dbWeek = dbStarts[weekIndex];
          dbScores[weekIndex]['none'] = {total: 0}
          for (const playerKey of Object.keys(dbWeek)) {
            if (!players[playerKey]) {
              players[playerKey] = {};
            }
            // Players are not required to start two teams.
            // In these cases, sanitize the data.
            if (!dbWeek[playerKey].starts) {
              dbWeek[playerKey].starts = [{name: 'none', score: 0}, {name: 'none', score:0}]
            }
            if (dbWeek[playerKey].starts.length === 1) {
              dbWeek[playerKey].starts.push({name: 'none', score: 0});
            }
          }
        }
        let playerTable = {};
        for (const [playerId, player] of Object.entries(players)) {
          let start_rows = {};
          for (const [idx, weekId] of Object.entries(legal_weeks)) {
            const dbWeekPlayer = dbStarts[weekId][playerId];
            let name_1 = dbWeekPlayer.starts[0].name || "none";
            let name_2 = dbWeekPlayer.starts[1].name || "none";
            // TODO handle bye weeks better.
            let score_1 = (dbScores[weekId][dbWeekPlayer.starts[0].name] && dbScores[weekId][dbWeekPlayer.starts[0].name].total) || 0;
            let score_2 = (dbScores[weekId][dbWeekPlayer.starts[1].name] && dbScores[weekId][dbWeekPlayer.starts[1].name].total) || 0;
            
            start_rows[weekId] = createStartRow(dbStarts[weekId][playerId].name,
              createStart(name_1, score_1), createStart(name_2, score_2));
          }
          const name = (dbStarts[legal_weeks[0]][playerId].name);
          playerTable[playerId] = createPlayer(name, 30, start_rows);
        }
        for (const [playerId, player] of Object.entries(playerTable)) {
          let playerTotal = 0;
          for (const [idx, row] of Object.entries(player.start_rows)) {
            playerTotal += row.team_1.score + row.team_2.score;
          }
          player.total = playerTotal;
        }
        callback({ players: players, playerTable: playerTable });
        console.log(playerTable);
      })

  }

}


function createPlayer(name, total, start_rows) {
  return { name, total, start_rows };
}
function createStartRow(name, team_1, team_2) {
  return { name, team_1, team_2 };
}
function createStart(team_name, score) {
  return { team_name, score }
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
