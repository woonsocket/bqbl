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

  countSelectedTeams(teams: Team[]): number {
    let selectedTeams = 0;
    teams.forEach((team) => {
      if (team.selected) {
        selectedTeams++;
      }
    });
    return selectedTeams;
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
    team.selected = !team.selected;

    const err = this.validateWeek(week.teams);
    if (err) {
      // Undo and abort.
      team.selected = !team.selected;
      this.mdlSnackbarService.showSnackbar({message: err});
      return;
    }

    this.db.object(paths.getUserPath(this.uid) + '/weeks/' + weekId + '/teams').set(week.teams);
    this.setWarnings();
  }

  onChange(dh1, dh2, week, weekId) {
    const newTeams = week.teams.slice(0,4);
    if (dh1) {
      this.pushTeam(dh1, newTeams);
    }
    if (dh2) {
      this.pushTeam(dh2, newTeams);
    }
    const err = this.validateWeek(newTeams);
    if (err) {
      this.mdlSnackbarService.showSnackbar({message: err});
      return;
    }
    this.db
      .object(paths.getUserPath(this.uid) + '/weeks/' + weekId + '/teams')
      .set(newTeams);
  }

  // Returns an error message as a string. If returned string is empty, the team
  // list is valid.
  validateWeek(teams: Team[]): string {
    if (this.countSelectedTeams(teams) > 2) {
      return 'You can only select two teams per week';
    }
    const usedTeams = new Set();
    for (let team of teams) {
      const name = team.name;
      if (!this.constants.getAllTeams().has(name)) {
        return `${name} is not a valid team name`;
      }
      if (usedTeams.has(name)) {
        return `${name} cannot be used more than once`;
      }
      usedTeams.add(name);
    }
    return '';
  }

  pushTeam(name: string, teams: Team[]) {
    let team = new Team();
    team.name = name.toUpperCase().trim();
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
