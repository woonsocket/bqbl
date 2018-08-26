import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstantsService } from './constants.service';

import { NflIconPipe, NflLogoPipe } from './nfl-logo.pipe';
import { ScoreCellComponent } from './score-cell.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NflIconPipe,
    NflLogoPipe,
    ScoreCellComponent,
  ],
  exports: [
    NflIconPipe,
    NflLogoPipe,
    ScoreCellComponent,
  ],
  providers: [
    ConstantsService,
  ],
})
export class SharedModule { }
