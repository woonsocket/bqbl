
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router }  from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	userData: FirebaseObjectObservable<any>;
	db = null;
	user: Observable<firebase.User>;
	uid = "";
	displayName = "Login";
	constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth,  private router: Router) {
		this.user = afAuth.authState;
		this.router = router;
		this.user.subscribe(value => {
			if (!value) {
				this.displayName = "Login";
				this.router.navigate(["/login"]);
				return;
			}
			this.displayName = value.displayName;
			this.uid = value.uid;
		});
	};

	closeDrawer() {
		var d = document.querySelector('.mdl-layout');
		d["MaterialLayout"].toggleDrawer();
	}

	login() {
		if (this.uid != "") {
			this.afAuth.auth.signOut();
			this.displayName = "Login";
			this.uid = "";
		} else {
			this.router.navigate(["/login"]);
		}
	}
}

