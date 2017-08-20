
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
  selectedWeek = 'P1';
  year = '2017';

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || 'P1';
      this.benchings = this.db.list(`/tmp/${this.year}/${this.selectedWeek}/benchings`, {
        query: {
          orderByChild: 'total'
        }
      });
    })
  }

  onClick(benching: any) {
    benching.$value = !benching.$value;
    this.db.object('/tmp/2017/' + this.selectedWeek + '/benchings/' + benching.$key)
      .set(benching.$value);
  }
}

