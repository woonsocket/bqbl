import { Component, Input } from '@angular/core';
import { TeamScore } from './team-score';

@Component({
  selector: 'mini-score',
  template: `
    <div class="top">
      <div class="name" title="{{name}}">{{name}}</div>
      <div class="team" *ngFor="let score of scores">
        <img src="{{score.name|nflLogo}}" title="{{score.name}}">
        <div class="score">{{score.score}}</div>
      </div>
    </div>
  `,
  styles: [
    `.top {
       display: inline-flex;
       flex-direction: column;
       width: 60px;
       padding: 4px;
    }`,
    `.name {
       font-size: 16px;
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;
    }`,
    `.team {
       display: inline-flex;
       flex-direction: row;
       align-items: center;
    }`,
    `.score { font-size: 14px; text-align: right; flex-grow: 1; }`,
    `.team img { height: 20px; }`,
  ],
})
export class MiniScoreComponent {
  @Input() name: string;
  @Input() scores: TeamScore[];
}
