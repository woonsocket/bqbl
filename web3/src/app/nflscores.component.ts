import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { ConstantsService } from './constants.service';

@Component({
  templateUrl: './nflscores.component.html',
  styleUrls: ['./nflscores.component.css'],
})
export class NFLScoresComponent implements OnInit {
  scores = [];
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
      const query = this.db.list(`/scores/${this.year}/${this.selectedWeek}`, {
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

  // These seem like needlessly verbose ways of switching to/from projections.
  getTotal(scoreObj: object) {
    return this.projectScores && scoreObj['projection'] ?
        scoreObj['projection']['total'] :
        scoreObj['total'];
  }

  getComponents(scoreObj: object) {
    return this.projectScores && scoreObj['projection'] ?
        scoreObj['projection']['components'] :
        scoreObj['components'];
  }

  isFinal(scoreObj: object): boolean {
    const clock = scoreObj['gameInfo'] && scoreObj['gameInfo']['clock'];
    return clock && clock.toLowerCase().includes('final');
  }

  boxScoreLink(scoreObj: object) {
    const gameId = scoreObj['gameInfo'] && scoreObj['gameInfo'].id;
    if (!gameId) {
      return 'http://www.nfl.com';
    }
    const week = this.selectedWeek;
    const nflWeek = week.startsWith('P') ? `PRE${week.slice(1)}` : `REG${week}`;
    // Actually, this component of the path doesn't seem to matter at all, as
    // long as it's non-empty. NFL.com puts the team nicknames in there
    // ('patriots@falcons'), but it appears to be purely for URL aesthetics.
    const atCode = 'score';
    return 'http://www.nfl.com/gamecenter/' +
        `${gameId}/${this.year}/${nflWeek}/${atCode}` +
        '#tab=analyze&analyze=boxscore';
  }
}
