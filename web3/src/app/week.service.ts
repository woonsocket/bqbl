import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as paths from './paths';
import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { ConstantsService } from './constants.service';


@Injectable()
export class WeekService {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private constants: ConstantsService) {}

  /**
   * Returns an Observable of the currently selected week.
   */
  getWeek(): Observable<any> {
    return this.route.queryParams
      .map((params) => params.week || this.constants.getDefaultWeekId());
  }

  /**
   * Returns an Observable of the currently selected year.
   */
  getYear(): Observable<any> {
    return Observable.of('2017');
  }
}
