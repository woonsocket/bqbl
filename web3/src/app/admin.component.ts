
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgModel } from '@angular/forms';
import { ConstantsService } from './constants.service';
import * as paths from './paths'

@Component({
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  user: Observable<firebase.User>;
  weeks = [];
  leagueName = "";   // TODO pull this into subcomponent
  hasDh = false;
  constants: ConstantsService;
  // https://stackoverflow.com/questions/38423663/angular2-ngmodel-inside-of-ngfor
  users = [
  [{'name': ''}, {'name': ''}, {'name': ''}, {'name': ''}], 
  [{'name': ''}, {'name': ''}, {'name': ''}, {'name': ''}], 
  [{'name': ''}, {'name': ''}, {'name': ''}, {'name': ''}], 
  [{'name': ''}, {'name': ''}, {'name': ''}, {'name': ''}], 
  [{'name': ''}, {'name': ''}, {'name': ''}, {'name': ''}], 
  [{'name': ''}, {'name': ''}, {'name': ''}, {'name': ''}], 
  [{'name': ''}, {'name': ''}, {'name': ''}, {'name': ''}], 
  [{'name': ''}, {'name': ''}, {'name': ''}, {'value': ''}], 
  ];


  // https://stackoverflow.com/questions/36095496/angular-2-how-to-write-a-for-loop-not-a-foreach-loop
  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
      items.push(i);
    }
    return items;
  }

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, constants: ConstantsService) {
    this.user = afAuth.authState;

    // Populate by default for testing iteration.
    this.users = constants.getDummyLeague();
    this.weeks = constants.getAllWeeks();
  }

  onClick(val: string) {
    let benchingMap = {};
    for (let team of this.constants.getAllTeams()) {
      benchingMap[team] = false;
    }
    this.db.object(paths.getEventsPath() + '2017/' + val + '/benchings').set(benchingMap);
  }

  onChange() {
    console.log(this.users);
    return false;
  }
  
  onCreateLeague() {
    this.db.list(paths.getLeaguesPath()).push({
      'name': this.leagueName,
      'dh': this.hasDh,
      'users': this.users
    });
  }
}