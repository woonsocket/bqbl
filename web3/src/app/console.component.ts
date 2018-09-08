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

import { ConstantsService } from './shared/constants.service';
import { Time } from './structs';
import { WeekService } from './week.service';

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
  passers: Observable<Array<Passer>>;
  safeties: Observable<Array<Safety>>;
  overrides: object;

  constructor(private readonly db: AngularFireDatabase,
              private readonly constants: ConstantsService,
              private readonly mdlSnackbarService: MdlSnackbarService,
              private readonly weekService: WeekService) {}

  ngOnInit() {
    this.weekService.getTime().subscribe((t: Time) => {
      this.passers = this.db
        .list(paths.getEventsPath(t) + `/passers`, {
          query: {
            orderByChild: 'team'
          }
        })
        .map((dbPassers) => {
          console.log(paths.getEventsPath(t));
          console.log(dbPassers);
          return dbPassers.map(
            (p) => ({id: p.$key, team: p.team, name: p.name, week: t}));
        });
      this.safeties = this.db
        .list(paths.getEventsPath(t) + `/safeties`, {
          query: {
            orderByChild: 'team'
          }
        })
        .map((dbSafeties) => {
          return dbSafeties.map(
            (s) => ({id: s.$key, team: s.team, desc: s.desc, week: t}));
        });
      this.db.object(paths.getEventsPath(t) + `/overrides`).subscribe((val) => {
        this.overrides = val;
      });
    });
  }

  overrideVal(team: string, eventType: string, id: string) {
    const teamOverrides = this.overrides[team] || {};
    const events = teamOverrides[eventType] || {};
    return events[id] || false;
  }

  onBenchingClick(passer: Passer, valid: boolean) {
    this.db.object(paths.getEventsPath(passer.week) +
                   `/overrides/${passer.team}/benchings/${passer.id}`)
      .set(valid)
      .catch((err) => this.showError(err));
  }

  onSafetyClick(safety: Safety, valid: boolean) {
    this.db.object(paths.getEventsPath(safety.week) +
                   `/overrides/${safety.team}/safeties/${safety.id}`)
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

interface Passer {
  /** The Firebase database ID for this event. */
  id: string;
  /** The quarterback's team ID. */
  team: string;
  /** The quarterback's name. */
  name: string;
  /** The week to which this event belongs. */
  week: Time;
}

interface Safety {
  /** The Firebase database ID for this event. */
  id: string;
  /** The quarterback's team ID. */
  team: string;
  /** The description of this play. */
  desc: string;
  /** The week to which this event belongs. */
  week: Time;
}
