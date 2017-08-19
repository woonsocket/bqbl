
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.css']
})
export class LineupComponent {
  userData: FirebaseObjectObservable<any>;
  user: Observable<firebase.User>;
  uid: string;
  displayName: string;
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router) {
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
