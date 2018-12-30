import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, Input } from '@angular/core';
import { MdlSnackbarService } from '@angular-mdl/core';
import { Observable } from 'rxjs/Observable';

import * as paths from './paths';
import { ConstantsService } from './shared/constants.service';
import { UserDataService } from './userdata.service';
import { ScoreService, LeagueScore } from './score.service';
import { TeamScore } from './team-score';
import { TeamSpec } from './structs';

@Component({
  templateUrl: './probowl.component.html',
  styleUrls: ['./probowl.component.css']
})
export class ProBowlComponent {
  user: Observable<firebase.User>;
  uid: string;
  teams: TeamSpec[];
  isLocked: Observable<boolean>;

  projectScores = true;

  leagues: Observable<LeagueScore[]>;

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private router: Router,
              private constants: ConstantsService,
              private mdlSnackbarService: MdlSnackbarService,
              private scoreService: ScoreService,
              private userDataService: UserDataService,
              ) {
    this.user = afAuth.authState;
    this.user.subscribe(value => this.uid = value.uid);
    this.isLocked = this.db.object(paths.getUnlockedWeeksPath())
      .map((weeks) => {
        const deadline = weeks['probowl'];
        return deadline && deadline < Date.now();
      });
  }

  ngOnInit() {
    this.userDataService.getProBowlTeams().subscribe(teams => this.teams = teams);
    this.updateScores();
  }

  onChange() {
    this.normalizeTeams();
    this.db
      .object(paths.getUserPath(this.uid) + '/probowl/teams')
      .set(this.teams)
      .catch((err) => this.checkLineupWriteError(err));
  }

  updateScores() {
    this.leagues = this.scoreService.getLeaguesProBowl(this.projectScores);
  }

  /** Convert team names to uppercase, and blank out unknown team names. */
  normalizeTeams() {
    // This code should be shared with lineup.component. But really there should
    // be a single "team picker" component that manages all of this.
    for (const team of this.teams) {
      team.name = team.name.toUpperCase();
      if (!this.constants.getAllTeams().has(team.name)) {
        team.name = '';
      }
    }
  }

  checkLineupWriteError(err: Error): void {
    if (err['code'] === 'PERMISSION_DENIED') {
      this.mdlSnackbarService.showSnackbar({
        message: `Picks are locked`,
      });
      return;
    }
    // Propagate unrecognized errors so we see them and can debug them.
    throw err;
  }

  leagueScore(league: LeagueScore): Observable<number> {
    // Assumes the PlayerScore[] values emitted by LeagueScore are sorted in
    // descending order.
    return league.players.map((playerScores) => {
      let sum = 0;
      sum += playerScores[0] ? playerScores[0].totalScore() : 0;
      sum += playerScores[1] ? playerScores[1].totalScore() : 0;
      sum += playerScores[2] ? playerScores[2].totalScore() : 0;
      return sum;
    });
  }

}
