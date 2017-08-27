
import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './console.component.html',
})
export class ConsoleComponent {
  benchings: FirebaseListObservable<any>;
  safeties: FirebaseListObservable<any>;
  selectedWeek = 'P1';
  year = '2017';

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || 'P1';
      this.benchings = this.db.list(`/tmp2/events/${this.year}/${this.selectedWeek}/benchings`, {
        query: {
          orderByChild: 'total'
        }
      });
      this.safeties = this.db.list(`/events/${this.year}/${this.selectedWeek}/safeties`, {
        query: {
          orderByChild: 'total'
        }
      });

    })
  }

  onBenchingClick(benching: any) {
    benching.$value = !benching.$value;
    this.db.object('/tmp2/events/2017/' + this.selectedWeek + '/benchings/' + benching.$key)
      .set(benching.$value);
  }

  onSafetyClick(safety: any) {
    safety.$value = !safety.$value || true;
    this.db.object('/events/2017/' + this.selectedWeek + '/safeties/' + safety.$key)
      .set(safety.$value);
  }

  tabChanged() {}
}

