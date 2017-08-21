
import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
  week = '1';
  year = '2017';
  route: ActivatedRoute;
  constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth, route: ActivatedRoute, router: Router) {
    this.db = db;
    this.user = afAuth.authState;
    this.week = route.snapshot.queryParams['week'] || this.week;
    this.route = route;

    this.user.subscribe(value => {
      this.userDataList = this.db.list('/tmp');
      this.userDataList.subscribe(users => {
        for (const user of users) {
          this.userToTeams[user.$key] = {};
          for (const week of user.weeks) {
            const activeTeams = [];
            for (const team of week.teams) {
              if (team.selected) {
                activeTeams.push(team.name);
              }
            }
            this.userToTeams[user.$key][week.id] = {'name': user.name, 'teams': activeTeams};
          }
        }
        this.updateScores();
      });
      this.loadScoresDb();
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
     this.week = params.week || '1';
     this.year = params.year || '2017';
     this.loadScoresDb();
    });
  }

  loadScoresDb(): void {
    this.teamToScores = {};
    this.scoresList = this.db.list('/scores/' + this.year + '/' + this.week);
    this.scoresList.subscribe(scores => {
      for (const score of scores) {
        this.teamToScores[score.$key] = score.total;
      }
      this.teamToScores['N/A'] = 0;
      this.updateScores();
    });
  }

  updateScores(): void {
    this.scoreRows = [];
    for (const uid in this.userToTeams) {
      const name = this.userToTeams[uid][this.week].name;
      const teams = this.userToTeams[uid][this.week].teams;
      teams[0] = teams[0] || 'N/A';
      teams[1] = teams[1] || 'N/A';

      const scoreRow = {
        'name': name,
        'team1': teams[0],
        'score1': this.getScore(teams[0]),
        'team2': teams[1],
        'score2': this.getScore(teams[1]),
      };
      this.scoreRows.push(scoreRow);
    }
  }

  getScore(teamName: string): number {
    if (!this.teamToScores[teamName]) {
      return 0;
    }
    return this.teamToScores[teamName];
  }
}
