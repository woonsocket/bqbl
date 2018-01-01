import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewUserComponent } from './newuser.component';
import { LineupComponent } from './lineup.component';
import { ConsoleComponent } from './console.component';
import { ScoresComponent } from './scores.component';
import { AntiScoresComponent } from './antiscores.component';
import { NFLScoresComponent } from './nflscores.component';
import { ProBowlComponent } from './probowl.component';
import { NFLStandingsComponent } from './nflstandings.component';
import { TickerComponent } from './ticker.component';
import { LoginComponent } from './login.component';
import { StandingsComponent } from './standings.component';
import { AdminComponent } from './admin.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth-guard.service';

// Route Configuration
export const routes: Routes = [
 {
   path: 'newuser', component: NewUserComponent
 },
 { path: '',
   component: LineupComponent
 },
 { path: 'scores',
   component: ScoresComponent
 },
 { path: 'antiscores',
   component: AntiScoresComponent
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
 {
    path: 'user',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        children: [
         { path: 'lineup',
   component: LineupComponent
 },
 { path: 'probowl',
   component: ProBowlComponent
 },
        ],
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes,
//       { enableTracing: true } // <-- debugging purposes only
);
