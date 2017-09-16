import { TestBed, async } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MdlModule } from '@angular-mdl/core';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { ScoresComponent } from './scores.component';
import { NFLScoresComponent } from './nflscores.component';
import { NFLStandingsComponent } from './nflstandings.component';
import { NewUserComponent } from './newuser.component';
import { LineupComponent } from './lineup.component';
import { LoginComponent } from './login.component';
import { ConsoleComponent } from './console.component';
import { StandingsComponent } from './standings.component';
import { ConstantsService } from './constants.service';
import { AdminComponent } from './admin.component';
import { TickerComponent } from './ticker.component';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { MockAngularFireAuth } from './mockangularfire';
import { NflIconPipe, NflLogoPipe } from './nfl-logo.pipe';

import { AppComponent } from './app.component';

describe('AppComponent', () => {

  beforeEach(async(() => {
    let mockAuth = new MockAngularFireAuth('30', 'Harvey');
    TestBed.configureTestingModule({
      declarations: [
      AppComponent,
      ScoresComponent,
      NFLScoresComponent,
      NFLStandingsComponent,
      NewUserComponent,
      LineupComponent,
      ConsoleComponent,
      ConsoleComponent,
      AdminComponent,
      StandingsComponent,
      LoginComponent,
      NflIconPipe,
      NflLogoPipe,
      TickerComponent,
      ],
      imports: [
      BrowserModule,
      FormsModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFireDatabaseModule,
      MdlModule,
      RouterTestingModule.withRoutes(routes),
      ],
      providers: [ConstantsService, 
      {provide: APP_BASE_HREF, useValue: '/'},
      {provide: AngularFireAuth, useValue: mockAuth }
      ]
    }).compileComponents();
  }));

  it('should create the app', function() {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
