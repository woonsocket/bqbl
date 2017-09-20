import { Component, Input } from '@angular/core';

@Component({
  selector: 'mini-stat',
  template: `
    <div class="top">
      <div class="name" title="{{name}}">{{name}}</div>
      <score-cell class="stat" [value]="value"></score-cell>
    </div>
  `,
  styles: [
    // TODO(aerion): Share this with <mini-score>.
    `.top {
       display: inline-flex;
       flex-direction: column;
       text-align: center;
       min-width: 65px;
       padding: 4px;
     }`,
    `.name {
       font-size: 14px;
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;
       text-transform: uppercase;
     }`,
    `.stat {
       flex: 1;
       font-size: 30px;
       padding: 4px;
     }`,
  ],
})
export class MiniStatComponent {
  @Input() name: string;
  @Input() value: number;
}
