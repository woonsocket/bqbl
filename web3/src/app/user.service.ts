import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as paths from './paths'

@Injectable()
export class UserService {

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth) {}

}
