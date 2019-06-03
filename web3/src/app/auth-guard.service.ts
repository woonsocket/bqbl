import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate() : Observable<boolean>{
    return this.afAuth.authState.map(value => {
      if (value != null) {
        return true;
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
