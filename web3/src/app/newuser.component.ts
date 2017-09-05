
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { User, Week, Team } from './structs';
import * as paths from './paths'

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
      this.userData = this.db.object(paths.getUserPath(value.uid));
      this.uid = value.uid;
    });

    let leagues = this.db.list(paths.getLeaguesPath(), { preserveSnapshot: true });
    leagues.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
        let val = snapshot.val();
        val.key = snapshot.key;
        this.leagues.push(val);
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
    user.leagueName = this.selectedLeague.name;
    user.leagueId = this.selectedLeague.key;
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
    // Automatically fill teams' selections to a legal state.
    for (let weekKey in user.weeks) {
      let curWeek = user.weeks[weekKey];
      if (WEEKS_AUTOFILL_01.includes(curWeek.id)) {
        curWeek.teams[0].selected = true;
        curWeek.teams[1].selected = true;
      } else {
        curWeek.teams[2].selected = true;
        curWeek.teams[3].selected = true;
      }
    }
    this.db.object(paths.getUserPath(this.uid)).set(user).then( _ => {
      this.router.navigate(['lineup']);
    });
  }
}

const WEEKS_AUTOFILL_01: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
const WEEK_NAMES: string[] = ['1', '2', '3', '4', '5', '6',
    '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
