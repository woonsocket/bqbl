import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import app from 'firebase/app';

import { LeagueSpecDataProxy } from '../../middle/response';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const PREFIX = "";

/**
 * Methods that subscribe to database updates should return a zero-argument
 * function that cleans up, e.g., by removing any database callbacks added by
 * the method.
 */
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
    this.functions = app.functions();
  }

  addAuthListener(listener) {
    return this.auth.onAuthStateChanged(listener);
  }

  doSignInWithGoogle() {
    let googleProvider = new app.auth.GoogleAuthProvider();
    return this.auth.signInWithPopup(googleProvider);
  }

  doSignOut = () => this.auth.signOut();

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getScoresYearThen(year, cb) {
    let scoresRef = this.db.ref(`scores/${year}`);
    let scores247Ref = this.db.ref(`scores247/${year}`);

    scoresRef.on('value', scoresSnap => {
      scores247Ref.on('value', scores247Snap => {
        const dbScores = scoresSnap.val();
        const dbScores247 = scores247Snap.val();
        if (!dbScores) {
          throw new Error("Can't read NFL team scores");
        }
        if (!dbScores247) {
          throw new Error("Can't read 24/7 scores");
        }
        cb({ dbScores, dbScores247 });
      });
    });

    return () => {
      scoresRef.off('value');
      scores247Ref.off('value');
    };
  }

  getScoresWeekThen(year, week, cb) {
    const ref = this.db.ref(`scores/${year}/${week}`);
    ref.on('value',
      snapshot => {
        const vals = snapshot.val() || [];
        const valsList = Object.keys(vals).map(key => ({
          ...vals[key],
          teamName: key,
        }));
        cb(valsList);
      });
    return () => ref.off('value');
  }

  getEventsThen(year, week, cb) {
    const ref = this.db.ref(`events/${year}/${week}`);
    ref.on('value',
      snapshot => {
        const vals = snapshot.val();
        if (!vals) {
          throw new Error('no passers')
        }

        cb(vals);
      });
    return () => ref.off('value');
  }

  updateEventsOverrides(year, week, data) {
    this.db.ref(`events/${year}/${week}/overrides`).update(data);
  }

  get247(year, cb) {
    const ref = this.db.ref(`scores247/${year}`);
    ref.on('value', snapshot => {
      cb(snapshot.val() || {});
    });
    return () => ref.off('value');
  }

  push247(year, data) {
    this.db.ref(`scores247/${year}`).push(data);
  }

  getLeagueSpecThen(leagueId, cb) {
    const loc = `${PREFIX}leaguespec/${leagueId}`;
    const ref = this.db.ref(loc);
    ref.on('value', snapshot => {
      if (!snapshot.val()) {
        throw new Error(`couldn't find league ${loc}`);
      }
      cb(snapshot.val());
    });
    return () => ref.off('value');
  }

  getLockedWeeksThen(nowMs, cb) {
    // TODO(aerion): Namespace the unlock times by year.
    const ref = this.db.ref('/unlockedweeks');
    ref.on('value',
      snapshot => {
        if (!snapshot.val()) {
          throw new Error(`can't read unlockedweeks`);
        }
        const weeks = snapshot.val();
        const lockedWeeks = new Set();
        weeks.forEach((weekLockMs, idx) => {
          if (weekLockMs === null) {
            return;
          }
          if (weekLockMs < nowMs) {
            lockedWeeks.add('' + idx);
          }
        });
        cb(lockedWeeks);
      });
    return () => ref.off('value');
  }

  getStartsYearThen(uid, league, year, cb) {
    const ref = this.db.ref(
        `${PREFIX}leaguespec/${league}/plays/${year}/${uid}`);
    ref.on('value', snapshot => {
      if (!snapshot.val()) {
        throw new Error("can't find you in this league");
      }
      cb(snapshot.val());
    });
    return () => ref.off('value');
  }

  updateStartsRow(league, year, weekIndex, row) {
    const uid = this.auth.currentUser.uid;
    const uri = `${PREFIX}leaguespec/${league}/plays/${year}/${uid}/${weekIndex}`;
    return this.db.ref(uri).update(row);
  }

  getProBowlYearThen(uid, league, year, cb) {
    const ref = this.db.ref(`${PREFIX}leaguespec/${league}/probowl/${year}/${uid}`);
    ref.on('value', snapshot => {
      cb(snapshot.val() || []);
    });
    return () => ref.off('value');
  }

  // Calls back with an array of objects, one per player. Each describes the
  // player and their starts:
  //   {name: 'Player name', starts: ['Team1', 'Team2', ...]}
  // Empty if the league does not exist. Players who have not chosen any teams
  // are included in the returned list, but with an empty `starts` array.
  getProBowlStartsForLeague(league, year, cb) {
    return this.getLeagueSpecThen(league, (spec) => {
      if (!spec) {
        return [];
      }
      const ldsp = new LeagueSpecDataProxy(spec, year);
      const proBowlStarts = ldsp.getProBowlStarts();
      const users = [];
      for (const [uid, data] of Object.entries(ldsp.getUsers())) {
        users.push({
          name: data.name,
          id: uid,
          starts: proBowlStarts[uid] || [],
        });
      }
      cb(users);
    });
  }

  updateProBowlStarts(league, year, teams) {
    // TODO(aerion): Be consistent about whether uid is a param or not.
    const uid = this.auth.currentUser.uid;
    const uri = `${PREFIX}leaguespec/${league}/probowl/${year}/${uid}`;
    return this.db.ref(uri).set(teams);
  }

  draftTeam() {
    return this.functions.httpsCallable('draftTeam');
  }

  getAllLeagues() {
    // TODO: Pull all the leagues this user is in from the db
    return ['nbqbl', 'abqbl'];
  }

  getScoresStartsUsersThen(league, year, cb) {
    let scoresRef = this.db.ref(`scores/${year}`);
    let scores247Ref = this.db.ref(`scores247/${year}`);
    let startsRef = this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}`);
    let usersRef = this.db.ref(`${PREFIX}leaguespec/${league}/users/2019`);

    scoresRef.on('value',
      scoresSnap => {
        scores247Ref.on('value',
          scores247Snap => {
            startsRef.on('value',
              startsSnap => {
                usersRef.on('value',
                  usersSnap => {
                    const dbScores = scoresSnap.val();
                    const dbScores247 = scores247Snap.val();
                    const dbStarts = startsSnap.val();
                    const dbUsers = usersSnap.val();
                    if (!dbScores || !dbScores247 || !dbStarts || !dbUsers) {
                      console.log(dbScores, dbScores247, dbStarts, dbUsers);
                      throw new Error(
                          "Can't find one of scores, scores247, starts, users");
                    }
                    cb({ dbScores, dbScores247, dbStarts, dbUsers });
                  });
              });
          });
      });

    return () => {
      scoresRef.off('value');
      scores247Ref.off('value');
      startsRef.off('value');
      usersRef.off('value');
    };
  }
}

export default Firebase;
