const entries = require('object.entries');

const SCORE_KEYS = [
  'ATT', 'CMP', 'INT', 'INT6', 'INT6OT', 'FUM', 'FUM6', 'FUM6OT', 'FUML',
  'TD', 'PASSTD', 'PASSYD', 'RUSHYD', 'SACKYD', 'SACK', 'SAF', 'BENCH', 'LONG',
];

/**
 * A score object containing keys from SCORE_KEYS. Represents "average" stats
 * for a QB. Fields that are absent are ignored by the projection.
 */
const STUPID_PROJECTION_TARGET = {
  // These numbers are a little arbitrary. They're approximated from the average
  // stats for all 32 teams in Week 3 of the 2014 season.
  'PASSYD': 250,
  'TD': 1.6,
  'CMP': 22,
  'ATT': 35,
  // This one has the effect of only making the 'No 25+ yard pass' line show up
  // late in the game.
  'LONG': 40,
};

exports.computeScore = function(stats, overrides) {
  stats = Object.assign({}, stats);  // Don't mutate the argument object.
  overrides = overrides || {};
  if (overrides.safeties) {
    const safeties = entries(overrides.safeties)
        .filter(([_, value]) => value)
        .length;
    stats['SAF'] = (stats['SAF'] || 0) + safeties;
  }
  if (overrides.benchings) {
    const benchings = entries(overrides.benchings)
        .filter(([_, value]) => value)
        .length;
    stats['BENCH'] = (stats['BENCH'] || 0) + benchings;
  }

  let score = computeScoreComponents(stats);
  let projScore = computeScoreComponents(computeStupidProjection(stats));
  let lineScore =
      `${stats['CMP']}/${stats['ATT']},
       ${stats['PASSYD']} yd,
       ${stats['TD']} TD,
       ${stats['INT']} INT`;
  let gameInfo = {
    'clock': stats['CLOCK'],
    'id': stats['ID'],
  };
  let gameScore = stats['SCORE'];
  if (gameScore) {
    gameInfo['hName'] = gameScore['HOME'];
    gameInfo['aName'] = gameScore['AWAY'];
    gameInfo['hScore'] = gameScore['HSCORE'];
    gameInfo['aScore'] = gameScore['ASCORE'];
  }

  return {
    'total': score['total'],
    // 'breakdown' is the new way of representing the various parts of the
    // score.
    'breakdown': score['breakdown'],
    // 'components' is the deprecated way of representing the score. It'll get
    // phased out at some point. (Er, I mean... "I have full confidence in
    // components.")
    'components': score['components'],
    'lineScore': lineScore,
    'gameInfo': gameInfo,
    'projection': projScore,
  };
};

/**
 * Makes a naive projection by assuming the QB will play the rest of the game at
 * an average level.
 * @param {!Object<string, *>} stats Quarterback stats.
 * @param {number} elapsedFrac The fraction of regulation time that has
 *     elapsed. Equal to 0 at the start of the game, and 1 during overtime and
 *     when the game is over.
 * @return {!Object<string, *>} Projected stats. The parameter object is not
 *     modified.
 */
function computeStupidProjection(stats) {
  const elapsedFrac = parseElapsedFraction('' + stats['CLOCK']);
  const projected = {};
  entries(stats).forEach(([stat, val]) => {
    projected[stat] = val;
  });
  entries(STUPID_PROJECTION_TARGET).forEach(([stat, val]) => {
    const currentStat = parseInt(stats[stat] || 0, 10);
    projected[stat] = Math.round(currentStat + (1 - elapsedFrac) * val);
  });
  return projected;
};


/**
 * @param {string} gameStatus String describing the game time remaining.
 * @return {number} The fraction of regulation time that has elapsed, between 0
 *     and 1.
 */
function parseElapsedFraction(gameStatus) {
  var timeParts = gameStatus.match(/([^ ]*) - ([1-4])/);
  var quarterNumber;
  var secondsLeftInQuarter;

  if (!timeParts) {
    // May be "End 1st" or "End of 1st". Thanks, ESPN.
    var quarterEnd = gameStatus.match(/End.*([1-4])../);
    if (quarterEnd) {
      quarterNumber = parseInt(quarterEnd[1], 10);
      secondsLeftInQuarter = 0;
    } else if (gameStatus.toLowerCase().indexOf('half') > -1) {
      quarterNumber = 2;
      secondsLeftInQuarter = 0;
    } else if (gameStatus.toLowerCase().indexOf('pregame') > -1) {
      quarterNumber = 1;
      secondsLeftInQuarter = 900;
    } else {
      // Otherwise, it's likely OT or game over.
      return 1;
    }
  } else {
    quarterNumber = timeParts[2];
    var clock = timeParts[1];

    if (clock.indexOf(':') > -1) {
      var clockParts = clock.split(':');
      var minutesLeft = parseInt(clockParts[0], 10);
      var secondsLeft = parseInt(clockParts[1], 10);
      secondsLeftInQuarter = 60 * minutesLeft + secondsLeft;
    } else {
      // If the clock doesn't look like a time, it's probably the word "End".
      secondsLeftInQuarter = 0;
    }
  }

  var secsElapsed = 900 * quarterNumber - secondsLeftInQuarter;
  return secsElapsed / 3600;
};

/**
 * An immutable data object.
 * @constructor
 */
class ScoreComponent {
  constructor(value, desc) {
    /**
     * @type {number}
     * @const
     */
    this.value = value;

    /**
     * @type {string}
     * @const
     */
    this.desc = desc;
  }
};

/**
 * @return {{breakdown: !Object, components: !Array<!ScoreComponent>, total: number}}
 */
function computeScoreComponents(qbScore) {
  // Zero out any undefined keys
  SCORE_KEYS.forEach((k) => {
    qbScore[k] = qbScore[k] || 0;
  });

  const breakdown = {};

  // Turnover points
  const totalTurnovers = qbScore['INT'] + qbScore['FUML'];
  const totalTurnoversForTd = qbScore['INT6'] + qbScore['FUM6'];
  const totalOvertimeLosingTurnovers = qbScore['INT6OT'];

  breakdown['fumbleKept'] = scalar(2, qbScore['FUM'] - qbScore['FUML']);

  // 5 points for a regular turnover, 25 for TD, 50 for OT TD.
  const turnoverBase = (5 * totalTurnovers +
                        20 * totalTurnoversForTd +
                        25 * totalOvertimeLosingTurnovers);
  const turnoverBonus = turnoverPoints(totalTurnovers);
  breakdown['turnover'] = {
    'count': totalTurnovers,
    'value': turnoverBase + turnoverBonus,
    'baseValue': turnoverBase,
    'bonusValue': turnoverBonus,
    'types': {
      'int': qbScore['INT'],
      'int6': qbScore['INT6'],
      'fuml': qbScore['FUML'],
      'fum6': qbScore['FUM6'],
      'ot6': qbScore['INT6OT'],
    },
  };
  const turnoverComponent = new ScoreComponent(
      turnoverPoints(totalTurnovers), `${totalTurnovers}-turnover game`);

  const totalTouchdowns = qbScore['TD'];
  breakdown['touchdown'] = {
    'count': totalTouchdowns,
    'value': touchdownPoints(totalTouchdowns),
  };
  const touchdownComponent = new ScoreComponent(
      touchdownPoints(totalTouchdowns), `${totalTouchdowns}-touchdown game`);

  const netPassingYards = qbScore['PASSYD'] + qbScore['SACKYD'];
  const passingBreakdown = passingYardPoints(netPassingYards);
  breakdown['passingYardage'] = passingBreakdown;
  const {min: pMin, max: pMax} = passingBreakdown['range'];
  const yardageComponent = new ScoreComponent(
    passingBreakdown['value'], `${rangeString(pMin, pMax)} passing yards`);

  const completions = qbScore['CMP'];
  const attempts = qbScore['ATT'];
  const completionBreakdown =
          completionRatePoints(qbScore['CMP'], qbScore['ATT']);
  breakdown['completion'] = completionBreakdown;
  const {min: compMin, max: compMax} = completionBreakdown['range'];
  const compRange = rangeString(compMin + '%', compMax + '%');
  const completionComponent = new ScoreComponent(
      completionBreakdown['value'], `${compRange} completion rate`);

  const sacks = qbScore['SACK'];
  const sackBreakdown = sackPoints(sacks);
  breakdown['sack'] = sackBreakdown;
  const sackComponent = new ScoreComponent(
      sackBreakdown['value'], `${sacks} sacks`);

  breakdown['safety'] = scalar(20, qbScore['SAF']);
  breakdown['bench'] = scalar(35, qbScore['BENCH']);

  const passerStats = [];
  let passerRatingTotalValue = 0;
  const passerRatingComponents = [];
  for (let [_, passer] of entries(qbScore['passers'] || {})) {
    const stats = {
      'cmp': passer['CMP'] || 0,
      'att': passer['ATT'] || 0,
      'yds': passer['PASSYD'] || 0,  // Sack yards don't count against rating.
      'int': passer['INT'] || 0,
      'td': passer['PASSTD'] || 0,
    };
    const {rating, value} = passerRatingPoints(stats);
    passerRatingTotalValue += value;
    passerStats.push({
      'name': passer['NAME'],
      'stats': stats,
      'rating': rating,
      'value': value,
    });
    if (value != 0) {
      passerRatingComponents.push(simpleMultiple(value, 1, 'passer rating'));
    }
  }
  breakdown['passerRating'] = {
    'passers': passerStats,
    'value': passerRatingTotalValue,
  };

  let pointsList = [
    simpleMultiple(25, qbScore['INT6'] - qbScore['INT6OT'],
                        'INT returned for TD'),
    simpleMultiple(5, qbScore['INT'] - qbScore['INT6'], 'INT'),
    simpleMultiple(25, qbScore['FUM6'], 'fumble lost for TD'),
    simpleMultiple(5, qbScore['FUML'] - qbScore['FUM6'], 'fumble lost'),
    simpleMultiple(2, qbScore['FUM'] - qbScore['FUML'], 'fumble kept'),
    turnoverComponent,
    touchdownComponent,
    yardageComponent,
    completionComponent,
    sackComponent,
    simpleMultiple(20, qbScore['SAF'], 'QB at fault for safety'),
    simpleMultiple(35, qbScore['BENCH'], 'QB benched'),
  ];

  pointsList.push(...passerRatingComponents);

  breakdown['longPass'] = {
    'value': qbScore['LONG'] < 25 ? 10 : 0,
    'yards': qbScore['LONG'],
  };
  if (qbScore['LONG'] < 25) {
    pointsList.push(new ScoreComponent(10, 'no pass of 25+ yards'));
  }

  const over75 = qbScore['RUSHYD'] >= 75;
  breakdown['rushingYardage'] = {
    'value': over75 ? -8 : 0,
    'yards': qbScore['RUSHYD'],
    'range': {
      'min': over75 ? 75 : null,
      'max': over75 ? null : 74,
    },
  };
  if (over75) {
    pointsList.push(new ScoreComponent(-8, '75+ rushing yards'));
  }

  if (qbScore['INT6OT']) {
    // Already accounted for in the turnover breakdown above.
    pointsList.push(new ScoreComponent(50, 'game-losing pick six in OT'));
  }

  pointsList = pointsList.filter((x) => x.value != 0);
  let componentTotal = pointsList.reduce((sum, p) => sum + p.value, 0);
  let total = 0;
  for (let key of Object.keys(breakdown)) {
    const entry = breakdown[key];
    if (!entry) {
      continue;
    }
    total += entry['value'] || 0;
  }
  if (total != componentTotal) {
    console.warn(`scoring bug: new ${total} vs old ${componentTotal}`);
  }
  return {
    'breakdown': breakdown,
    'components': pointsList,
    'total': total,
  };
};

function turnoverPoints(totalTurnovers) {
  let points = 0;
  if (totalTurnovers == 3) points = 10;
  else if (totalTurnovers == 4) points = 20;
  else if (totalTurnovers >= 5) points = 32;
  // 1.5x points for subsequent turnovers.
  for (let to = 6; to <= totalTurnovers; to++) {
    points = points + points / 2;
  }
  return points;
};

function passingYardPoints(yards) {
  let points, range;
  if (yards < 100) { points = 25; range = {'min': null, 'max': 99}; }
  else if (yards < 150) { points = 12; range = {'min': 100, 'max': 149}; }
  else if (yards < 200) { points = 6; range = {'min': 150, 'max': 199}; }
  else if (yards < 300) { points = 0; range = {'min': 200, 'max': 299}; }
  else if (yards < 350) { points = -6; range = {'min': 300, 'max': 349}; }
  else if (yards < 400) { points = -9; range = {'min': 350, 'max': 399}; }
  else { points = -12; range = {'min': 400, 'max': null}; }
  return {'range': range, 'value': points, 'yards': yards};
};

function rangeString(min, max) {
  if (min === null) {
    return `≤ ${max}`;
  }
  if (max === null) {
    return `≥ ${min}`;
  }
  return `${min}-${max}`;
}

function completionRatePoints(completions, attempts) {
  let completionRate = completions / attempts;
  let points, range;
  if (completionRate < 0.3) { points = 25; range = {'min': 0, 'max': 30}; }
  else if (completionRate < 0.4) { points = 15; range = {'min': 30, 'max': 40}; }
  else if (completionRate < 0.5) { points = 5; range = {'min': 40, 'max': 50}; }
  else { points = 0; range = {'min': 50, 'max': 100}; }
  return {
    'range': range,
    'value': points,
    'completions': completions,
    'attempts': attempts,
  };
};

function touchdownPoints(tds) {
  let points;
  if (tds == 0) points = 10;
  else if (tds < 3) points = 0;
  else points = -5;
  // Penalty doubled for each TD beyond 3.
  for (let td = 4; td <= tds; td++) {
    points *= 2;
  }
  return points;
}

function sackPoints(sacks) {
  let points = 0;
  for (let i = 1; i <= sacks; i++) {
    points += Math.ceil(i / 2);
  }
  return {'count': sacks, 'value': points};
}

/** Computes NFL passer rating and the corresponding BQBL points. */
function passerRatingPoints({cmp, att, yds, int, td}) {
  if (att == 0) {
    return {'rating': 0, 'value': 0};
  }

  const clamp = (v) => Math.max(Math.min(v, 2.375), 0);

  const compRate = clamp(((cmp / att) - 0.3) * 5);
  const yardage = clamp(((yds / att) - 3) / 4);
  const tdRate = clamp(td / att * 20);
  const intRate = clamp(2.375 - (int / att * 25));
  const unscaledRating = compRate + yardage + tdRate + intRate;

  let value = 0;

  // Minimum 10 pass attempts to be eligible for passer rating points. Even
  // though that means this legendary 8-attempt performance wouldn't count:
  // https://www.pro-football-reference.com/boxscores/201410260nyj.htm
  if (att >= 10) {
    if (unscaledRating == 0) {
      value = 50;
    } else if (unscaledRating >= 9.5) {
      value = -25;
    }
  }
  const rating = unscaledRating * 100 / 6;
  return {'rating': rating, 'value': value};
}

/**
 * Creates a ScoreComponent representing a simple "X points per Y" value.
 * @param {number} pointsPer How many points each Y is worth ("X").
 * @param {number} quantity How many Ys there are.
 * @param {string} description A description of what Y is. Probably should be
 *     for the singular form of Y.
 * @return {!ScoreComponent} A ScoreComponent for the points described.
 */
function simpleMultiple(pointsPer, quantity, description) {
  quantity = quantity || 0;
  if (quantity != 1) {
    description = quantity + 'x ' + description;
  }
  return new ScoreComponent(quantity * pointsPer, description);
};

/**
 * Creates a score breakdown entry representing a simple "X points per Y" value.
 * @param {number} pointsPer How many points each Y is worth ("X").
 * @param {number} quantity How many Ys there are.
 * @return {{count: number, value: number}}
 */
function scalar(pointsPer, quantity) {
  quantity = quantity || 0;
  return {'count': quantity, 'value': quantity * pointsPer};
};
