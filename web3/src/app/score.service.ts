import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ScoreService {
  year = '2017';

  constructor(private db: AngularFireDatabase) {}

  /**
   * Returns an Observable stream of score objects for the given week and
   * team. If the week/team combo does not exist, the Observable emits null.
   */
  scoreFor(week: string, team: string): Observable<any> {
    return this.db.object(`/scores/${this.year}/${week}/${team}`)
      .map(v => v.$exists() ? v : null);
  }
}
