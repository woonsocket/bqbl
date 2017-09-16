
import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from './constants.service';
import * as paths from './paths';

@Component({
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent {
  userDataList: FirebaseListObservable<any>;
  scoresList: FirebaseListObservable<any>;
  db: AngularFireDatabase;
  user: Observable<firebase.User>;
  leagueToUsers = {};
  leagueToNames = {};
  userToTeams = {};
  teamToScores = {};
  displayLeagues = [];
  selectedWeek: number;
  year = '2017';
  constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth, private route: ActivatedRoute,
              private router: Router, private constants: ConstantsService) {
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
      this.selectedWeek = params.week || this.constants.getDefaultWeek();
      this.year = params.year || '2017';
      this.loadScoresDb();
    });
  }

  getIterable(val) {
    return Object.keys(val);
  }

  loadScoresDb(): void {
    this.teamToScores = {};
    this.scoresList = this.db.list('/scores/' + this.year + '/' + this.selectedWeek);
    this.scoresList.subscribe(scores => {
      for (const score of scores) {
        this.teamToScores[score.$key] = score.total;
      }
      this.teamToScores['N/A'] = 0;
      this.updateScores();
    });
  }

  updateScores(): void {
    this.displayLeagues = [];
    for (const leagueKey in this.leagueToUsers) {
      const league = {'name': '', 'scoreRows': []};

      for (const user of this.leagueToUsers[leagueKey]) {
        const leagueName = user.leagueName;
        const name = this.userToTeams[user.$key][this.selectedWeek].name;
        const teams = this.userToTeams[user.$key][this.selectedWeek].teams;
        teams[0] = teams[0] || 'N/A';
        teams[1] = teams[1] || 'N/A';

        const scoreRow = {
          'name': name,
          'team1': teams[0],
          'score1': this.getScore(teams[0]),
          'team2': teams[1],
          'score2': this.getScore(teams[1]),
        };
        league.name = leagueName;
        league.scoreRows.push(scoreRow);
      }
      this.displayLeagues.push(league);
    }
  }

  getScore(teamName: string): number {
    if (!this.teamToScores[teamName]) {
      return 0;
    }
    return this.teamToScores[teamName];
  }
}
