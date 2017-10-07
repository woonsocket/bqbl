import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import * as paths from './paths'
import { ConstantsService } from './constants.service';

@Component({
  templateUrl: './nflscores.component.html',
  styleUrls: ['./nflscores.component.css'],
})
export class NFLScoresComponent implements OnInit {
  scores = new Array<any>();
  selectedWeek = 'P1';
  year = '2017';
  sortOrder = 'score';
  projectScores = true;

  constructor(private db: AngularFireDatabase,
              private route: ActivatedRoute,
              private constants: ConstantsService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || this.constants.getDefaultWeekId();
      const query = this.db.list(paths.getScoresPath(this.year, this.selectedWeek), {
        query: {
          orderByChild: 'total'
        }
      });
      query.subscribe((items) => {
        this.scores = items;
      });
    });
  }

  byScore(a, b) {
    return this.projectScores ?
        b['projection']['total'] - a['projection']['total'] :
        b['total'] - a['total'];
  }

  byTeamName(a, b) {
    return a['$key'].localeCompare(b['$key']);
  }

  byActiveFirst(a, b) {
    return (this.isFinal(a) ? 1 : 0) - (this.isFinal(b) ? 1 : 0);
  }

  sortScores(scores, cmps) {
    return scores.slice().sort((a, b) => {
      for (const cmp of cmps) {
        const v = cmp.call(this, a, b);
        if (v !== 0) {
          return v;
        }
      }
      return 0;
    });
  }

  getScores() {
    if (!this.scores) {
      return [];
    }
    if (this.sortOrder === 'score') {
      return this.sortScores(this.scores, [this.byScore, this.byTeamName]);
    } else if (this.sortOrder === 'team') {
      return this.sortScores(this.scores, [this.byTeamName]);
    } else if (this.sortOrder === 'active') {
      return this.sortScores(this.scores, [this.byActiveFirst, this.byScore]);
    }
    console.warn(`unknown sort order ${this.sortOrder}`);
    return this.scores;
  }

  // TODO(aerion): Factor this out (probably as an instance method of a
  // forthcoming score object).
  isFinal(scoreObj: object): boolean {
    const clock = scoreObj['gameInfo'] && scoreObj['gameInfo']['clock'];
    return clock && clock.toLowerCase().includes('final');
  }
}
