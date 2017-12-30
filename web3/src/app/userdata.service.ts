import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as paths from './paths';
import { ConstantsService } from './constants.service';
import { ScoreService, LeagueScore } from './score.service';
import { TeamScore } from './team-score';
import { TeamSpec } from './structs';


@Injectable()
export class UserDataService {
  user: Observable<firebase.User>;

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private constants: ConstantsService) {
    this.user = afAuth.authState;
  }

  /**
   * Returns an Observable of a stream of an array of teams.
   */
  getTeams(): Observable<TeamSpec[]> {
    return this.user
      .map(user => {
        return this.db.object(paths.getUserPath(user.uid))})
      .map(userData => {
        let teams = [];
        if(userData['probowl']) {
          teams = userData['probowl'].teams;
        } else {
          teams = [{name: "ARI"},{name: "CLE"},{name: "DET"},{name: "HOU"},{name: "PIT"},{name: "SEA"}];
        }
        return teams;
      });
  }
}

