import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as paths from './paths';
import { ConstantsService } from './constants.service';
import { League, User } from './structs';
import { ScoreService } from './score.service';
import { TeamScore } from './team-score';
import { WeekService } from './week.service';

@Component({
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent {
  leagues: Observable<LeagueScore[]>;
  userToTeams = {};
  year: Observable<string>;

  constructor(private db: AngularFireDatabase,
              private constants: ConstantsService,
              private scoreService: ScoreService,
              private weekService: WeekService) {}

  ngOnInit() {

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
      .combineLatest([this.weekService.getYear(), this.weekService.getWeek(), dbLeagues, userPicks])
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
            this.scoreService.scoreTotalFor(week, teams[0]),
            this.scoreService.scoreTotalFor(week, teams[1]),
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
}

class LeagueScore {
  name: string;
  players: Observable<PlayerScore[]>;
}

class PlayerScore {
  name: string;
  scores: TeamScore[];
}
