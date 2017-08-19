
import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
 templateUrl: './nflscores.component.html',
})
export class NFLScoresComponent {
 scores: FirebaseListObservable<any>;

 constructor(db: AngularFireDatabase) {
  this.scores = db.list('/scores/2017/P2', {
   query: {
    orderByChild: 'total'
   }
  });
  this.scores.subscribe(console.log);
 }
}
