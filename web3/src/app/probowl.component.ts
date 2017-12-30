import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as paths from './paths';
import { ConstantsService } from './constants.service';
import { ScoreService, LeagueScore } from './score.service';
import { TeamScore } from './team-score';

@Component({
  templateUrl: './probowl.component.html',
  styleUrls: ['./probowl.component.css']
})
export class ProBowlComponent {
  user: Observable<firebase.User>;
  uid: string;
  teams: any[];

  leagues: Observable<LeagueScore[]>;

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private router: Router,
              private constants: ConstantsService,
              private scoreService: ScoreService,
              ) {
    this.user = afAuth.authState;
    this.user.subscribe(value => {
      if (!value) {
        return;
      }
      let userData = this.db.object(paths.getUserPath(value.uid));
      userData.subscribe(userData => {
        if (!userData.$exists()) {
          this.router.navigate(['/newuser']);
        }

        if(userData['probowl']) {
          this.teams = userData['probowl'].teams;
        } else {
          this.teams = [{name: "ARI"},{name: "CLE"},{name: "DET"},{name: "HOU"},{name: "PIT"},{name: "SEA"}];
        }
      });

      this.uid = value.uid;
    });
  }

  ngOnInit() {
    this.leagues = this.scoreService.getLeaguesProBowl();
  }

  onChange() {
    this.db
      .object(paths.getUserPath(this.uid) + '/probowl/teams')
      .set(this.teams);
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
