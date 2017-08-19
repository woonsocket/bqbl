
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
})
export class LoginComponent {
  user: Observable<firebase.User>;
  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.user = afAuth.authState;
    this.user.subscribe(value => {
      if (value && value.uid !== '') {
        this.router.navigate(['/']);
      }
    });
  }

  onLogin() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}

