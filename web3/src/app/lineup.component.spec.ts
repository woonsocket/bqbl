import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ActivatedRoute, Router, NavigationEnd, Event, Params} from '@angular/router';
import { MdlSnackbarService } from '@angular-mdl/core';

import { mockAngularFireAuth } from './mockangularfire';
import { mockAngularFireDb } from './mockangularfire';

import { ConstantsService } from './constants.service';
import { LineupComponent } from './lineup.component';

describe('LineupComponent', () => {

  let comp:    LineupComponent;
  let fixture: ComponentFixture<LineupComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;

  beforeEach(() => {


    TestBed.configureTestingModule({
      declarations: [ LineupComponent ], // declare the test component
      providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true },
      { provide: AngularFireAuth, useValue: mockAngularFireAuth },
      { provide: AngularFireDatabase, useValue: mockAngularFireDb },
      { provide: Router, useValue: true },
      { provide: ActivatedRoute, useValue: true },
      { provide: ConstantsService, useValue: true },
      { provide: MdlSnackbarService, useValue: true },
      ]
    });

    fixture = TestBed.createComponent(LineupComponent);

    comp = fixture.componentInstance; // BannerComponent test instance

    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('table'));
    el = de.nativeElement;
  });


  it('should have a header', () => {
    fixture.detectChanges();
    expect(el.querySelector('td.team').textContent).toContain("Team");
  });
});
