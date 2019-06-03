import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdlModule } from '@angular-mdl/core';

import { SharedModule } from '../shared/shared.module';

import { NflScoreCardComponent } from './nfl-score-card.component';

@NgModule({
  imports: [
    CommonModule,
    MdlModule,
    SharedModule,
  ],
  declarations: [
    NflScoreCardComponent,
  ],
  exports: [
    NflScoreCardComponent,
  ],
})
export class NflScoresModule { }
