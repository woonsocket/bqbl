import { Component, Input } from '@angular/core';

@Component({
  selector: 'score-cell',
  template: `
    <div [ngClass]="{'negative': value < 0}">{{value}}</div>
  `,
  styles: [
    `.negative { color: #D32F2F; }`,  // MDL Red 700
  ],
})
export class ScoreCellComponent {
  @Input() value: number;
}
