import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewUserComponent } from './newuser.component';
import { LineupComponent } from './lineup.component';
import { ConsoleComponent } from './console.component';
import { ScoresComponent } from './scores.component';
import { NFLScoresComponent } from './nflscores.component';
import { LoginComponent } from './login.component';
import { AppComponent } from './app.component';

// Route Configuration
export const routes: Routes = [
  { path: 'newuser', component: NewUserComponent },
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
  { path: 'login',
  	component: LoginComponent
  },
  { path: 'console',
  	component: ConsoleComponent
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes,
//	    	  { enableTracing: true } // <-- debugging purposes only
);
