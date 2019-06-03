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

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle() {
    return this.auth.signInWithPopup(this.googleProvider);
  }
  doSignOut = () => this.auth.signOut();

  /* Users api */
  getUserPath(uid) {
    return this.db.ref(`users/${uid}`);
  };

  users = () => {
    return this.db.ref('users');
  };

  scores_week(year, week) {
    return this.db.ref(`scores/${year}/${week}`);
  }

  starts_year(uid, year) {
    return this.db.ref(`users/${uid}/weeks`);
  };

  authChanged(user) {
    if (!user) {
      console.log("bail!");
      return;
    }
    // var displayName = user.displayName;
    // var email = user.email;
    // var emailVerified = user.emailVerified;
    // var photoURL = user.photoURL;
    // var isAnonymous = user.isAnonymous;
    this.uid = user.uid;
    this.getUserPath(this.uid).on('value', snapshot => {
      const vals = snapshot.val();
      this.leagueId = vals.leagueId;
      this.leagueChanged();
    })
  }

  leagueChanged() {
    this.starts_year('2018', '3').on('value', snapshot => {
      // console.log(snapshot.val());
    });
  }

}

export default Firebase;
