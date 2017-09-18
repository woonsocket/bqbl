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

import { NflIconPipe, NflLogoPipe } from './nfl-logo.pipe';
import { ConstantsService } from './constants.service';
import { NFLScoresComponent } from './nflscores.component';

const USER_ID = '30';
describe('NFLScoresComponent', () => {

  let mockDb: MockAngularFireDb;
  let mockAuth: MockAngularFireAuth;
  let fixture: ComponentFixture<NFLScoresComponent>;

  beforeEach(() => {

    this.mockDb = new MockAngularFireDb();
    this.mockAuth = new MockAngularFireAuth(USER_ID, 'Harvey');

    TestBed.configureTestingModule({
      declarations: [ NFLScoresComponent, NflLogoPipe ], // declare the test component
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

  it('should render the projected scores', () => {
    this.mockDb.data = new DefaultData().get();
    fixture = TestBed.createComponent(NFLScoresComponent);
    let scores = fixture.debugElement.queryAll(By.css('.score-card-comp-val'));
    fixture.detectChanges();
    expect(scores.length).toEqual(4);
    expect(scores[0].nativeElement.textContent).toContain("4");
    expect(scores[1].nativeElement.textContent).toContain("3");
    expect(scores[2].nativeElement.textContent).toContain("2");
    expect(scores[3].nativeElement.textContent).toContain("1");
  });

  it('should render the scores', () => {
    this.mockDb.data = new DefaultData().get();
    fixture = TestBed.createComponent(NFLScoresComponent);
    fixture.componentInstance.projectScores = false;
    fixture.detectChanges();
    let scores = fixture.debugElement.queryAll(By.css('.score-card-comp-val'));
    expect(scores.length).toEqual(4);
    expect(scores[0].nativeElement.textContent).toContain("33");
    expect(scores[1].nativeElement.textContent).toContain("32");
    expect(scores[2].nativeElement.textContent).toContain("31");
    expect(scores[3].nativeElement.textContent).toContain("30");
  });
});
