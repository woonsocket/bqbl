import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';
import * as TEMPLATES from '../../middle/templates'
import app from 'firebase/app';

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
    return this.db.ref(`scores/${year}`).on('value',
      snapshot => {
        const vals = snapshot.val();
        if (!vals) {
          throw new Error('no scores')
        }
        cb(vals);
      })
  }

  getScoresWeekThen(year, week, cb) {
    return this.db.ref(`scores/${year}/${week}`).on('value',
      snapshot => {
        const vals = snapshot.val();
        if (!vals) {
          throw new Error('no scores')
        }
        const valsList = Object.keys(vals).map(key => ({
          ...vals[key],
          teamName: key,
        }));
        cb(valsList);
      }
    )
  }

  getEventsThen(year, week, cb) {
    return this.db.ref(`events/${year}/${week}`).on('value',
      snapshot => {
        const vals = snapshot.val();
        if (!vals) {
          throw new Error('no passers')
        }

        cb(vals);
      }
    )
  }

  updateEventsOverrides(year, week, data) {
    this.db.ref(`events/${year}/${week}/overrides`).update(data);
  }

  push247(year, data) {
    this.db.ref(`scores247/${year}`).push(data);
  }

  getLeagueSpecThen(leagueId, cb) {
    const loc = `${PREFIX}leaguespec/${leagueId}`;
    this.db.ref(loc).on('value', snapshot => {
      if (!snapshot.val()) {
        throw new Error(`couldn't find league ${loc}`);
      }
      cb(snapshot.val());
    })
  }

  getLockedWeeksThen(nowMs, cb) {
    // TODO(aerion): Namespace the unlock times by year.
    this.db.ref('/unlockedweeks').on('value',
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
  }

  getStartsYear(uid, league, year) {
    return this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}/${uid}`)
      .once('value').then(
        snapshot => {
          if (!snapshot.val()) {
            throw new Error("can't find you in this league");
          }
          return snapshot.val();
        });
  }

  getStartsYearThen(uid, league, year, cb) {
     this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}/${uid}`)
      .once('value').then(
        snapshot => {
          if (!snapshot.val()) {
            throw new Error("can't find you in this league");
          }
          cb(snapshot.val());
        });
  }

  updateStartsRow(league, year, weekIndex, row) {
    const uid = this.auth.currentUser.uid;
    const uri = `${PREFIX}leaguespec/${league}/plays/${year}/${uid}/${weekIndex}`;
    return this.db.ref(uri).update(row);
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
    let startsRef = this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}`);
    let usersRef = this.db.ref(`${PREFIX}leaguespec/${league}/users/2019`);

    return scoresRef.on('value',
      scoresSnap => {
        startsRef.on('value',
          startsSnap => {
            usersRef.on('value',
              usersSnap => {
                const dbScores = scoresSnap.val();
                const dbStarts = startsSnap.val();
                const dbUsers = usersSnap.val();
                if (!dbScores || !dbStarts || !dbUsers) {
                  console.log(dbScores, dbStarts, dbUsers);
                  throw new Error("Can't find one of scores, starts, users");
                }
                cb({ dbScores, dbStarts, dbUsers });
              })
          })
      })
  }
}

export default Firebase;
