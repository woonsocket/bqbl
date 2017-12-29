import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, Input } from '@angular/core';
import { LeagueRules } from './schema'
import { MdlSnackbarService } from '@angular-mdl/core';
import { Observable } from 'rxjs/Observable';

import * as paths from './paths';
import { ConstantsService } from './constants.service';
import { ScoreService } from './score.service';
import { TeamScore } from './team-score';
import { User, Week, TeamEntry, League } from './structs';

@Component({
  templateUrl: './probowl.component.html',
  styleUrls: ['./probowl.component.css']
})
export class ProBowlComponent {
  userData: FirebaseObjectObservable<any>;
  userDataSnapshot: any;
  user: Observable<firebase.User>;
  uid: string;
  teams: any[]; 

  leagues: Observable<LeagueScore[]>;
  userToTeams = {};
  year: Observable<string>;


  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private router: Router,
              private mdlSnackbarService: MdlSnackbarService,
              private constants: ConstantsService,
              private scoreService: ScoreService,
              ) {
    this.user = afAuth.authState;
    this.user.subscribe(value => {
      if (!value) {
        return;
      }
      this.userData = this.db.object(paths.getUserPath(value.uid));
      this.userData.subscribe(userData => {
        this.userDataSnapshot = userData;
        if (!userData.$exists()) {
          this.router.navigate(['/newuser']);
        }

        if(this.userDataSnapshot['probowl']) {
          this.teams = this.userDataSnapshot['probowl'].teams;
        } else {
          this.teams = [{name: "ARI"},{name: "CLE"},{name: "DET"},{name: "HOU"},{name: "PIT"},{name: "SEA"}];
        }
      });

      this.uid = value.uid;
    });
  }


  ngOnInit() {
    this.year = Observable.of('2017');

    // TODO: This would probably be bad if we had more than 16 users.
    const userPicks = this.db.list(paths.getUsersPath())
      .map(users => {
        const leagueToUsers = new Map();
        for (const user of users) {
          const league = leagueToUsers.get(user.leagueId) || [];
          league.push(user);
          leagueToUsers.set(user.leagueId, league);

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
        return leagueToUsers;
      });
    const dbLeagues = this.db.list(paths.getLeaguesPath())
      .map((leagues) => {
        const leaguesById = new Map();
        for (const league of leagues) {
          leaguesById.set(league.$key, league);
        }
        return leaguesById;
      });
    this.leagues = Observable
      .combineLatest([this.year, Observable.of('16'), dbLeagues, userPicks])
      .map(([year, week, leagueMap, userMap]) => {
        return this.computeScores(year, week, leagueMap, userMap);
      });
  }

  onChange() {
    console.log("change!")
    this.db
      .object(paths.getUserPath(this.uid) + '/probowl/teams')
      .set(this.teams);
  }

  computeScores(year, week, leaguesById, leagueToUsers): LeagueScore[] {
    const leagues = [];
    for (const leagueKey of Array.from(leaguesById.keys())) {
      const playerScores: Observable<PlayerScore>[] = [];
      for (const user of leagueToUsers.get(leagueKey)) {
        const name = this.userToTeams[user.$key][week].name;
        if (!user.probowl) {
          continue;
        }
        const teams = user.probowl.teams;
        teams[0] = teams[0].name || 'N/A';
        teams[1] = teams[1].name || 'N/A';
        teams[2] = teams[2].name || 'N/A';
        teams[3] = teams[3].name || 'N/A';
        teams[4] = teams[4].name || 'N/A';
        teams[5] = teams[5].name || 'N/A';

        const pScore: Observable<PlayerScore> = Observable
          .combineLatest([
            this.scoreService.scoreTotalFor(week, teams[0]),
            this.scoreService.scoreTotalFor(week, teams[1]),
            this.scoreService.scoreTotalFor(week, teams[2]),
            this.scoreService.scoreTotalFor(week, teams[3]),
            this.scoreService.scoreTotalFor(week, teams[4]),
            this.scoreService.scoreTotalFor(week, teams[5]),
          ])
          .map(([s0, s1, s2, s3, s4, s5]) => {
            return {
              'name': name,
              'scores': [
                {'name': teams[0], 'score': s0},
                {'name': teams[1], 'score': s1},
                {'name': teams[2], 'score': s2},
                {'name': teams[3], 'score': s3},
                {'name': teams[4], 'score': s4},
                {'name': teams[5], 'score': s5},
              ],
            };
          });
        playerScores.push(pScore);
      }
      const league: LeagueScore = {
        name: leaguesById.get(leagueKey).name,
        players: Observable.combineLatest(playerScores),
      };
      leagues.push(league);
    }

    leagues.sort((a, b) => a.name.localeCompare(b.name));
    return leagues;
  }
}

class LeagueScore {
  name: string;
  players: Observable<PlayerScore[]>;
}

class PlayerScore {
  name: string;
  scores: TeamScore[];
}