import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ConstantsService } from './constants.service';

@Component({
  templateUrl: './ticker.component.html',
  styles: ['.mdl-list__item-avatar { background: #fff; }'],
})
export class TickerComponent {
  events: Observable<any[]>;
  selectedWeek = '1';
  year = '2017';

  constructor(private db: AngularFireDatabase,
              private route: ActivatedRoute,
              private constants: ConstantsService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || this.constants.getDefaultWeekId();
      this.events = this.db
        .list(`/eventticker/${this.year}/${this.selectedWeek}`,
              {query: {orderByChild: 'date'}})
        .map((array) => array.slice().reverse());
    });
  }

  eventDescription(ev) {
    let what = '';
    if (ev.type === 'INT') {
      what = 'threw an interception';
    } else if (ev.type === 'INT_TD') {
      what = 'threw a pick-6';
    } else if (ev.type === 'FUML') {
      what = 'lost a fumble';
    } else if (ev.type === 'FUM_TD') {
      what = 'lost a fumble for a TD';
    } else if (ev.type === 'SAF') {
      what = 'gave up a safety';
    }
    return `${ev.name} ${what}`;
  }
}
