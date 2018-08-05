import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { User } from './structs';
import { TeamScore } from './team-score';
import { ConstantsService } from './constants.service';
import { WeekService } from './week.service';
import { ScoreService } from './score.service';
import * as paths from './paths';

@Component({
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.css']
})
export class StandingsComponent {
  db: AngularFireDatabase;
  leagueIdToName = new Map<string, string>();
  leagues = new Map<string, Observable<UserEntry[]>>();
  scores247ByTeam: Observable<Map<string, number>>;
  year = '2017';

  constructor(db: AngularFireDatabase,
              private route: ActivatedRoute,
              private router: Router,
              private scoreService: ScoreService,
              private constants: ConstantsService,
              private weekService: WeekService) {
    this.db = db;

    // TODO(aerion): Factor this out from here and nflstandings.
    this.scores247ByTeam = weekService.getYear()
      .map(year => paths.get247ScoresPath(this.year))
      .switchMap(path => this.db.list(path))
      .map((d) => {
        const byTeam = new Map<string, number>();
        d.forEach((entry) => {
          const {team, points = 0} = entry;
          byTeam.set(team, (byTeam.get(team) || 0) + points);
        });
        return byTeam;
      });

    // Take only one value. We expect the user list to be constant over the
    // course of a season, so there's no need to subscribe to changes.
    const userDataList = this.db.list(paths.getUsersPath()).take(1);
    userDataList
      .subscribe((users) => {
        const leagueIdToUsers: Map<string, User[]> = new Map();
        for (const user of users) {
          const league = leagueIdToUsers.get(user.leagueId) || [];
          league.push(user);
          leagueIdToUsers.set(user.leagueId, league);
          // TODO(aerion): This doesn't belong here.
          this.leagueIdToName.set(user.leagueId, user.leagueName);
        }
        const leagues: Map<string, Observable<UserEntry[]>> = new Map();
        leagueIdToUsers.forEach((leagueUsers, leagueId) => {
          leagues.set(
            leagueId,
            sortedByScore(scoresForLeague(scoreService, this.scores247ByTeam,
                                          leagueId, leagueUsers)));
        });
        this.leagues = leagues;
      });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.year = params.year || '2017';
    });
  }

  leagueKeys(): string[] {
    return Array.from(this.leagues.keys());
  }

  getLeague(key: string): Observable<UserEntry[]> {
    return this.leagues.get(key);
  }
}

class WeekEntry {
  name: string;
  scores: TeamScore[];
}

class UserEntry {
  name: string;
  total: number;
  total247: number;
  weeks: WeekEntry[];
}

/**
 * Computes the scores for all users in a league.
 * @return An Observable that emits a new list of UserEntry objects whenever a
 *     user's score changes.
 */
function scoresForLeague(scoreService: ScoreService,
                         scores247ByTeam: Observable<Map<string, number>>,
                         leagueKey: string,
                         users: User[]): Observable<UserEntry[]> {
  const userEntries: Observable<UserEntry>[] = [];
  for (const user of users) {
    const weekEntries: Observable<WeekEntry[]> =
      weeklyScores(scoreService, user);
    const teams247: Observable<TeamScore[]> = scores247(scores247ByTeam, user);
    userEntries.push(
      Observable.combineLatest([weekEntries, teams247])
        .map(([weeks, t247]) => {
          let totalScore = 0;
          for (const week of weeks) {
            for (const s of week.scores) {
              totalScore += s.score;
            }
          }
          let total247 = 0;
          for (const t of t247) {
            total247 += t.score;
            totalScore += t.score;
          }
          return {
            'name': user.name,
            'total': totalScore,
            'total247': total247,
            'weeks': weeks.filter((v) => v.scores.length > 0),
          };
        }));
  }

  return Observable.combineLatest(userEntries);
}

function sortedByScore(users: Observable<UserEntry[]>): Observable<UserEntry[]> {
  return users.map((u) => u.sort((a, b) => b.total - a.total));
}

/**
 * Groups scores for a user by week. If there are no scores for a week (e.g.,
 * because the user hasn't chosen teams for that week, or because none of the
 * chosen teams has played yet), the week is omitted.
 */
function weeklyScores(scoreService: ScoreService,
                      user: User): Observable<WeekEntry[]> {
  const weeks: Observable<WeekEntry>[] = [];
  const userWeeks = user.weeks.slice();
  userWeeks.reverse();
  for (const userWeek of userWeeks) {
    const scoresForWeek: Observable<TeamScore>[] = [];
    for (const userTeam of userWeek.teams) {
      if (userTeam.selected) {
        const score = scoreService.scoreObjectFor(userWeek.id, userTeam.name);
        scoresForWeek.push(score.map((s) => {
          if (!s) {
            return null;
          }
          return {
            name: userTeam.name,
            score: s.total,
          };
        }));
      }
    }
    if (scoresForWeek.length > 0) {
      weeks.push(
        Observable.combineLatest(scoresForWeek)
          .map((arr) => {
            return {
              name: `Week ${userWeek.id}`,
              scores: arr.filter(v => !!v),
            };
          }));
    }
  }
  return Observable.combineLatest(weeks);
}

function scores247(byTeam: Observable<Map<string, number>>,
                   user: User): Observable<TeamScore[]> {
  return byTeam.map((m) => {
    // Ugh, we should store the user's owned teams somewhere better.
    const teams: string[] = user.weeks[0].teams.slice(0, 4).map((t) => t.name);
    return teams.map((name) => {
      return {
        name: name,
        score: m.get(name) || 0,
      };
    });
  });
}
