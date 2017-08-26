
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css']
})
export class NewUserComponent {
  userData: FirebaseObjectObservable<any>;
  leagues = [];
  db = null;
  user: Observable<firebase.User>;
  uid: string;
  router: Router;
  selectedLeague: any = {};
  selectedUser = [];

  constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth, router: Router) {
    this.db = db;
    this.user = afAuth.authState;
    this.user.subscribe(value => {
      this.userData = this.db.object('/tmp/' + value.uid);
      this.uid = value.uid;
    });

    let leagues = this.db.list('/tmp2/leagues', { preserveSnapshot: true });
    leagues.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        this.leagues.push(snapshot.val());
      })
    });

    this.router = router;
  }

  userAsString(teams) {
    return `${teams[0].name}, ${teams[1].name}, ${teams[2].name}, ${teams[3].name}`;
  }

  onCreate(name: string): void {
    const user = new User();
    user.name = name;
    user.teams = [];
    user.weeks = [];
    user.dh = this.selectedLeague.dh || false;
    for (const weekNum in WEEK_NAMES) {
      const newWeek = new Week();
      newWeek.id = WEEK_NAMES[weekNum];
      newWeek.teams = [];
      for (let team of this.selectedUser) {
        const newTeam = new Team();
        newTeam.name = team.name;
        newTeam.selected = false;
        newWeek.teams.push(newTeam);
      }
      user.weeks[weekNum] = newWeek;
    }
    this.db.object('/tmp/' + this.uid).set(user).then( _ => {
      this.router.navigate(['lineup']);
    });
  }
}

export class User {
  name: string;
  teams: Team[];
  weeks: {};
  dh: boolean;
}
export class Week {
  id: string;
  teams: Team[];
}
export class Team {
  name: string;
  selected: boolean;
}
const WEEK_NAMES: string[] = ['P1', 'P2', 'P3', 'P4', '1', '2', '3', '4', '5', '6',
    '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];


