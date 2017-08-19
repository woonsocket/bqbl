
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.css']
})
export class LineupComponent {
  title = 'lineup works!';
  teams = [];
  userData: FirebaseObjectObservable<any>;
  db = null;
  user: Observable<firebase.User>;
  uid: string;
  displayName: string;
  constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router) {
    this.db = db;
    this.user = afAuth.authState;
    this.user.subscribe(value => {
      if (!value) {
        this.displayName = '';
        return;
      }
      this.userData = this.db.object('/tmp/' + value.uid);
      this.userData.subscribe(userData => {
        if (!userData.$exists()) {
          this.router.navigate(['/newuser']);
        }
      });

      this.uid = value.uid;
    });

  }

  isLegalAdd (week: Week): boolean {
    let selectedTeams = 0;
    for (const teamNum in week.teams) {
      if (week.teams[teamNum].selected) {
        selectedTeams++;
      }
    }
    return selectedTeams < 2;
  }

  onSelect(week: Week, team: Team, weekId: string): void {
    if (!team.selected && !this.isLegalAdd(week)) {
      return;
    }
    team.selected = !team.selected;
    this.db.object('/tmp/' + this.uid + '/weeks/' + weekId + '/teams').set(week.teams);
  }

}

export class User {
  name: string;
  teams: Team[];
  weeks: {};
}
export class Week {
  id: string;
  teams: Team[];
}
export class Team {
  name: string;
  selected: boolean;
}
