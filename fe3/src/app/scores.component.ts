
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
	userDataList: FirebaseListObservable<any>;
	db = null;
	user: Observable<firebase.User>;
	userList = [];
	constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth) {
		this.db = db;
		this.user = afAuth.authState;
		this.user.subscribe(value => {
			this.userDataList = this.db.list('/tmp/');
			this.userDataList.subscribe(users => {
				console.log(users);
				for (var i = 0; i < users.length; i++) {
					console.log(users[i]);
					this.userList.push({'name': users[i].name});
				}
			});
		});
	};
}

