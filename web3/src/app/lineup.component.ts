
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
  userDataSnapshot: any;
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
        this.userDataSnapshot = userData;
        if (!userData.$exists()) {
          this.router.navigate(['/newuser']);
        }
      });

      this.uid = value.uid;
    });

  }

  isLegalAddForWeek (week: Week): boolean {
    let selectedTeams = 0;
    for (const teamNum in week.teams) {
      if (week.teams[teamNum].selected) {
        selectedTeams++;
      }
    }
    const legalAdd = selectedTeams < 2;

    if (!legalAdd) {
      let snackbarContainer : any = document.querySelector('#error-toast');
      let data = {message: 'You can only select two teams per week'};
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }

    return selectedTeams < 2;
  }

  isLegalMaxTeams (team: Team): boolean {
    let plays = 0
    for (let week of this.userDataSnapshot.weeks) {
      for (let dbTeam of week.teams) {
        if (dbTeam.name == team.name && dbTeam.selected) {
          plays++;
        }
      }
    }
    return plays < 13;
  }

  onSelect(week: Week, team: Team, weekId: string): void {
    if (!team.selected && !this.isLegalAddForWeek(week)) {
      return;
    }

    if (!team.selected && !this.isLegalMaxTeams(team)) {
      let snackbarContainer : any = document.querySelector('#error-toast');
      let data = {message: 'Max 13 plays per year'};
      snackbarContainer.MaterialSnackbar.showSnackbar(data);
      return;
    }
    team.selected = !team.selected;
    this.db.object('/tmp/' + this.uid + '/weeks/' + weekId + '/teams').set(week.teams);
  }

  onChange(event, week, weekId) {
    if (event.srcElement.value) {
      if (!this.isLegalAddForWeek(week)) {
        event.srcElement.value = '';
        return;
      }
      this.pushTeamFromInput(event.srcElement, week.teams);
      console.log(week);
    } else {
      let dh1 = event.srcElement.parentElement.parentElement.querySelector('.dh1 input');
      let dh2 = event.srcElement.parentElement.parentElement.querySelector('.dh2 input');
      week.teams = week.teams.splice(0,4);
      if (dh1.value != '') {
        this.pushTeamFromInput(dh1, week.teams);
      }
      if (dh2.value != '') {
        this.pushTeamFromInput(dh2, week.teams);
      }
    }
    console.log(week);
    this.db.object('/tmp/' + this.uid + '/weeks/' + weekId + '/teams').set(week.teams);
  }

  pushTeamFromInput(elem, teams) {
      let team = new Team();
      team.name = elem.value;
      team.selected = true;
      teams.push(team);
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
