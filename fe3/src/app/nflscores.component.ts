
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  templateUrl: './nflscores.component.html',
})
export class NFLScoresComponent {
  scores: FirebaseListObservable<any>;
  selectedWeek = 'P1';
  year = '2017';
  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || '1';
      this.scores = this.db.list('/scores/2017/' + this.selectedWeek, {
        query: {
          orderByChild: 'total'
        }
      });
    });
  }
}
