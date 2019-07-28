import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

const PREFIX="tmp/";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.db = app.database();
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

  league_starts_year(year, leagueId) {
    return this.db.ref(`${PREFIX}leagues/${leagueId}/${year}`);
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

  // TODO: delete
  leagueChanged() {
  }

}

export default Firebase;
