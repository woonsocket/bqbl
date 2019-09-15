import { Component, Input } from '@angular/core';
import { TeamScore } from './team-score';

@Component({
  selector: 'mini-score',
  template: `
    <div class="top">
      <div class="name" title="{{name}}">{{name}}</div>
      <div class="row" *ngFor="let score of scores">
        <img src="{{score.name|nflLogo}}" title="{{score.name}}">
        <score-cell class="score" [value]="score.score"></score-cell>
      </div>
      <div class="row total" *ngIf="showTotal">
        <div>Total</div>
        <score-cell class="score" [value]="totalScore()"></score-cell>
      </div>
    </div>
  `,
  styles: [
    `.top {
       display: inline-flex;
       flex-direction: column;
       width: 65px;
       padding: 4px;
    }`,
    `.name {
       font-size: 16px;
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;
    }`,
    `.row {
       display: inline-flex;
       flex-direction: row;
       align-items: center;
    }`,
    `.total {
       border-top: 1px solid black;
    }`,
    `.score { font-size: 14px; text-align: right; flex-grow: 1; }`,
    `.row img { height: 20px; }`,
  ],
})
export class MiniScoreComponent {
  @Input() name: string;
  @Input() scores: TeamScore[];
  @Input() showTotal: boolean;

  totalScore(): number {
    let sum = 0;
    for (const s of this.scores) {
      sum += s.score;
    }
    return sum;
  }
}
