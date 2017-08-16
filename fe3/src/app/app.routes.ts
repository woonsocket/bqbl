import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewUserComponent } from './newuser.component';
import { LineupComponent } from './lineup.component';
import { ScoresComponent } from './scores.component';
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

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes,
//	    	  { enableTracing: true } // <-- debugging purposes only
);

