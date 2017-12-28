import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MdlSnackbarService } from '@angular-mdl/core';

import { LeagueRules } from './schema'
import { ConstantsService } from './constants.service';
import { User, Week, TeamEntry } from './structs';
import * as paths from './paths';
import 'rxjs/add/operator/take';

@Component({
  templateUrl: './probowl.component.html',
  styleUrls: ['./probowl.component.css']
})
export class ProBowlComponent {
  userData: FirebaseObjectObservable<any>;
  userDataSnapshot: any;
  user: Observable<firebase.User>;
  uid: string;
  displayName: string;
  teams: string[];

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private router: Router,
              private mdlSnackbarService: MdlSnackbarService,
              private constants: ConstantsService) {
    this.user = afAuth.authState;
    this.user.subscribe(value => {
      if (!value) {
        this.displayName = '';
        return;
      }
      this.userData = this.db.object(paths.getUserPath(value.uid));
      this.userData.subscribe(userData => {
        this.userDataSnapshot = userData;
        if (!userData.$exists()) {
          this.router.navigate(['/newuser']);
        }
      });

      this.uid = value.uid;
    });
  }

}