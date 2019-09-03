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

  getStartsYear(uid, league, year, callback) {
    this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}/${uid}`).on('value',
    snapshot => {
      callback(snapshot.val());
    })
  }

  setStartsRow(uid, league, year, weekIndex, row) {
    this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}/${uid}/${weekIndex}`).update(row);
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

  getAllLeagues() {
    // TODO: Pull all the leagues this user is in from the db
    return ['nbqbl', 'abqbl'];
  }

  getScores(league, year, legal_weeks, callback) {
    let scoresPromise = this.scores_year(year).once('value');
    let startsPromise = this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}`).once('value');
    let playersPromise = this.db.ref(`${PREFIX}leaguespec/${league}/users/2019`).once('value');

    function scoreForTeam(dbScores, week, team) {
      if (!team) {
        return 0;
      }
      return dbScores[week] && dbScores[week][team] && dbScores[week][team].total || 0;
    }
    function getStartedTeams(dbStarts, uid, week) {
      let starts = dbStarts[uid][week].teams.filter(team=>team.selected).map(team=>team.name);
      if (!starts || starts.length == 0) {
        starts = ['none', 'none'];
      }
      return starts;
    }

    Promise.all([scoresPromise, startsPromise, playersPromise]).then(
      ([scoresSnapshot, startsSnapshot, playersSnapshot]) => {
        const dbScores = scoresSnapshot.val();
        const dbStarts = startsSnapshot.val();
        const dbPlayers = playersSnapshot.val();
        if (!dbScores || !dbStarts || !dbPlayers) {
          console.log("bail")
          return;
        }
        
        const players = {};
        // TODO: yeah don't do this.
        for (const playerKey of Object.keys(dbStarts)) {
          players[playerKey] = {};
          for (const user of Object.keys(dbPlayers)) {
            if (dbPlayers[user].uid == playerKey) {
              players[playerKey].name = dbPlayers[user].name;
            }
          }
        }
        let playerTable = {};
        for (const [playerId, player] of Object.entries(players)) {
          let start_rows = {};
          for (const weekId of Object.values(legal_weeks)) {
            const startedTeams = getStartedTeams(dbStarts, playerId, weekId)
            const scores = startedTeams.map(scoreForTeam.bind(null, dbScores, weekId)) || [0,0] 
            start_rows[weekId] = createStartRow(dbStarts[playerId][weekId].name,
              createStart(startedTeams[0], scores[0]), createStart(startedTeams[1], scores[1]));
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
        callback(playerTable);
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
