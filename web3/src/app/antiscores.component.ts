import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as paths from './paths';
import { ConstantsService } from './constants.service';
import { League, User } from './structs';
import { ScoreService, LeagueScore } from './score.service';
import { TeamScore } from './team-score';
import { WeekService } from './week.service';

@Component({
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class AntiScoresComponent {
  leagues: Observable<LeagueScore[]>;

  constructor(private scoreService: ScoreService) {}

  ngOnInit() {
    this.leagues = this.scoreService.getLeagues(true);
  }

}
