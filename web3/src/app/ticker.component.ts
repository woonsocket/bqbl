import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Component } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { ConstantsService } from './shared/constants.service';
import { WeekService } from './week.service';

@Component({
  templateUrl: './ticker.component.html',
  styles: [
    `.mdl-list__item-avatar { background: #fff; }`,
    `.empty {
       color: #959595;
       font-style: italic;
       padding: 40px;
       text-align: center;
    }`,
  ],
})
export class TickerComponent {
  events: Observable<any[]>;

  constructor(private db: AngularFireDatabase,
              private route: ActivatedRoute,
              private constants: ConstantsService,
              private weekService: WeekService) {}

  ngOnInit() {
    this.events =
      this.weekService.getTime()
      .map(time => `/eventticker/${time.year}/${time.week}`)
      .switchMap(path =>
        this.db
          .list(path, {query: {orderByChild: 'date'}})
          .map((array) => array.slice().reverse()));
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
