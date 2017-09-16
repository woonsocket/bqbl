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
import { DefaultData } from './fakedatabaseresponses'

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
    this.mockDb.data = new DefaultData().get();
    this.mockDb.data.users[USER_ID].weeks[0].teams[1].selected = true;
    this.mockDb.data.users[USER_ID].weeks[0].teams[2].selected = true; 

    fixture = TestBed.createComponent(LineupComponent);
    selected = fixture.debugElement.queryAll(By.css('.selected'));
    fixture.detectChanges();

    expect(selected[0].nativeElement.textContent).toContain('HOU');
    expect(selected[1].nativeElement.textContent).toContain('NYJ');
  });

  it ('should update the db', () => {
    this.mockDb.data = new DefaultData().get();
    this.mockDb.data.users[USER_ID].weeks[0].teams[0].selected = true;
    fixture = TestBed.createComponent(LineupComponent);
    selected = fixture.debugElement.queryAll(By.css('.selected'));
    selected[0].nativeElement.click();
    let newTeamValue = this.mockDb.object(`/users/${USER_ID}/weeks/0/teams/1`).data;
    expect(newTeamValue.selected).toEqual(false);
  });

  it ('should warn after > MAX selects', () => {
    const dbData = new DefaultData().get();
    this.mockDb.data = dbData;
    fixture = TestBed.createComponent(LineupComponent);
    let teams = fixture.debugElement.queryAll(By.css('td.team'));
    // TODO(harveyj): Clean this magic number up.
    teams[4].nativeElement.click();
    teams[8].nativeElement.click();

    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('mdl-icon')).length).toBeGreaterThan(0);
  });

  it ('should prevent three starts in a week', () => {
    const dbData = new DefaultData().get();
    this.mockDb.data = dbData;
    fixture = TestBed.createComponent(LineupComponent);
    let teams = fixture.debugElement.queryAll(By.css('td.team'));
    // TODO(harveyj): Clean this magic number up.
    teams[4].nativeElement.click();
    teams[5].nativeElement.click();
    teams[6].nativeElement.click();
    fixture.detectChanges();
    let selected = fixture.debugElement.queryAll(By.css('.selected'));
    expect(selected.length).toEqual(2);
  });

  it ('should update the counts properly', () => {
    const dbData = new DefaultData().get();
    this.mockDb.data = dbData;
    fixture = TestBed.createComponent(LineupComponent);
    let teams = fixture.debugElement.queryAll(By.css('td.team'));
    // TODO(harveyj): Clean this magic number up.
    teams[4].nativeElement.click();
    teams[8].nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.count')).nativeElement.textContent).toContain('2');
  });

  it ('should show DH when appopriate', () => {
    const dbData = new DefaultData().get();
    this.mockDb.data = dbData;
    this.mockDb.data.leagues['nbqbl'].dh = true;
    fixture = TestBed.createComponent(LineupComponent);
    let dhEntries = fixture.debugElement.queryAll(By.css('input.dh'));
    expect(dhEntries.length).toEqual(4);
  });

  it ('should hide DH when appopriate', () => {
    const dbData = new DefaultData().get();
    this.mockDb.data = dbData;
    this.mockDb.data.leagues['nbqbl'].dh = false;
    fixture = TestBed.createComponent(LineupComponent);
    let dhEntries = fixture.debugElement.queryAll(By.css('input.dh'));
    expect(dhEntries.length).toEqual(0);
  });

  it ('should update db when DH selected', () => {
    // TODO
  });

});


