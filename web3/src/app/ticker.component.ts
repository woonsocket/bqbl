import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Component({
  templateUrl: './ticker.component.html',
})
export class TickerComponent {
  events: Observable<any[]>;
  selectedWeek = '1';
  year = '2017';

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || '1';
      this.events = this.db
        .list(`/eventticker/${this.year}/${this.selectedWeek}`,
              {query: {orderByChild: 'date'}})
        .map((array) => array.slice().reverse());
    });
  }
}
