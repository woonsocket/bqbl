
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ActivatedRoute }  from '@angular/router';

@Component({
	templateUrl: './scores.component.html',
})
export class ScoresComponent {
	userDataList: FirebaseListObservable<any>;
	scoresList: FirebaseListObservable<any>;
	db = null;
	user: Observable<firebase.User>;
	userToTeams = {};
	teamToScores = {};
	scoreRows = [];
	week = "1";
	constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth, private route: ActivatedRoute) {
		this.db = db;
		this.user = afAuth.authState;
		this.week =	route.snapshot.queryParams['week'];
		this.user.subscribe(value => {
			this.userDataList = this.db.list('/tmp');
			this.userDataList.subscribe(users => {
				for (var user of users) {
					var week = user.weeks[1];
					var activeTeams = [];
					for (var team of week.teams) {
						if (team.selected) {
							activeTeams.push(team.name);
						}
					}
					// TODO(harveyj): Make this uid keyed.
					this.userToTeams[user.name] = activeTeams;
				}
				this.updateScores();
			});

			this.scoresList = this.db.list('/scores/2017/' + this.week);
			this.scoresList.subscribe(scores => {
				for (var score of scores) {
					this.teamToScores[score.$key] = score.total;
				}
				this.teamToScores['N/A'] = 0;
				this.updateScores();
			});

		});
	}

	updateScores() : void {
		this.scoreRows = [];
		for (var name in this.userToTeams) {
			var teams = this.userToTeams[name];
			teams[0] = teams[0] || 'N/A';
			teams[1] = teams[1] || 'N/A';

			var scoreRow = {
				'name':  name,
				'team1': teams[0],
				'score1': this.getScore(teams[0]),
				'team2': teams[1],
				'score2': this.getScore(teams[1]),
			}
			this.scoreRows.push(scoreRow);
		}
	}

	getScore(teamName : string) : number {
		if (!this.teamToScores[teamName]) {
			return 0;
		}
		return this.teamToScores[teamName];
	}
}


