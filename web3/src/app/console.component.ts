
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './console.component.html',
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

