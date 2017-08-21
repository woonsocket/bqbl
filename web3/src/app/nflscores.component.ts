import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';


const SORT_ORDERS = {
  'score': (a, b) => b['total'] - a['total'],
  'team': (a, b) => a['$key'].localeCompare(b['$key']),
};


@Component({
  templateUrl: './nflscores.component.html',
  styleUrls: ['./nflscores.component.css'],
})
export class NFLScoresComponent {
  scores = [];
  selectedWeek = 'P1';
  year = '2017';
  sortOrder = 'score';
  projectScores = true;

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || '1';
      let query = this.db.list(`/scores/${this.year}/${this.selectedWeek}`, {
        query: {
          orderByChild: 'total'
        }
      });
      query.subscribe((items) => {
        this.scores = items;
      });
    });
  }

  getScores() {
    if (!this.scores) {
      return [];
    }
    let sorter = SORT_ORDERS[this.sortOrder];
    if (!sorter) {
      return this.scores;
    }
    return this.scores.slice().sort(sorter);
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

  boxScoreLink(scoreObj: object) {
    let gameId = scoreObj['gameInfo'] && scoreObj['gameInfo'].id;
    if (!gameId) {
      return 'http://www.nfl.com';
    }
    let week = this.selectedWeek;
    let nflWeek = week.startsWith('P') ? `PRE${week.slice(1)}` : `REG${week}`;
    // Actually, this component of the path doesn't seem to matter at all, as
    // long as it's non-empty. NFL.com puts the team nicknames in there
    // ('patriots@falcons'), but it appears to be purely for URL aesthetics.
    let atCode = 'score';
    return 'http://www.nfl.com/gamecenter/' +
        `${gameId}/${this.year}/${nflWeek}/${atCode}` +
        '#tab=analyze&analyze=boxscore';
  }
}
