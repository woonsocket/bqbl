import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as paths from './paths'

import { TeamScore } from './team-score';
import { WeekService } from './week.service';

@Injectable()
export class ScoreService {
  year = '2017';
  userToTeams = {};

  constructor(private db: AngularFireDatabase,
              private weekService: WeekService) {}

  /**
   * Returns an Observable stream of score objects for the given week and
   * team. If the week/team combo does not exist, the Observable emits null.
   */
  scoreObjectFor(week: string, team: string): Observable<any> {
    return this.db.object(paths.getScoresPath(this.year, week, team))
      .map(v => v.$exists() ? v : null);
  }

  /**
   * Returns an Observable stream of score total numbers for the given week and
   * team. If the week/team combo does not exist, the Observable emits 0.
   */
  scoreTotalFor(week: string, teamName: string): Observable<number> {
    return this.scoreObjectFor(week.toString(), teamName)
      .map((v) => {
        if (!v || !v.total) {
          return 0;
        }
        return v.total;
      });
  }

  /**
   * Returns an Observable stream of LeagueScore arrays.
   */
  getLeagues(anti?: boolean) : Observable<LeagueScore[]> {
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
              if (anti && !team.selected) {
                activeTeams.push(team.name);
              } else if (!anti && team.selected) {
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

    return Observable
      .combineLatest([this.year, this.weekService.getWeek(), dbLeagues, userPicks])
      .map(([year, week, leagueMap, userMap]) => {
        return this.computeScores(year, week, leagueMap, userMap);
      });
  }

  computeScores(year, week, leaguesById, leagueToUsers): LeagueScore[] {
    const leagues = [];
    for (const leagueKey of Array.from(leaguesById.keys())) {
      const playerScores: Observable<PlayerScore>[] = [];
      for (const user of leagueToUsers.get(leagueKey)) {
        if (!this.userToTeams[user.$key][week]) {
          continue;
        }
        const name = this.userToTeams[user.$key][week].name;
        const teams = this.userToTeams[user.$key][week].teams;
        teams[0] = teams[0] || 'N/A';
        teams[1] = teams[1] || 'N/A';

        const pScore: Observable<PlayerScore> = Observable
          .combineLatest([
            this.scoreTotalFor(week, teams[0]),
            this.scoreTotalFor(week, teams[1]),
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

export class LeagueScore {
  name: string;
  players: Observable<PlayerScore[]>;
}

class PlayerScore {
  name: string;
  scores: TeamScore[];
}

