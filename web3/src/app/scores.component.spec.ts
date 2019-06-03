import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { MdlSnackbarService } from '@angular-mdl/core';
import { APP_BASE_HREF } from '@angular/common';
import { MdlModule } from '@angular-mdl/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { NflLogoPipe } from './nfl-logo.pipe';
import { MiniScoreComponent } from './mini-score.component';
import { ScoreCellComponent } from './score-cell.component';
import { MockScoreService, NBQBL_LEAGUE_SCORE } from './mocks';
import { ConstantsService } from './constants.service';
import { ScoresComponent } from './scores.component';
import { ScoreService, LeagueScore, PlayerScore } from './score.service';

describe('ScoresComponent', () => {

  let mockScoreService: MockScoreService;
  let fixture: ComponentFixture<ScoresComponent>;

  beforeEach(() => {
    mockScoreService = new MockScoreService();
    mockScoreService.setLeagues([NBQBL_LEAGUE_SCORE]);
    TestBed.configureTestingModule({
      declarations: [ ScoresComponent, MiniScoreComponent, ScoreCellComponent, NflLogoPipe], // declare the test component
      imports: [ MdlModule, FormsModule ],
      providers: [
      { provide: ComponentFixtureAutoDetect, useValue: true },
      { provide: ScoreService, useValue: mockScoreService },
      { provide: ConstantsService, useValue: new ConstantsService() },
      { provide: APP_BASE_HREF, useValue: '/'},
      ]
    });

  });

  it('should render the scores', () => {
    fixture = TestBed.createComponent(ScoresComponent);
    const teamName = fixture.debugElement.queryAll(
      By.css('mini-score img'));
    const teamScore = fixture.debugElement.queryAll(
      By.css('mini-score score-cell'));
    fixture.detectChanges();
    expect(teamName.length).toEqual(2);
  });

});
