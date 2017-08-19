
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  templateUrl: './login.component.html',
})
export class ConsoleComponent {
  user: Observable<firebase.User>;
  constructor(private afAuth: AngularFireAuth) {
    this.user = afAuth.authState;
    this.user.subscribe(value => {
      // if logged in redirect to /
    });
  }

  onLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}

