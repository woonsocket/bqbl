
import * as firebase from 'firebase/app';
import { ActivatedRoute, Router, NavigationEnd, Event, Params} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

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
  allWeeks = ALL_WEEKS;
  selectedWeek = 'P1';
  year = '2017';
  weekDropdownSuppressPaths = [
    '/newuser', '/admin'
  ];
  suppressWeekDropdown = false;
  constructor(db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router, private route: ActivatedRoute) {
    this.user = afAuth.authState;
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

let ALL_WEEKS = [
{'name': 'Preseason 1', 'val': 'P1'},
{'name': 'Preseason 2', 'val': 'P2'},
{'name': 'Preseason 3', 'val': 'P3'},
{'name': 'Preseason 4', 'val': 'P4'},
{'name': 'Week 1', 'val': '1'},
{'name': 'Week 2', 'val': '2'},
{'name': 'Week 3', 'val': '3'},
{'name': 'Week 4', 'val': '4'},
{'name': 'Week 5', 'val': '5'},
{'name': 'Week 6', 'val': '6'},
{'name': 'Week 7', 'val': '7'},
{'name': 'Week 8', 'val': '8'},
{'name': 'Week 9', 'val': '9'},
{'name': 'Week 10', 'val': '10'},
{'name': 'Week 11', 'val': '11'},
{'name': 'Week 12', 'val': '12'},
{'name': 'Week 13', 'val': '13'},
{'name': 'Week 14', 'val': '14'},
{'name': 'Week 15', 'val': '15'},
{'name': 'Week 16', 'val': '16'},
{'name': 'Week 17', 'val': '17'},
];

