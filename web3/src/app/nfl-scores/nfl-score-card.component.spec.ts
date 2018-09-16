import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdlModule } from '@angular-mdl/core';

import { SharedModule } from '../shared/shared.module';

import { ScoreBreakdown, BasicEntry, TurnoverEntry, YardageEntry } from './breakdown';
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
    // A blank entry with zeros everywhere. Just barely good enough to satisfy
    // type-checking, but doesn't really test much.
    const fakeBreakdown: ScoreBreakdown = {
      bench: zeroEntry(),
      completion: {
        attempts: 0,
        completions: 0,
        range: {min: 0, max: 0},
        value: 0,
      },
      freeAgent: zeroEntry(),
      fumbleKept: zeroEntry(),
      longPass: zeroYards(),
      passerRating: {passers: [], value: 0},
      passingYardage: zeroYards(),
      rushingYardage: zeroYards(),
      sack: zeroEntry(),
      safety: zeroEntry(),
      touchdown: zeroEntry(),
      turnover: zeroTurnovers(),
    };
    component.score = {
      'breakdown': fakeBreakdown,
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

function zeroEntry(): BasicEntry {
  return {count: 0, value: 0};
}

function zeroTurnovers(): TurnoverEntry {
  return {
    baseValue: 0,
    bonusValue: 0,
    count: 0,
    types: {
      fuml: 0,
      fum6: 0,
      int: 0,
      int6: 0,
      ot6: 0,
    },
    value: 0,
  };
}

function zeroYards(): YardageEntry {
  return {
    yards: 0,
    value: 0,
    range: {min: 0, max: 0},
  };
}
