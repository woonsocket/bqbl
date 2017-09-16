import 'core-js/library';
import * as firebase from 'firebase/app';
import { ActivatedRoute, Params } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { MdlDefaultTableModel } from '@angular-mdl/core';
import { OnInit } from '@angular/core';

import { ConstantsService } from './constants.service';

@Component({
  templateUrl: './nflstandings.component.html',
})
export class NFLStandingsComponent implements OnInit {
  year = '2017';
  scoreTable: any;

  // TODO(aerion): Add types to these.
  scoresByTeam = {};
  scores247ByTeam = {};

  constructor(private db: AngularFireDatabase,
              private constants: ConstantsService) {}

  ngOnInit() {
    this.db.list(`/scores/${this.year}`).subscribe((d) => {
      const scores = {};
      d.forEach((week) => {
        const weekNum = week.$key;
        if (weekNum.startsWith('P')) {
          return;
        }
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
    this.db.list(`/scores247/${this.year}`).subscribe((d) => {
      const scores = {};
      d.forEach((entry) => {
        const name = entry['team'];
        if (!(name in scores)) {
          scores[name] = 0;
        }
        scores[name] += (entry['points'] || 0);
      });
      this.scores247ByTeam = scores;
      this.computeScores();
    });

    const columns = [
      {key: 'team', name: 'Team', sortable: true},
      {key: 'total', name: 'Total', sortable: true, numeric: true},
      {key: '24x7', name: '24/7', sortable: true, numeric: true},
    ];
    for (let i = 1; i <= 16; i++) {
      columns.push({key: `${i}`, name: `${i}`, sortable: true, numeric: true});
    }
    this.scoreTable = new MdlDefaultTableModel(columns);
  }

  computeScores() {
    const scores = {};
    this.constants.getAllTeams().forEach((team) => {
      const teamScores = this.scoresByTeam[team] || {};
      const pts247 = this.scores247ByTeam[team] || 0;
      let total = pts247;
      scores[team] = {
        'team': team,
        '24x7': pts247,
      };
      Object.entries(teamScores).forEach(([weekNum, points]) => {
        scores[team][weekNum] = points;
        total += points;
      });
      scores[team]['total'] = total;
    });
    const sorted = Object.values(scores);
    sorted.sort((a, b) => a['team'].localeCompare(b['team']));
    this.scoreTable.data = sorted;
  }
}