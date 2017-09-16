import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ActivatedRoute, Router, NavigationEnd, Event, Params} from '@angular/router';
import { MdlSnackbarService } from '@angular-mdl/core';
import { APP_BASE_HREF } from '@angular/common';
import { MdlModule } from '@angular-mdl/core';

import { MockAngularFireDb, MockAngularFireAuth } from './mockangularfire';

import { ConstantsService } from './constants.service';
import { LineupComponent } from './lineup.component';

const USER_ID = '30';
describe('LineupComponent', () => {

  let mockDb: MockAngularFireDb;
  let mockAuth: MockAngularFireAuth;
  let fixture: ComponentFixture<LineupComponent>;
  let selected: DebugElement[];

  beforeEach(() => {

    this.mockDb = new MockAngularFireDb();
    this.mockAuth = new MockAngularFireAuth(USER_ID, 'Harvey');

    TestBed.configureTestingModule({
      declarations: [ LineupComponent ], // declare the test component
      imports: [ MdlModule ],
      providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true },
      { provide: AngularFireAuth, useValue: this.mockAuth },
      { provide: AngularFireDatabase, useValue: this.mockDb },
      { provide: Router, useValue: true },
      { provide: ActivatedRoute, useValue: true },
      { provide: ConstantsService, useValue: new ConstantsService() },
      { provide: MdlSnackbarService, useValue: true },
      { provide: APP_BASE_HREF, useValue: '/'},
      ]
    });

  });


  it('should render the played teams', () => {
    const dbData = emptyData;
    dbData['users'][USER_ID] = harveyjData;
    this.mockDb.data = dbData;

    fixture = TestBed.createComponent(LineupComponent);
    selected = fixture.debugElement.queryAll(By.css('.selected'));
    fixture.detectChanges();

    expect(selected[0].nativeElement.textContent).toContain('HOU');
    expect(selected[1].nativeElement.textContent).toContain('NYJ');
  });

  it ('should update the db', () => {
    const dbData = emptyData;
    dbData['users'][USER_ID] = harveyjData;
    this.mockDb.data = dbData;
    fixture = TestBed.createComponent(LineupComponent);
    selected = fixture.debugElement.queryAll(By.css('.selected'));
    selected[0].nativeElement.click();
    expect(this.mockDb.data['users'][USER_ID]['weeks'][0]['teams'][1].selected).toEqual(false);
  });
});

const emptyData = {
  'users': {},
  'leagues': {},
};

const nbqblSpec = {
  'dh': false,
  'maxPlays': 13
};

const harveyjData = {
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
};
