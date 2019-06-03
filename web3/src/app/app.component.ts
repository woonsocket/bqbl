import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { OnInit } from '@angular/core';

import { ConstantsService } from './constants.service';
import { WeekService } from './week.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userData: FirebaseObjectObservable<any>;
  user: Observable<firebase.User>;
  uid = '';
  displayName = 'Login';
  selectedWeek = '1';
  weekDropdownSuppressPaths = [
  '/newuser', '/admin', '/lineup', '/standings', '/nflstandings'
  ];
  suppressWeekDropdown = false;
  allWeeks: any;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private route: ActivatedRoute,
    private constants: ConstantsService,
    private weekService: WeekService) {
    this.user = afAuth.authState;
    this.user.subscribe(value => {
      this.displayName = value.displayName;
      this.uid = value.uid;
    });
    this.allWeeks = constants.getAllWeeks();
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.suppressWeekDropdown = false;
        for (var i = 0; i < this.weekDropdownSuppressPaths.length; i++) {
          if (event.url.trim().includes(this.weekDropdownSuppressPaths[i])) {
            this.suppressWeekDropdown = true;
          }
        }
      }
    });
  }

  closeDrawer() {
    const d: any = document.querySelector('.mdl-layout');
    if (window.innerWidth < 1024) {
      d['MaterialLayout'].toggleDrawer();
    }
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
    this.router.navigate([], {'queryParams': {'week': this.selectedWeek, 'year': this.route.snapshot.queryParams['year']}});
  }
}
