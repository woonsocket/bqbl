
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Router }  from '@angular/router';

@Component({
	templateUrl: './newuser.component.html',
	styleUrls: ['./newuser.component.css']
})
export class NewUserComponent {
	userData: FirebaseObjectObservable<any>;
	db = null;
	user: Observable<firebase.User>;
	uid: string;
	router: Router;

	constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth, router: Router) {
		this.db = db;
		this.user = afAuth.authState;
		this.user.subscribe(value => {
			this.userData = this.db.object('/tmp/'+value.uid);
			this.uid = value.uid;
		});
		this.router = router;
	};

	onCreate(team1: string, team2: string, team3: string, team4: string, name: string) : void {
		var user = new User();
		var teamNames = [team1, team2, team3, team4];
		user.name = name;
		user.teams = [];
		user.weeks = [];
		for (let weekNum in WEEK_NAMES) {
			var newWeek = new Week();
			newWeek.id = WEEK_NAMES[weekNum];
			newWeek.teams = [];
			for (let teamNum in teamNames) {
				var newTeam = new Team();
				newTeam.name = teamNames[teamNum];
				newTeam.selected = false;
				newWeek.teams.push(newTeam)
			}
			user.weeks[weekNum] = newWeek;
		}
		this.db.object("/tmp/"+this.uid).set(user).then( _ => {
			this.router.navigate(["lineup"]);
		});
	}
}

export class User {
	name: string;
	teams: Team[];
	weeks: {}; 
}
export class Week {
	id: string;
	teams: Team[]; 
}
export class Team {
	name: string;
	selected: boolean;	
}
const WEEK_NAMES: string[] = ["P1","P2","P3","P4", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];


