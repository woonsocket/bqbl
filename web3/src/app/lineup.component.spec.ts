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

import { mockAngularFireAuth } from './mockangularfire';
import { MockAngularFireDb } from './mockangularfire';

import { ConstantsService } from './constants.service';
import { LineupComponent } from './lineup.component';

describe('LineupComponent', () => {

  let comp: LineupComponent;
  let fixture: ComponentFixture<LineupComponent>;
  let selected: DebugElement[];

  beforeEach(() => {


    TestBed.configureTestingModule({
      declarations: [ LineupComponent ], // declare the test component
      providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true },
      { provide: AngularFireAuth, useValue: mockAngularFireAuth },
      { provide: AngularFireDatabase, useClass: MockAngularFireDb },
      { provide: Router, useValue: true },
      { provide: ActivatedRoute, useValue: true },
      { provide: ConstantsService, useValue: true },
      { provide: MdlSnackbarService, useValue: true },
      { provide: APP_BASE_HREF, useValue: '/'},
      ]
    });

    fixture = TestBed.createComponent(LineupComponent);

    comp = fixture.componentInstance;

    selected = fixture.debugElement.queryAll(By.css('.selected'));
  });


  it('should render the played teams', () => {
    fixture.detectChanges();

    expect(selected[0].nativeElement.textContent).toContain("HOU");
    expect(selected[1].nativeElement.textContent).toContain("NYJ");
  });
});
