import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewUserComponent } from './newuser.component';
import { LineupComponent } from './lineup.component';
import { ConsoleComponent } from './console.component';
import { ScoresComponent } from './scores.component';
import { NFLScoresComponent } from './nflscores.component';
import { NFLStandingsComponent } from './nflstandings.component';
import { TickerComponent } from './ticker.component';
import { LoginComponent } from './login.component';
import { StandingsComponent } from './standings.component';
import { AdminComponent } from './admin.component';
import { AppComponent } from './app.component';

// Route Configuration
export const routes: Routes = [
 {
   path: 'newuser', component: NewUserComponent
 },
 { path: '',
   component: LineupComponent
 },
 { path: 'lineup',
   component: LineupComponent
 },
 { path: 'scores',
   component: ScoresComponent
 },
 { path: 'nflscores',
   component: NFLScoresComponent
 },
 { path: 'nflstandings',
   component: NFLStandingsComponent
 },
 { path: 'ticker',
   component: TickerComponent
 },
 { path: 'login',
   component: LoginComponent
 },
 { path: 'console',
   component: ConsoleComponent
 },
 { path: 'admin',
   component: AdminComponent
 },
 { path: 'standings',
   component: StandingsComponent
 },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes,
//       { enableTracing: true } // <-- debugging purposes only
);
