import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { ActivatedRoute, Router, NavigationEnd, Params} from '@angular/router';
import { MdlSnackbarService } from '@angular-mdl/core';
import { APP_BASE_HREF } from '@angular/common';
import { MdlModule } from '@angular-mdl/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { MockAngularFireDb, MockAngularFireAuth } from './mockangularfire';
import { DefaultData } from './fakedatabaseresponses'

import { ConstantsService } from './constants.service';
import { ScoresComponent } from './scores.component';

const USER_ID = '30';
describe('ScoresComponent', () => {

  let mockDb: MockAngularFireDb;
  let mockAuth: MockAngularFireAuth;
  let fixture: ComponentFixture<ScoresComponent>;
  let selected: DebugElement[];

  beforeEach(() => {

    this.mockDb = new MockAngularFireDb();
    this.mockAuth = new MockAngularFireAuth(USER_ID, 'Harvey');

    TestBed.configureTestingModule({
      declarations: [ ScoresComponent ], // declare the test component
      imports: [ MdlModule, FormsModule ],
      providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true },
      { provide: AngularFireAuth, useValue: this.mockAuth },
      { provide: AngularFireDatabase, useValue: this.mockDb },
      { provide: Router, useValue: true },
      { provide: ConstantsService, useValue: new ConstantsService() },
      { provide: MdlSnackbarService, useValue: true },
      { provide: APP_BASE_HREF, useValue: '/'},
      { provide: ActivatedRoute, useValue: {
          queryParams: Observable.of({ week: 1 })
        }
      },
      ]
    });

  });

  it('should render the scores', () => {
    this.mockDb.data = new DefaultData().get();
    console.log(this.mockDb.data);

    fixture = TestBed.createComponent(ScoresComponent);
    selected = fixture.debugElement.queryAll(By.css('.selected'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedWeek).toEqual(1);
    console.log(fixture.componentInstance.displayLeagues);
  });

});
