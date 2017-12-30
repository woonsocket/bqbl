import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import * as paths from './paths'
import { ActivatedRoute, Router, NavigationEnd, Event, Params } from '@angular/router';
import { ConstantsService } from './constants.service';


@Injectable()
export class UserDataService {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private constants: ConstantsService) {}

  /**
   * Returns an Observable of .
   */
  getWeek(): Observable<any> {
    return null;
  }
}
