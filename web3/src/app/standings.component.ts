import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { ConstantsService } from './constants.service';
import { ScoreService } from './score.service';
import * as paths from './paths';

@Component({
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent {
  userDataList: FirebaseListObservable<any>;
  db: AngularFireDatabase;
  user: Observable<firebase.User>;
  leagueToUsers = {};
  leagueToNames = {};
  userToTeams = {};
  teamToScores = {};
  leagues = {};
  year = '2017';

  constructor(db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private route: ActivatedRoute,
              private router: Router,
              private scoreService: ScoreService,
              private constants: ConstantsService) {
    this.db = db;
    this.user = afAuth.authState;

    this.user.subscribe(value => {
      this.userDataList = this.db.list(paths.getUsersPath());
      this.userDataList.subscribe(users => {
        for (const user of users) {
          const league = this.leagueToUsers[user.leagueId] || [];
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
    this.updateScores();
  }

  // TODO doing a join by hand feels terrible.
  updateScores(): void {
    this.leagues = {};
    for (const leagueKey in this.leagueToUsers) {
      for (const user of this.leagueToUsers[leagueKey]) {
        const allScores: Observable<number>[] = [];
        const weeks: Observable<any>[] = [];
        for (const userWeek of user.weeks) {
          const scoresForWeek = [];
          for (const userTeam of userWeek.teams) {
            if (userTeam.selected) {
              const score =
                this.scoreService.scoreFor(userWeek.id, userTeam.name);
              scoresForWeek.push(score.map((s) => {
                if (!s) {
                  return null;
                }
                return {
                  name: userTeam.name,
                  score: s.total,
                };
              }));
              allScores.push(score.map((s) => s ? s.total : 0));
            }
          }
          if (scoresForWeek.length > 0) {
            weeks.push(
              Observable.combineLatest(scoresForWeek)
                .map((arr) => {
                  return {
                    name: `Week ${userWeek.id}`,
                    scores: arr.filter(v => !!v),
                  }
                }));
          }
        }
        // TODO(aerion): Just make the whole 'leagues' structure async.
        const userRow = {
          'name': user.name,
          'total': Observable.combineLatest(allScores)
            .map((arr) => arr.reduce((a, b) => a + b, 0)),
          'weeks': Observable.combineLatest(weeks)
            .map((arr) => arr.filter((v) => v.scores.length > 0)),
        };
        const league = this.leagues[leagueKey] || [];
        league.push(userRow);
        this.leagues[leagueKey] = league;
      }
    }
  }
}
