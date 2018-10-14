import { Component, Input } from '@angular/core';

import { Time } from '../structs';

import { ScoreBreakdown, Range } from './breakdown';

@Component({
  selector: 'nfl-score-card',
  templateUrl: './nfl-score-card.component.html',
  styleUrls: ['./nfl-score-card.component.css'],
})
export class NflScoreCardComponent {
  @Input() score: any;
  @Input() time: Time;
  @Input() projectScores: boolean;

  // These seem like needlessly verbose ways of switching to/from projections.
  getTotal() {
    return this.projectScores && this.score['projection'] ?
        this.score['projection']['total'] :
        this.score['total'];
  }

  getComponents() {
    const breakdown = this.getBreakdown();
    if (!breakdown) {
      return [];
    }
    return breakdownToComponents(breakdown);
  }

  getBreakdown(): ScoreBreakdown {
    return this.projectScores && this.score['projection'] ?
        this.score['projection']['breakdown'] :
        this.score['breakdown'];
  }

  getBreakdownEntry(entryName: string) {
    return this.getBreakdown()[entryName];
  }

  // TODO(aerion): Factor this out (probably as an instance method of a
  // forthcoming score object).
  isFinal(): boolean {
    const clock = this.score['gameInfo'] && this.score['gameInfo']['clock'];
    return clock && clock.toLowerCase().includes('final');
  }

  lineScore(): string {
    // Always use the true score, not the projected score.
    const breakdown = this.score['breakdown'];
    if (!breakdown) {
      return 'No stats yet';
    }

    const cmp = breakdown.completion.completions;
    const att = breakdown.completion.attempts;
    // This is net yards (passing yards minus sack yards).
    const yd = breakdown.passingYardage.yards;
    const int = breakdown.turnover.types.int;
    const td = breakdown.touchdown.count;

    return `${cmp}/${att}, ${yd} yd, ${td} TD, ${int} INT`;
  }

  boxScoreLink() {
    const gameId = this.score['gameInfo'] && this.score['gameInfo'].id;
    if (!gameId) {
      return 'http://www.nfl.com';
    }
    const week = this.time.week;
    const nflWeek = week.startsWith('P') ? `PRE${week.slice(1)}` : `REG${week}`;
    // Actually, this component of the path doesn't seem to matter at all, as
    // long as it's non-empty. NFL.com puts the team nicknames in there
    // ('patriots@falcons'), but it appears to be purely for URL aesthetics.
    const atCode = 'score';
    return 'http://www.nfl.com/gamecenter/' +
        `${gameId}/${this.time.year}/${nflWeek}/${atCode}` +
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

/**
 * An entry in the box score. This is something of a bridge between the old UI
 * and future UIs. The old UI expressed the score as a series of ScoreComponents
 * whose values were added to produce the total score. We can develop a more
 * flexible UI, but during the transition period it's easy-ish to transform the
 * score Breakdown into a series of ScoreComponents.
 */
declare interface ScoreComponent {
  /** Human-readable description. */
  desc: string;
  /** Point value. */
  value: number;
}

function breakdownToComponents(breakdown: ScoreBreakdown) {
  const components = [];
  // TODO(aerion): Individual turnover values aren't stored in the breakdown so
  // we have to recompute them here. Re-think this schema.
  components.push(simpleMultiple(
      25, breakdown.turnover.types.int6, 'INT returned for TD'));
  components.push(simpleMultiple(
      5, breakdown.turnover.types.int - breakdown.turnover.types.int6, 'INT'));
  components.push(simpleMultiple(
      25, breakdown.turnover.types.fum6, 'fumble lost for TD'));
  components.push(simpleMultiple(
      5, breakdown.turnover.types.fuml - breakdown.turnover.types.fum6,
      'fumble lost'));
  // An OT turnover-6 is worth 50 points total: 25 for the turnover itself, plus
  // 25 bonus points for being in OT. (But again, ideally this code wouldn't
  // have to make that distinction.)
  components.push(simpleMultiple(
      25, breakdown.turnover.types.ot6, 'turnover-TD in OT'));
  components.push(simpleMultiple(
      2, breakdown.fumbleKept.count, 'fumble kept')),
  components.push({
    desc: `${breakdown.turnover.count}-turnover bonus`,
    value: breakdown.turnover.bonusValue,
  });

  components.push({
    desc: `${breakdown.touchdown.count}-touchdown game`,
    value: breakdown.touchdown.value,
  });

  components.push({
    desc: rangeString(breakdown.passingYardage.range) + ' passing yards',
    value: breakdown.passingYardage.value,
  });
  components.push({
    desc: rangeString(breakdown.completion.range) + '% completion rate',
    value: breakdown.completion.value,
  });
  components.push({
    desc: 'longest pass ' + rangeString(breakdown.longPass.range) + ' yards',
    value: breakdown.longPass.value,
  });
  components.push({
    desc: rangeString(breakdown.rushingYardage.range) + ' rushing yards',
    value: breakdown.rushingYardage.value,
  });

  components.push({
    desc: breakdown.sack.count == 1 ? '1 sack' : `${breakdown.sack.count} sacks`,
    value: breakdown.sack.value,
  });

  components.push({
    desc: `${breakdown.safety.count}x QB at fault for safety`,
    value: breakdown.safety.value,
  });

  components.push({
    desc: `${breakdown.bench.count}x QB benched`,
    value: breakdown.bench.value,
  });

  for (let passer of breakdown.passerRating.passers || []) {
    components.push({
      desc: `${passer.rating.toFixed(1)} passer rating (${passer.name})`,
      value: passer.value,
    });
  }

  return components.filter(c => c.value != 0);
}

/**
 * Creates a ScoreComponent representing a simple "X points per Y" value.
 * @param {number} pointsPer How many points each Y is worth ("X").
 * @param {number} quantity How many Ys there are.
 * @param {string} description A description of what Y is. Probably should be
 *     for the singular form of Y.
 * @return {!ScoreComponent} A ScoreComponent for the points described.
 */
function simpleMultiple(pointsPer, quantity, description): ScoreComponent {
  quantity = quantity || 0;
  if (quantity != 1) {
    description = quantity + 'x ' + description;
  }
  return {desc: description, value: quantity * pointsPer};
}

function rangeString(range: Range) {
  const {min, max} = range;
  if (min === undefined) {
    return `≤ ${max}`;
  }
  if (max === undefined) {
    return `≥ ${min}`;
  }
  return `${min}-${max}`;
}
