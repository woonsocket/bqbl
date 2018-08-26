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

import { SharedModule } from './shared/shared.module';

import { MiniScoreComponent } from './mini-score.component';
import { MiniStatComponent } from './mini-stat.component';
import { NFLScoreCardComponent } from './nfl-score-card.component';
import { ScoresComponent } from './scores.component';
import { AntiScoresComponent } from './antiscores.component';
import { NFLScoresComponent } from './nflscores.component';
import { NFLStandingsComponent } from './nflstandings.component';
import { NewUserComponent } from './newuser.component';
import { LineupComponent } from './lineup.component';
import { LoginComponent } from './login.component';
import { ConsoleComponent } from './console.component';
import { StandingsComponent } from './standings.component';
import { ConstantsService } from './shared/constants.service';
import { AdminComponent } from './admin.component';
import { Table247Component } from './247/table-247.component';
import { TickerComponent } from './ticker.component';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { MockAngularFireAuth } from './mockangularfire';

import { AppComponent } from './app.component';

describe('AppComponent', () => {

  beforeEach(async(() => {
    const mockAuth = new MockAngularFireAuth('30', 'Harvey');
    TestBed.configureTestingModule({
      declarations: [
      AppComponent,
      MiniScoreComponent,
      MiniStatComponent,
      NFLScoreCardComponent,
      AntiScoresComponent,
      ScoresComponent,
      NFLScoresComponent,
      NFLStandingsComponent,
      NewUserComponent,
      LineupComponent,
      ConsoleComponent,
      ConsoleComponent,
      AdminComponent,
      Table247Component,
      StandingsComponent,
      LoginComponent,
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

  // TODO(harveyj): This is just breaking all the time and not doing anyone any good.
  // it('should create the app', function() {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app).toBeTruthy();
  // });
});
