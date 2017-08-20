
import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './nflscores.component.html',
  styleUrls: ['./nflscores.component.css'],
})
export class NFLScoresComponent {
  scores: FirebaseListObservable<any>;
  selectedWeek = 'P1';
  year = '2017';
  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || '1';
      this.scores = this.db.list(`/scores/${this.year}/${this.selectedWeek}`, {
        query: {
          orderByChild: 'total'
        }
      });
    });
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
