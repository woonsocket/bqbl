import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ScoresComponent } from './scores.component';
import { AntiScoresComponent } from './antiscores.component';
import { NFLScoresComponent } from './nflscores.component';
import { NFLStandingsComponent } from './nflstandings.component';
import { TickerComponent } from './ticker.component';
import { NewUserComponent } from './newuser.component';
import { LineupComponent } from './lineup.component';
import { LoginComponent } from './login.component';
import { ConsoleComponent } from './console.component';
import { StandingsComponent } from './standings.component';
import { ConstantsService } from './constants.service';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { routing } from './app.routes';
import { FormsModule } from '@angular/forms';
import { MdlModule } from '@angular-mdl/core';

import { NflIconPipe, NflLogoPipe } from './nfl-logo.pipe';

@NgModule({
  declarations: [
    AppComponent,
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
    StandingsComponent,
    LoginComponent,
    NflIconPipe,
    NflLogoPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MdlModule,
    routing,
  ],
  providers: [ConstantsService],
  bootstrap: [AppComponent]
})

export class AppModule { }
