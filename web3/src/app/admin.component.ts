
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { MdlDefaultTableModel, MdlDialogComponent, MdlSnackbarService, MdlTextFieldComponent } from '@angular-mdl/core';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from './shared/constants.service';

import * as paths from './paths';

@Component({
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  @ViewChild(MdlDialogComponent)
  private dialog: MdlDialogComponent;
  @ViewChild('week')
  private weekField: MdlTextFieldComponent;
  @ViewChild('team')
  private teamField: MdlTextFieldComponent;
  @ViewChild('points')
  private pointsField: MdlTextFieldComponent;
  @ViewChild('desc')
  private descField: MdlTextFieldComponent;
  @ViewChild('url')
  private urlField: MdlTextFieldComponent;

  user: Observable<firebase.User>;
  leagueName = '';   // TODO pull this into subcomponent
  hasDh = false;
  maxPlays = 13;
  // https://stackoverflow.com/questions/38423663/angular2-ngmodel-inside-of-ngfor
  // https://stackoverflow.com/questions/36095496/angular-2-how-to-write-a-for-loop-not-a-foreach-loop
  users = [];

  year = '2017';
  points247: FirebaseListObservable<any>;

  // Value is true if the week is unlocked. All absent values are false (locked).
  unlockedWeeks: FirebaseListObservable<any>;

  createRange(number) {
    const items: number[] = [];
    for (let i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFireDatabase,
              private snackbarService: MdlSnackbarService,
              private constants: ConstantsService) {
    this.user = afAuth.authState;

    // Populate by default for testing iteration.
    this.users = constants.getDummyLeague();

    this.points247 = this.db.list(paths.get247ScoresPath(this.year));

    this.unlockedWeeks = this.db.list(paths.getUnlockedWeeksPath());
  }

  onAdd247() {
    this.points247.push({
      week: this.weekField.value,
      team: this.teamField.value,
      points: this.pointsField.value,
      desc: this.descField.value || '',
      url: this.urlField.value || '',
    });
    this.close247Dialog();
  }

  close247Dialog() {
    this.dialog.close();
    this.teamField.value = '';
    this.pointsField.value = '';
    this.descField.value = '';
    this.urlField.value = '';
  }

  onChange() {
    console.log(this.users);
    return false;
  }

  changeWeek(weekNum: string, unlocked: boolean) {
    // TODO(aerion): Need a better default value when unlocking a
    // week. Especially because we might lock a week accidentally, and
    // re-unlocking it would be annoying.
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const deadline = unlocked ? Date.now() + ONE_DAY : 0;
    this.unlockedWeeks.set(weekNum, deadline)
      .catch(err => {
        this.snackbarService.showSnackbar({
          message: `Write failed. Are you an admin?`,
        });
      });
  }

  isLockedWeek(week: any): boolean {
    return week.$value > Date.now();
  }

  onCreateLeague() {
    this.db.list(paths.getLeaguesPath()).push({
      'name': this.leagueName,
      'users': this.users,
      'dh': this.hasDh,
      'maxPlays': this.maxPlays,
    }).then(
      () => this.snackbarService.showSnackbar({message: 'Created league.'}),
      (err) => this.snackbarService.showSnackbar({message: `Error: ${err}`}));
  }
}
