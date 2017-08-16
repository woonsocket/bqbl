
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
	templateUrl: './admin.component.html',
})
export class AdminComponent {
	teams = [];
	userData: FirebaseObjectObservable<any>;
	db = null;
	user: Observable<firebase.User>;
	uid: string;
	displayName: string;
	constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth) {
		this.db = db;
		this.user = afAuth.authState;
		this.user.subscribe(value => {
			if (!value) {
				this.displayName = "";
				return;
			}
			this.userData = this.db.object('/tmp/'+value.uid);
			this.displayName = value.displayName;
		});
	};

	isLegalAdd (week: Week) : boolean {
		var selectedTeams = 0;
		for (let teamNum in week.teams) {
			if (week.teams[teamNum].selected) {
				selectedTeams++;
			}
		}
		return selectedTeams < 2;
	}

	onSelect(week: Week, team: Team, weekId: string): void {
		if (!team.selected && !this.isLegalAdd(week)) {
			return;
		}
		team.selected = !team.selected;
		this.db.object("/tmp/"+this.uid+"/weeks/"+weekId+"/teams").set(week.teams);
	};

	onReset() : void {
		var user = new User();
		user.name = "Harvey";
		user.teams = [];
		user.weeks = [];
		for (let weekNum in WEEK_NAMES) {
			var newWeek = new Week();
			newWeek.id = WEEK_NAMES[weekNum];
			newWeek.teams = [];
			for (let teamNum in TEAM_NAMES) {
				var newTeam = new Team();
				newTeam.name = TEAM_NAMES[teamNum];
				newTeam.selected = false;
				newWeek.teams.push(newTeam)
			}
			user.weeks[weekNum] = newWeek;
		}
		this.userData.set(user);
		this.db.object("/tmp/"+this.uid).set(user);
	}

}

