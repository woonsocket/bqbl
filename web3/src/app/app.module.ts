import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ScoresComponent } from './scores.component';
import { NFLScoresComponent } from './nflscores.component';
import { NewUserComponent } from './newuser.component';
import { LineupComponent } from './lineup.component';
import { LoginComponent } from './login.component';
import { ConsoleComponent } from './console.component';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { routing } from './app.routes';
import { FormsModule } from '@angular/forms';
import { MdlModule } from '@angular-mdl/core';

@NgModule({
  declarations: [
    AppComponent,
    ScoresComponent,
    NFLScoresComponent,
    NewUserComponent,
    LineupComponent,
    ConsoleComponent,
    ConsoleComponent,
    AdminComponent,
    LoginComponent
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
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
