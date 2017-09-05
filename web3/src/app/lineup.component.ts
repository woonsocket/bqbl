
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { MdlSnackbarService } from '@angular-mdl/core';

import { ConstantsService } from './constants.service';
import { User, Week, Team } from './structs';
import * as paths from './paths'
import 'rxjs/add/operator/take'

@Component({
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.css']
})
export class LineupComponent {
  userData: FirebaseObjectObservable<any>;
  userDataSnapshot: any;
  leagueRules: LeagueRules;

  user: Observable<firebase.User>;
  uid: string;
  displayName: string;

  warnings: Warnings;

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private router: Router,
              private mdlSnackbarService: MdlSnackbarService,
              private constants: ConstantsService) {
    this.user = afAuth.authState;
    this.user.subscribe(value => {
      if (!value) {
        this.displayName = '';
        return;
      }
      this.userData = this.db.object(paths.getUserPath(value.uid));
      this.userData.subscribe(userData => {
        this.userDataSnapshot = userData;
        if (!userData.$exists()) {
          this.router.navigate(['/newuser']);
        }
        this.db.object(paths.getLeaguesPath() + userData.leagueId)
          .take(1)
          .subscribe((league) => {
            this.leagueRules = {
              dh: league.dh,
              maxPlays: league.maxPlays || Number.MAX_SAFE_INTEGER,
            };
            this.setWarnings();
          });
      });

      this.uid = value.uid;
    });

    this.warnings = {overMax: []};
  }

  isLegalAddForWeek(week: Week): boolean {
    let selectedTeams = 0;
    for (const teamNum in week.teams) {
      if (week.teams[teamNum].selected) {
        selectedTeams++;
      }
    }

    const legalAdd = selectedTeams < 2;
    if (!legalAdd) {
      this.mdlSnackbarService.showSnackbar({
        message:'You can only select two teams per week',
      });
    }

    return selectedTeams < 2;
  }

  setWarnings(): void {
    let warnings = {
      overMax: [],
    };
    let teamCounts = new Map();
    for (let week of this.userDataSnapshot.weeks) {
      for (let team of week.teams) {
        if (team.selected) {
          teamCounts.set(team.name, (teamCounts.get(team.name) || 0) + 1);
        }
      }
    }
    teamCounts.forEach((count, team) => {
      if (count > this.leagueRules.maxPlays) {
        warnings.overMax.push(team);
      }
    });
    this.warnings = warnings;
  }

  onSelect(week: Week, team: Team, weekId: string): void {
    if (!team.selected && !this.isLegalAddForWeek(week)) {
      return;
    }
    team.selected = !team.selected;
    this.db.object(paths.getUserPath(this.uid) + '/weeks/' + weekId + '/teams').set(week.teams);
    this.setWarnings();
  }

  onChange(event, week, weekId) {
    if (event.srcElement.value) {
      if (!this.isLegalAddForWeek(week)) {
        event.srcElement.value = '';
        return;
      }
      try {
        this.pushTeamFromInput(event.srcElement, week.teams);
      } catch (err) {
        this.mdlSnackbarService.showSnackbar({message: err});
        event.srcElement.value = '';
      }
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
    this.db.object(paths.getUserPath(this.uid) + '/weeks/' + weekId + '/teams').set(week.teams);
  }

  pushTeamFromInput(elem, teams) {
    let team = new Team();
    const name = elem.value.toUpperCase();
    if (!this.constants.getAllTeams().has(name)) {
      throw new Error(`${name} is not a valid team code`);
    }
    team.name = name;
    team.selected = true;
    teams.push(team);
  }

}

interface Warnings {
  overMax: string[],
}

interface LeagueRules {
  dh: boolean,
  maxPlays: number,
}
