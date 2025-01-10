import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/functions";
import app from "firebase/compat/app";

import { useContext, useState, useEffect } from "react";
import FirebaseContext from "./context";
import * as R from "ramda";

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

  getDb = () => this.db;


  getEventsThen(year, week, cb) {
    const ref = this.db.ref(`events/${year}/${week}`);
    ref.on("value", (snapshot) => {
      const vals = snapshot.val();
      if (!vals) {
        throw new Error("no passers");
      }

      cb(vals);
    });
    return () => ref.off("value");
  }

  updateEventsOverrides(year, week, data) {
    this.db.ref(`events/${year}/${week}/overrides`).update(data);
  }

  get247(year, cb) {
    const ref = this.db.ref(`scores247/${year}`);
    ref.on("value", (snapshot) => {
      cb(snapshot.val() || {});
    });
    return () => ref.off("value");
  }

  push247(year, data) {
    this.db.ref(`scores247/${year}`).push(data);
  }

  getLeagueSpecThen(leagueId, cb) {
    const loc = `${PREFIX}leaguespec/${leagueId}`;
    const ref = this.db.ref(loc);
    ref.on("value", (snapshot) => {
      if (!snapshot.val()) {
        throw new Error(`couldn't find league ${loc}`);
      }
      cb(snapshot.val());
    });
    return () => ref.off("value");
  }

  getLockedWeeksThen(year, nowMs, cb) {
    const ref = this.db.ref(`/unlockedweeks/${year}`);
    ref.on("value", (snapshot) => {
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
          lockedWeeks.add("" + idx);
        }
      });
      cb(lockedWeeks);
    });
    return () => ref.off("value");
  }

  updateStartsRow(league, year, weekIndex, uid, row) {
    const uri = `${PREFIX}leaguespec/${league}/plays/${year}/${uid}/${weekIndex}`;
    return this.db.ref(uri).update(row);
  }

  getProBowlYearThen(uid, league, year, cb) {
    const ref = this.db.ref(
      `${PREFIX}leaguespec/${league}/probowl/${year}/${uid}`
    );
    ref.on("value", (snapshot) => {
      cb(snapshot.val() || []);
    });
    return () => ref.off("value");
  }

  // Calls back with an array of objects, one per player. Each describes the
  // player and their starts:
  //   {name: 'Player name', starts: ['Team1', 'Team2', ...]}
  // Empty if the league does not exist. Players who have not chosen any teams
  // are included in the returned list, but with an empty `starts` array.
  getProBowlStartsForLeagueThen(league, year, cb) {
    this.getLeagueSpecThen(league, (spec) => {
      if (!spec) {
        return [];
      }
      const proBowlStarts = R.path(["probowl", year], spec) || {};

      const leagueUsers = R.path(["users", year], spec) || {};
      const users = [];
      for (const [uid, data] of Object.entries(leagueUsers)) {
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
    return this.functions.httpsCallable("draftTeam");
  }

  getAllLeagues() {
    // TODO: Pull all the leagues this user is in from the db
    return ["nbqbl", "abqbl"];
  }

  addFumbleSix(year, week, fumble) {
    this.db.ref(`${PREFIX}events/${year}/${week}/fumbles`).push(fumble);
    this.db
      .ref(
        `${PREFIX}events/${year}/${week}/overrides/${fumble.team}/fumblesixes`
      )
      .push(fumble);
  }

  addSafety(year, week, safety) {
    this.db.ref(`${PREFIX}events/${year}/${week}/safeties`).push(safety);
    this.db
      .ref(`${PREFIX}events/${year}/${week}/overrides/${safety.team}/safeties`)
      .push(safety);
  }
}

export function useUser() {
  let firebase = useContext(FirebaseContext);
  let [user, setUser] = useState(firebase.auth.currentUser);

  useEffect(() => {
    return firebase.auth.onAuthStateChanged(setUser);
  }, [firebase, setUser]);

  return user;
}

export default Firebase;
