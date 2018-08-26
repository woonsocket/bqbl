import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MiniScoreComponent } from './mini-score.component';
import { MiniStatComponent } from './mini-stat.component';
import { ScoresComponent } from './scores.component';
import { AntiScoresComponent } from './antiscores.component';
import { NFLScoresComponent } from './nflscores.component';
import { ProBowlComponent } from './probowl.component';
import { NFLStandingsComponent } from './nflstandings.component';
import { TickerComponent } from './ticker.component';
import { NewUserComponent } from './newuser.component';
import { LineupComponent } from './lineup.component';
import { LoginComponent } from './login.component';
import { ConsoleComponent } from './console.component';
import { StandingsComponent } from './standings.component';
import { WeekService } from './week.service';
import { ScoreService } from './score.service';
import { AuthGuard } from './auth-guard.service';
import { UserDataService } from './userdata.service';
import { AdminComponent } from './admin.component';
import { Table247Component } from './247/table-247.component';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { routing } from './app.routes';
import { FormsModule } from '@angular/forms';
import { MdlModule } from '@angular-mdl/core';

import { NflScoresModule } from './nfl-scores/nfl-scores.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    MiniScoreComponent,
    MiniStatComponent,
    AntiScoresComponent,
    ScoresComponent,
    NFLScoresComponent,
    NFLStandingsComponent,
    TickerComponent,
    NewUserComponent,
    LineupComponent,
    ConsoleComponent,
    ConsoleComponent,
    AdminComponent,
    Table247Component,
    StandingsComponent,
    LoginComponent,
    ProBowlComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MdlModule,
    routing,
    SharedModule,
    NflScoresModule,
  ],
  providers: [ScoreService, WeekService, UserDataService, AuthGuard],
  bootstrap: [AppComponent]
})

export class AppModule { }
