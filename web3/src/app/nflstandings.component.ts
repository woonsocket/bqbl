import 'core-js/library';
import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { MdlDefaultTableModel } from '@angular-mdl/core';

@Component({
  templateUrl: './nflstandings.component.html',
})
export class NFLStandingsComponent {
  year = '2017';
  scoreTable: any;

  // TODO(aerion): Add types to these.
  scoresByTeam = {};
  scores247ByTeam = {};

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.object(`/scores/${this.year}`).subscribe((d) => {
      let scores = {};
      Object.entries(d).forEach(([weekNum, week]) => {
        Object.entries(week).forEach(([name, score]) => {
          if (!(name in scores)) {
            scores[name] = {};
          }
          scores[name][`${weekNum}`] = score.total;
        });
      });
      this.scoresByTeam = scores;
      this.computeScores();
    });
    this.db.object(`/scores247/${this.year}`).subscribe((d) => {
      let scores = {};
      Object.values(d).forEach((entry) => {
        const name = entry['team'];
        if (!(name in scores)) {
          scores[name] = 0;
        }
        scores[name] += (entry['points'] || 0);
      });
      this.scores247ByTeam = scores;
      this.computeScores();
    });

    let columns = [
      {key: 'team', name: 'Team', sortable: true},
      {key: 'total', name: 'Total', sortable: true, numeric: true},
      {key: '24x7', name: '24/7', sortable: true, numeric: true},
    ];
    for (let i = 0; i <= 4; i++) {
      columns.push(
        {key: `P${i}`, name: `P${i}`, sortable: true, numeric: true});
    }
    for (let i = 1; i <= 16; i++) {
      columns.push({key: `${i}`, name: `${i}`, sortable: true, numeric: true});
    }
    this.scoreTable = new MdlDefaultTableModel(columns);
  }

  computeScores() {
    let scores = {};
    Object.entries(this.scoresByTeam).forEach(([name, weekScores]) => {
      let pts247 = this.scores247ByTeam[name] || 0;
      let total = pts247;
      scores[name] = {
        'team': name,
        '24x7': pts247,
      };
      Object.entries(weekScores).forEach(([weekNum, points]) => {
        scores[name][weekNum] = points;
        total += points;
      });
      scores[name]['total'] = total;
    });
    let sorted = Object.values(scores);
    sorted.sort((a, b) => a['team'].localeCompare(b['team']));
    this.scoreTable.data = sorted;
  }
}
