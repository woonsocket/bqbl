import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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
export class ScoresComponent {
  leagues: Observable<LeagueScore[]>;
  userToTeams = {};
  selectedWeek = 1;
  year = '2017';

  constructor(db: AngularFireDatabase,
              private route: ActivatedRoute,
              private router: Router,
              private constants: ConstantsService,
              private scoreService: ScoreService) {
    // TODO: This would probably be bad if we had more than 16 users.
    const userPicks = db.list(paths.getUsersPath())
      .map(users => {
        const leagueToUsers = {};
        for (const user of users) {
          const league = leagueToUsers[user.leagueId] || [];
          league.push(user);
          leagueToUsers[user.leagueId] = league;

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
    const dbLeagues = db.object(paths.getLeaguesPath());
    this.leagues = Observable.combineLatest([dbLeagues, userPicks])
      .map(([leagueMap, userMap]) => this.computeScores(leagueMap, userMap));
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || this.constants.getDefaultWeekId();
      this.year = params.year || '2017';
    });
  }

  computeScores(leaguesById, leagueToUsers): LeagueScore[] {
    const leagues = [];
    for (const leagueKey of Object.keys(leaguesById)) {
      const playerScores: Observable<PlayerScore>[] = [];
      for (const user of leagueToUsers[leagueKey]) {
        const name = this.userToTeams[user.$key][this.selectedWeek].name;
        const teams = this.userToTeams[user.$key][this.selectedWeek].teams;
        teams[0] = teams[0] || 'N/A';
        teams[1] = teams[1] || 'N/A';

        const pScore: Observable<PlayerScore> = Observable
          .combineLatest([this.getScore(teams[0]), this.getScore(teams[1])])
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
        name: leaguesById[leagueKey].name,
        players: Observable.combineLatest(playerScores),
      };
      leagues.push(league);
    }

    leagues.sort((a, b) => a.name.localeCompare(b.name));
    return leagues;
  }

  getScore(teamName: string): Observable<number> {
    return this.scoreService.scoreFor(this.selectedWeek.toString(), teamName)
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
