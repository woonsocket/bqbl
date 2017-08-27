
import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from './constants.service'

@Component({
  templateUrl: './standings.component.html',
})
export class StandingsComponent {
  userDataList: FirebaseListObservable<any>;
  scoresList: FirebaseObjectObservable<any>;
  db: AngularFireDatabase;
  user: Observable<firebase.User>;
  leagueToUsers = {};
  leagueToNames = {};
  userToTeams = {};
  teamToScores = {};
  userRows = {};
  scores = {};
  year = '2017';

  constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth, private route: ActivatedRoute,
              private router: Router, private constants: ConstantsService) {
    this.db = db;
    this.user = afAuth.authState;

    this.user.subscribe(value => {
      this.userDataList = this.db.list('/tmp');
      this.userDataList.subscribe(users => {
        for (const user of users) {
          let league = this.leagueToUsers[user.leagueId] || [];
          league.push(user);
          this.leagueToUsers[user.leagueId] = league;

          this.leagueToNames[user.leagueId] = user.leagueName;
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
      this.year = params.year || '2017';
      this.loadScoresDb();
    });
  }

  getIterable(val) {
    return Object.keys(val);
  }

  loadScoresDb(): void {
    this.teamToScores = {};
    this.scoresList = this.db.object('/scores/' + this.year + '/');
    this.scoresList.subscribe(scores => {
      console.log(scores);
      this.scores = scores;
      this.updateScores();
    });
  }

  // TODO doing a join by hand feels terrible.
  updateScores(): void {
    this.userRows = {};
    for (const leagueKey in this.leagueToUsers) {
      for (const user of this.leagueToUsers[leagueKey]) {
        let userTotal = 0;
        for (const userWeek of user.weeks) {
          if (this.scores[userWeek.id]) {
            for (let userTeam of userWeek.teams) {
              if (userTeam.selected) {
                if (this.scores[userWeek.id][userTeam.name]) {
                  userTotal += this.scores[userWeek.id][userTeam.name].total;
                } else {
                  console.log("ERROR: couldn't find score")
                }
              }
            }
          }
        }
        const userRow = {
          'name': user.name,
          'total': userTotal,
        };
        let league = this.userRows[leagueKey] || [];
        league.push(userRow);
        this.userRows[leagueKey] = league;
      }
    }
  }
}
