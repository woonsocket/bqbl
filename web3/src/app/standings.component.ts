import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { User } from './structs'
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
  leagueIdToUsers = new Map<string, User[]>();
  leagueIdToName = new Map<string, string>();
  userToTeams = new Map<string, any>();
  leagues = new Map<string, Array<any>>();
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
        this.leagueIdToUsers = new Map();
        for (const user of users) {
          const league = this.leagueIdToUsers.get(user.leagueId) || [];
          league.push(user);
          this.leagueIdToUsers.set(user.leagueId, league);

          this.leagueIdToName.set(user.leagueId, user.leagueName);
          this.userToTeams.set(user.$key, {});
          for (const week of user.weeks) {
            const activeTeams = [];
            for (const team of week.teams) {
              if (team.selected) {
                activeTeams.push(team.name);
              }
            }
            this.userToTeams.get(user.$key)[week.id] = {
              'name': user.name,
              'teams': activeTeams,
            };
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

  loadScoresDb(): void {
    this.updateScores();
  }

  leagueKeys(): string[] {
    return Array.from(this.leagues.keys());
  }

  // TODO doing a join by hand feels terrible.
  updateScores(): void {
    this.leagues.clear();
    for (const leagueKey of Array.from(this.leagueIdToUsers.keys())) {
      for (const user of this.leagueIdToUsers.get(leagueKey)) {
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
        const league = this.leagues.get(leagueKey) || [];
        league.push(userRow);
        this.leagues.set(leagueKey, league);
      }
    }
  }
}
