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
  getTotal() {
    return this.projectScores && this.score['projection'] ?
        this.score['projection']['total'] :
        this.score['total'];
  }

  getComponents() {
    return this.projectScores && this.score['projection'] ?
        this.score['projection']['components'] :
        this.score['components'];
  }

  // TODO(aerion): Factor this out (probably as an instance method of a
  // forthcoming score object).
  isFinal(): boolean {
    const clock = this.score['gameInfo'] && this.score['gameInfo']['clock'];
    return clock && clock.toLowerCase().includes('final');
  }

  boxScoreLink() {
    const gameId = this.score['gameInfo'] && this.score['gameInfo'].id;
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

  boxScoreLinkText() {
    const {aName, hName, aScore, hScore} = this.score['gameInfo'];
    if (!(aName && hName)) {
      return `Box Score`;
    }
    return `${aName} ${aScore} @ ${hName} ${hScore}`;
  }
}
