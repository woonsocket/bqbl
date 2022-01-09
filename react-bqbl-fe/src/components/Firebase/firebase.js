import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/functions';
import app from 'firebase/compat/app';

import { LeagueSpecDataProxy } from '../../middle/response';
import { useContext, useState, useEffect } from 'react';
import FirebaseContext from './context';

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

  doSignInWithGoogle() {
    let googleProvider = new app.auth.GoogleAuthProvider();
    return this.auth.signInWithPopup(googleProvider);
  }

  doSignOut = () => this.auth.signOut();

  getScoresYear(year) {
    let scoresRef = this.db.ref(`scores/${year}`);
    let scores247Ref = this.db.ref(`scores247/${year}`);
    const promise = new Promise((resolve, reject) => {

      scoresRef.on('value', scoresSnap => {
        scores247Ref.on('value', scores247Snap => {
          const dbScores = scoresSnap.val();
          const dbScores247 = scores247Snap.val() || [];
          if (!dbScores) {
            throw new Error("Can't read NFL team scores");
          }
          if (!dbScores247) {
            console.log("Can't read 24/7 scores. Have the quarterbacks really been that good?");
          }
          resolve({ dbScores, dbScores247 });
        });
      })
    });

    return [promise, () => {
      scoresRef.off('value');
      scores247Ref.off('value');
    }];
  }

  getScoresWeek(year, week) {
    const ref = this.db.ref(`scores/${year}/${week}`);
    const promise = new Promise((resolve, reject) => {
      ref.on('value',
        snapshot => {
          const vals = snapshot.val() || [];
          const valsList = Object.keys(vals).map(key => ({
            ...vals[key],
            teamName: key,
          }));
          resolve(valsList);
        })
    });
    return [promise, () => ref.off('value')];
  }

  getEvents(year, week) {
    const ref = this.db.ref(`events/${year}/${week}`);
    const promise = new Promise((resolve, reject) => {
      ref.on('value',
        snapshot => {
          const vals = snapshot.val();
          if (!vals) {
            throw new Error('no passers')
          }

          resolve(vals);
        })
    });
    return [promise, () => ref.off('value')];
  }

  updateEventsOverrides(year, week, data) {
    this.db.ref(`events/${year}/${week}/overrides`).update(data);
  }

  get247(year) {
    const ref = this.db.ref(`scores247/${year}`);
    const promise = new Promise((resolve, reject) => {
      ref.on('value', snapshot => {
        resolve(snapshot.val() || {});
      });
    });
    return [promise, () => ref.off('value')];
  }

  push247(year, data) {
    this.db.ref(`scores247/${year}`).push(data);
  }

  getLeagueSpec(leagueId) {
    const loc = `${PREFIX}leaguespec/${leagueId}`;
    const ref = this.db.ref(loc);
    const promise = new Promise((resolve, reject) => {
      ref.on('value', snapshot => {
        if (!snapshot.val()) {
          throw new Error(`couldn't find league ${loc}`);
        }
        resolve(snapshot.val());
      });
    });
    return [promise, () => ref.off('value')];
  }

  getLockedWeeks(nowMs) {
    // TODO(aerion): Namespace the unlock times by year.
    const ref = this.db.ref('/unlockedweeks');
    const promise = new Promise((resolve, reject) => {
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
          resolve(lockedWeeks);
        });
    });
    return [promise, () => ref.off('value')];
  }

  getStartsYear(uid, league, year) {
    const ref = this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}/${uid}`);
    const promise = new Promise((resolve, reject) => {

      ref.on('value', snapshot => {
        if (!snapshot.val()) {
          throw new Error("can't find you in this league");
        }
        resolve(snapshot.val());
      });
    });
    return [promise, () => ref.off('value')];
  }

  updateStartsRow(league, year, weekIndex, row) {
    const uid = this.auth.currentUser.uid;
    const uri = `${PREFIX}leaguespec/${league}/plays/${year}/${uid}/${weekIndex}`;
    return this.db.ref(uri).update(row);
  }

  getProBowlYear(uid, league, year) {
    const ref = this.db.ref(`${PREFIX}leaguespec/${league}/probowl/${year}/${uid}`);
    const promise = new Promise((resolve, reject) => {
      ref.on('value', snapshot => {
        resolve(snapshot.val() || []);
      });
    });
    return [promise, () => ref.off('value')];
  }

  // Calls back with an array of objects, one per player. Each describes the
  // player and their starts:
  //   {name: 'Player name', starts: ['Team1', 'Team2', ...]}
  // Empty if the league does not exist. Players who have not chosen any teams
  // are included in the returned list, but with an empty `starts` array.
  getProBowlStartsForLeague(league, year) {
    return new Promise((resolve, reject) => {
      let [leagueSpecPromise, unsubLeagueSpec] = this.getLeagueSpec(league);
      leagueSpecPromise.then((spec) => {
        console.log({league, year, spec})
        if (!spec) {
          return [];
        }
        const ldsp = new LeagueSpecDataProxy(spec, year);
        const proBowlStarts = ldsp.getProBowlStarts();
        const leagueUsers = ldsp.getUsers();
        const users = [];
        for (const [uid, data] of Object.entries(leagueUsers)) {
          users.push({
            name: data.name,
            id: uid,
            starts: proBowlStarts[uid] || [],
          });
        }
        resolve(users);
      });
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

  getScoresStartsUsers(league, year) {
    let scoresRef = this.db.ref(`scores/${year}`);
    let scores247Ref = this.db.ref(`scores247/${year}`);
    let startsRef = this.db.ref(`${PREFIX}leaguespec/${league}/plays/${year}`);
    let usersRef = this.db.ref(`${PREFIX}leaguespec/${league}/users/${year}`);
    const promise = new Promise((resolve, reject) => {
      scoresRef.on('value',
        scoresSnap => {
          scores247Ref.on('value',
            scores247Snap => {
              startsRef.on('value',
                startsSnap => {
                  usersRef.on('value',
                    usersSnap => {
                      const dbScores = scoresSnap.val();
                      const dbScores247 = scores247Snap.val() || {};
                      const dbStarts = startsSnap.val();
                      const dbUsers = usersSnap.val();
                      if (!dbScores || !dbScores247 || !dbStarts || !dbUsers) {
                        console.log(dbScores, dbScores247, dbStarts, dbUsers);
                        throw new Error(
                          "Can't find one of scores, scores247, starts, users");
                      }
                      resolve({ dbScores, dbScores247, dbStarts, dbUsers });
                    });
                });
            });
        });
    });

    return [promise, () => {
      scoresRef.off('value');
      scores247Ref.off('value');
      startsRef.off('value');
      usersRef.off('value');
    }];
  }

  addFumbleSix(year, week, fumble) {
    this.db.ref(`${PREFIX}events/${year}/${week}/fumbles`).push(fumble);
    this.db.ref(`${PREFIX}events/${year}/${week}/overrides/${fumble.team}/fumblesixes`).push(fumble);
  }

  addSafety(year, week, safety) {
    this.db.ref(`${PREFIX}events/${year}/${week}/safeties`).push(safety);
    this.db.ref(`${PREFIX}events/${year}/${week}/overrides/${safety.team}/safeties`).push(safety);
  }
}

export function useUser() {
  let firebase = useContext(FirebaseContext);
  let [user, setUser] = useState(firebase.auth.currentUser)

  useEffect(() => {
    return firebase.auth.onAuthStateChanged(setUser);
  }, [firebase, setUser]);

  return user;
}


export default Firebase;
