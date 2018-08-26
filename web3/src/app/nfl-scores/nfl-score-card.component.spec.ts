import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdlModule } from '@angular-mdl/core';

import { SharedModule } from '../shared/shared.module';

import { NflScoreCardComponent } from './nfl-score-card.component';

describe('NflScoreCardComponent', () => {
  let component: NflScoreCardComponent;
  let fixture: ComponentFixture<NflScoreCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NflScoreCardComponent ],
      imports: [ MdlModule, SharedModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NflScoreCardComponent);
    component = fixture.componentInstance;
    component.score = {
      'components': [],
      'gameInfo': {'clock': 'Q1 14:55'},
      'total': 0,
    };
    component.year = '2017';
    component.week = '1';
    component.projectScores = false;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
