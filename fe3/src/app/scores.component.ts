
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
	templateUrl: './scores.component.html',
})
export class ScoresComponent {
	userDataList: FirebaseListObservable<any[]>;
	db = null;
	user: Observable<firebase.User>;
	constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth) {
		this.db = db;
		this.user = afAuth.authState;
		this.user.subscribe(value => {
			this.userDataList = this.db.list('/tmp/');
		});
	};
}

