import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ScoreService, LeagueScore } from './score.service';

@Component({
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent {
  leagues: Observable<LeagueScore[]>;

  constructor(private scoreService: ScoreService) {}

  ngOnInit() {
    this.leagues = this.scoreService.getLeagues();
  }

}