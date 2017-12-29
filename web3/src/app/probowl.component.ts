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
    this.leagues = this.scoreService.getLeaguesProBowl();
  }

  onChange() {
    console.log("change!")
    this.db
      .object(paths.getUserPath(this.uid) + '/probowl/teams')
      .set(this.teams);
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