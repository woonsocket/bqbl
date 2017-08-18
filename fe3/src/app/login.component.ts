
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router }  from '@angular/router';

@Component({
	templateUrl: './login.component.html',
})
export class LoginComponent {
	user: Observable<firebase.User>;
	constructor(private afAuth: AngularFireAuth, private router: Router) {
		this.user = afAuth.authState;
		this.user.subscribe(value => {
			if (value && value.uid != "") {
				this.router.navigate(["/"]);
			}
		});
	};

	onLogin() {
		this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
	}
}

