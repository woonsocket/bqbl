
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  user: Observable<firebase.User>;
  weeks = ALL_WEEKS;
  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.user = afAuth.authState;
    this.user.subscribe(value => {
      // if logged in redirect to /
    });
  }

  onClick(val: string) {
    let benchingMap = {};
    for (let team of ALL_TEAMS) {
      benchingMap[team] = false;
    }
    this.db.object('/tmp/2017/' + val + '/benchings').set(benchingMap);
  }
}

let ALL_WEEKS = [
{'name': 'Preseason 1', 'val': 'P1'},
{'name': 'Preseason 2', 'val': 'P2'},
{'name': 'Preseason 3', 'val': 'P3'},
{'name': 'Preseason 4', 'val': 'P4'},
{'name': 'Week 1', 'val': '1'},
{'name': 'Week 2', 'val': '2'},
{'name': 'Week 3', 'val': '3'},
{'name': 'Week 4', 'val': '4'},
{'name': 'Week 5', 'val': '5'},
{'name': 'Week 6', 'val': '6'},
{'name': 'Week 7', 'val': '7'},
{'name': 'Week 8', 'val': '8'},
{'name': 'Week 9', 'val': '9'},
{'name': 'Week 10', 'val': '10'},
{'name': 'Week 11', 'val': '11'},
{'name': 'Week 12', 'val': '12'},
{'name': 'Week 13', 'val': '13'},
{'name': 'Week 14', 'val': '14'},
{'name': 'Week 15', 'val': '15'},
{'name': 'Week 16', 'val': '16'},
{'name': 'Week 17', 'val': '17'},
];

let ALL_TEAMS = ["ARI","ATL","BAL","BUF","CAR","CHI","CIN","CLE","DAL","DEN","DET",
"GB","HOU","IND","JAX","KC","LA","MIA","MIN","NE","NO","NYG","NYJ",
"OAK", "PHI","PIT","SD","SEA","SF","TB","TEN","WSH"];
