
import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ConstantsService } from './constants.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userData: FirebaseObjectObservable<any>;
  user: Observable<firebase.User>;
  uid = '';
  displayName = 'Login';
  week = '1';
  allWeeks = [];
  selectedWeek = 'P1';
  year = '2017';
  weekDropdownSuppressPaths = [
    '/newuser', '/admin'
  ];
  suppressWeekDropdown = false;
  constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router, private route: ActivatedRoute, constants: ConstantsService) {
    this.user = afAuth.authState;
    this.allWeeks = constants.getAllWeeks();
    this.user.subscribe(value => {
      if (!value) {
        this.displayName = 'Login';
        this.router.navigate(['/login']);
        return;
      }
      this.displayName = value.displayName;
      this.uid = value.uid;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectedWeek = params.week || '1';
      this.year = params.year || '2017';
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.suppressWeekDropdown = 
          this.weekDropdownSuppressPaths.includes(event.url.trim());
      }
    })
  }

  closeDrawer() {
    const d = document.querySelector('.mdl-layout');
    d['MaterialLayout'].toggleDrawer();
  }

  login() {
    if (this.uid !== '') {
      this.afAuth.auth.signOut();
      this.displayName = 'Login';
      this.uid = '';
    } else {
      this.router.navigate(['/login']);
    }
  }

  onWeekChange() {
    this.router.navigate([], {'queryParams': {'week': this.selectedWeek}});
  }
}
