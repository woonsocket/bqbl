
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	userData: FirebaseObjectObservable<any>;
	db = null;
	user: Observable<firebase.User>;
	uid: string;
	displayName: string;
	constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth) {
		this.user = afAuth.authState;
		this.user.subscribe(value => {
			if (!value) {
				this.displayName = "";
				return;
			}
			this.displayName = value.displayName;
			this.uid = value.uid;
		});
	};


	login() {
		this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
	}

	logout() {
		this.afAuth.auth.signOut();
	}

}

