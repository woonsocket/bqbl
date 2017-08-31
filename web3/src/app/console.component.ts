
import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as paths from './paths'

@Component({
  templateUrl: './console.component.html',
})
export class ConsoleComponent {
  benchings: FirebaseListObservable<any>;
  safeties: FirebaseListObservable<any>;
  overrides: object;
  selectedWeek = 'P1';
  year = '2017';

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || 'P1';
      this.benchings = this.db.list(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/benchings`, {
        query: {
          orderByChild: 'total'
        }
      });
      this.safeties = this.db.list(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/safeties`, {
        query: {
          orderByChild: 'total'
        }
      });
      this.db.object(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/overrides`).subscribe((val) => {
        this.overrides = val;
      });
    })
  }

  overrideVal(team: string, eventType: string, id: string) {
    const teamOverrides = this.overrides[team] || {};
    const events = teamOverrides[eventType] || {};
    return events[id] || false;
  }

  onBenchingClick(benching: any) {
    benching.$value = !benching.$value;
    this.db.object(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/benchings/${benching.$key}`)
      .set(benching.$value);
  }

  onSafetyClick(safety: any, valid: boolean) {
    this.db.object(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/overrides/${safety.team}/safeties/${safety.$key}`)
        .set(valid);
  }

  tabChanged() {}
}
