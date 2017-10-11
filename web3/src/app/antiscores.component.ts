import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { ConstantsService } from './constants.service';
import { ScoreService } from './score.service';
import { League, User } from './structs';
import { TeamScore } from './team-score';
import * as paths from './paths';

@Component({
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
// TODO(harveyj): ~all of this is forked from scores. Much of it could be decoupled.
export class AntiScoresComponent {
  leagues: Observable<LeagueScore[]>;
  userToTeams = {};
  selectedWeek: Observable<string>;
  year: Observable<string>;

  constructor(private db: AngularFireDatabase,
              private route: ActivatedRoute,
              private router: Router,
              private constants: ConstantsService,
              private scoreService: ScoreService) {}

  ngOnInit() {
    this.selectedWeek = this.route.queryParams
      .map((params) => params.week || this.constants.getDefaultWeekId());
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
              if (!team.selected) {
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
      .combineLatest([this.year, this.selectedWeek, dbLeagues, userPicks])
      .map(([year, week, leagueMap, userMap]) => {
        return this.computeScores(year, week, leagueMap, userMap);
      });
  }

  computeScores(year, week, leaguesById, leagueToUsers): LeagueScore[] {
    const leagues = [];
    for (const leagueKey of Array.from(leaguesById.keys())) {
      const playerScores: Observable<PlayerScore>[] = [];
      for (const user of leagueToUsers.get(leagueKey)) {
        const name = this.userToTeams[user.$key][week].name;
        const teams = this.userToTeams[user.$key][week].teams;
        teams[0] = teams[0] || 'N/A';
        teams[1] = teams[1] || 'N/A';

        const pScore: Observable<PlayerScore> = Observable
          .combineLatest([
            this.getScore(week, teams[0]),
            this.getScore(week, teams[1]),
          ])
          .map(([s0, s1]) => {
            return {
              'name': name,
              'scores': [
                {'name': teams[0], 'score': s0},
                {'name': teams[1], 'score': s1},
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

  getScore(week: string, teamName: string): Observable<number> {
    return this.scoreService.scoreFor(week.toString(), teamName)
      .map((v) => {
        if (!v || !v.total) {
          return 0;
        }
        return v.total;
      });
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
