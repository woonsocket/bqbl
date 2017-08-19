
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params }  from '@angular/router';
import 'rxjs/add/operator/switchMap';

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
	year = "2017"
	route: ActivatedRoute;
	constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth, route: ActivatedRoute, router: Router) {
		this.db = db;
		this.user = afAuth.authState;
		this.week =	route.snapshot.queryParams['week'] || this.week;
		this.route = route;

		this.user.subscribe(value => {
			this.userDataList = this.db.list('/tmp');
			this.userDataList.subscribe(users => {
				for (var user of users) {
					this.userToTeams[user.$key] = {};
					for (var week of user.weeks) {
						var activeTeams = [];
						for (var team of week.teams) {
							if (team.selected) {
								activeTeams.push(team.name);
							}
						}
						this.userToTeams[user.$key][week.id] = {'name': user.name, 'teams':activeTeams};
					}
				}
				this.updateScores();
			});
			this.loadScoresDb();
		});
	}

	ngOnInit() {
		this.route.queryParams.subscribe((params: Params) => {
	      this.week = params.week || "1";
	      this.year = params.year || "2017"
	      console.log(this.week);
	      this.loadScoresDb();
    	});
	}

	loadScoresDb() : void {
		this.teamToScores = {};
		this.scoresList = this.db.list('/scores/'+this.year+'/' + this.week);
		this.scoresList.subscribe(scores => {
			for (var score of scores) {
				this.teamToScores[score.$key] = score.total;
			}
			this.teamToScores['N/A'] = 0;
			this.updateScores();
			console.log(this.teamToScores);
		});
	}

	updateScores() : void {
		this.scoreRows = [];
		for (var uid in this.userToTeams) {
			var name = this.userToTeams[uid][this.week].name;
			var teams = this.userToTeams[uid][this.week].teams;
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


