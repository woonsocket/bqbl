import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ActivatedRoute, Router, NavigationEnd, Event, Params} from '@angular/router';
import { MdlSnackbarService } from '@angular-mdl/core';
import { APP_BASE_HREF } from '@angular/common';

import { MockAngularFireDb, MockAngularFireAuth } from './mockangularfire';

import { ConstantsService } from './constants.service';
import { LineupComponent } from './lineup.component';

describe('LineupComponent', () => {

  let mockDb: MockAngularFireDb;
  let mockAuth: MockAngularFireAuth;
  let fixture: ComponentFixture<LineupComponent>;
  let selected: DebugElement[];

  beforeEach(() => {

    this.mockDb = new MockAngularFireDb();
    this.mockAuth = new MockAngularFireAuth('30', 'Harvey');

    TestBed.configureTestingModule({
      declarations: [ LineupComponent ], // declare the test component
      providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true },
      { provide: AngularFireAuth, useValue: this.mockAuth },
      { provide: AngularFireDatabase, useValue: this.mockDb },
      { provide: Router, useValue: true },
      { provide: ActivatedRoute, useValue: true },
      { provide: ConstantsService, useValue: true },
      { provide: MdlSnackbarService, useValue: true },
      { provide: APP_BASE_HREF, useValue: '/'},
      ]
    });

  });


  it('should render the played teams', () => {
    this.mockDb.data = dbData;

    fixture = TestBed.createComponent(LineupComponent);
    selected = fixture.debugElement.queryAll(By.css('.selected'));
    fixture.detectChanges();

    expect(selected[0].nativeElement.textContent).toContain("HOU");
    expect(selected[1].nativeElement.textContent).toContain("NYJ");
  });
});

let dbData = {
  'users': {
    '30': {
      'leagueId': 'nbqbl',
      'weeks': [{
        'id': '1',
        'teams': [
        {'name': 'CLE', 'selected': false},
        {'name': 'HOU', 'selected': true},
        {'name': 'NYJ', 'selected': true},
        {'name': 'CHI', 'selected': false},
        ]
      }]
    }
  },
  'leagues': {
    'nbqbl': {
      'dh': false,
      'maxPlays': 13
    }
  },
};
