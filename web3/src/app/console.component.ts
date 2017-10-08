import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { MdlSnackbarService } from '@angular-mdl/core';
import { Observable } from 'rxjs/Observable';
import { OnInit } from '@angular/core';
import * as paths from './paths';

import { ConstantsService } from './constants.service';

@Component({
  templateUrl: './console.component.html',
  styles: [
    `.empty {
       color: #959595;
       font-style: italic;
       padding: 40px;
       text-align: center;
    }`,
  ],
})
export class ConsoleComponent implements OnInit {
  passers: FirebaseListObservable<any>;
  safeties: FirebaseListObservable<any>;
  overrides: object;
  selectedWeek = 'P1';
  year = '2017';

  constructor(
    private db: AngularFireDatabase,
    private route: ActivatedRoute,
    private constants: ConstantsService,
    private mdlSnackbarService: MdlSnackbarService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || this.constants.getDefaultWeekId();
      this.passers = this.db.list(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/passers`, {
        query: {
          orderByChild: 'team'
        }
      });
      this.safeties = this.db.list(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/safeties`, {
        query: {
          orderByChild: 'team'
        }
      });
      this.db.object(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/overrides`).subscribe((val) => {
        this.overrides = val;
      });
    });
  }

  overrideVal(team: string, eventType: string, id: string) {
    const teamOverrides = this.overrides[team] || {};
    const events = teamOverrides[eventType] || {};
    return events[id] || false;
  }

  onBenchingClick(passer: any, valid: boolean) {
    this.db.object(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/overrides/${passer.team}/benchings/${passer.$key}`)
      .set(valid)
      .catch((err) => this.showError(err));
  }

  onSafetyClick(safety: any, valid: boolean) {
    this.db.object(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/overrides/${safety.team}/safeties/${safety.$key}`)
      .set(valid)
      .catch((err) => this.showError(err));
  }

  showError(err: Error) {
    let msg = `Unknown error: ${err}`;
    if (err['code'] === 'PERMISSION_DENIED') {
      msg = 'Permission denied. Are you an admin?';
    }
    this.mdlSnackbarService.showSnackbar({
      message: msg,
    });
  }
}
