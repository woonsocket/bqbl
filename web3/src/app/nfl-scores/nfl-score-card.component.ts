import { Component, Input } from '@angular/core';

@Component({
  selector: 'nfl-score-card',
  templateUrl: './nfl-score-card.component.html',
  styleUrls: ['./nfl-score-card.component.css'],
})
export class NflScoreCardComponent {
  @Input() score: any;
  @Input() year: string;
  @Input() week: string;
  @Input() projectScores: boolean;

  // These seem like needlessly verbose ways of switching to/from projections.
  getTotal(scoreObj: object) {
    return this.projectScores && scoreObj['projection'] ?
        scoreObj['projection']['total'] :
        scoreObj['total'];
  }

  getComponents(scoreObj: object) {
    return this.projectScores && scoreObj['projection'] ?
        scoreObj['projection']['components'] :
        scoreObj['components'];
  }

  // TODO(aerion): Factor this out (probably as an instance method of a
  // forthcoming score object).
  isFinal(scoreObj: object): boolean {
    const clock = scoreObj['gameInfo'] && scoreObj['gameInfo']['clock'];
    return clock && clock.toLowerCase().includes('final');
  }

  boxScoreLink(scoreObj: object) {
    const gameId = scoreObj['gameInfo'] && scoreObj['gameInfo'].id;
    if (!gameId) {
      return 'http://www.nfl.com';
    }
    const week = this.week;
    const nflWeek = week.startsWith('P') ? `PRE${week.slice(1)}` : `REG${week}`;
    // Actually, this component of the path doesn't seem to matter at all, as
    // long as it's non-empty. NFL.com puts the team nicknames in there
    // ('patriots@falcons'), but it appears to be purely for URL aesthetics.
    const atCode = 'score';
    return 'http://www.nfl.com/gamecenter/' +
        `${gameId}/${this.year}/${nflWeek}/${atCode}` +
        '#tab=analyze&analyze=boxscore';
  }

  boxScoreLinkText(scoreObj: object) {
    const {aName, hName, aScore, hScore} = scoreObj['gameInfo'];
    if (!(aName && hName)) {
      return `Box Score`;
    }
    return `${aName} ${aScore} @ ${hName} ${hScore}`;
  }
}
