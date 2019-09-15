import { Component, Input } from '@angular/core';
import { Entry247 } from './entry-247';

@Component({
  selector: 'table-247',
  template: `
    <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
      <tr>
        <th>Team</th>
        <th>Points</th>
        <th>Week</th>
        <th>Link</th>
        <th>Description</th>
      </tr>
      <tr *ngFor="let entry of entries">
        <td class="cell logo">
          <img src="{{entry.team|nflLogo}}" title="{{entry.team}}">
          {{entry.team}}
        </td>
        <td class="cell">{{entry.points}}</td>
        <td class="cell">{{entry.week}}</td>
        <td class="cell"><a href="{{entry.url}}">Link</a></td>
        <td class="desc">{{entry.desc}}</td>
      </tr>
    </table>
  `,
  styles: [
    `.cell {
       white-space: nowrap;
       text-align: center;
       padding: 8px;
    }`,
    `.logo { text-align: left; font-size: 18px; }`,
    `.logo img { height: 30px; }`,
    `.desc {
       flex-grow: 1;
       text-align: left;
       padding: 4px;
    }`,
  ],
})
export class Table247Component {
  @Input() entries: Entry247[];
}
