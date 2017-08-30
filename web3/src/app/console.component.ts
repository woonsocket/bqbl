
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
  safetyOverrides: object;
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
      this.db.object(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/overrides/safeties`).subscribe((val) => {
        this.safetyOverrides = val;
      });
    })
  }

  onBenchingClick(benching: any) {
    benching.$value = !benching.$value;
    this.db.object(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/benchings/${benching.$key}`)
      .set(benching.$value);
  }

  onSafetyClick(key: string, value: boolean) {
    this.db.object(paths.getEventsPath() + `/${this.year}/${this.selectedWeek}/overrides/safeties/${key}`)
        .set(value);
  }

  tabChanged() {}
}
