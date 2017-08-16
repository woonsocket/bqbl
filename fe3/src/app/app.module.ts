import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { ScoresComponent } from './scores.component';
import { NewUserComponent } from './newuser.component';
import { LineupComponent } from './lineup.component';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../environments/environment';
import { routing } from './app.routes';

@NgModule({
	declarations: [
		AppComponent,
		ScoresComponent,
		NewUserComponent,
		LineupComponent
	],
	imports: [
		BrowserModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		routing,
	],
	providers: [],
	bootstrap: [AppComponent]
})

export class AppModule { }
