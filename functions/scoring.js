const entries = require('object.entries');

const SCORE_KEYS = [
  'ATT', 'INT', 'INT6', 'INT6OT', 'FUM6', 'FUM6OT', 'FUML', 'TD', 'PASSYD',
  'SACKYD', 'SACK', 'SAF', 'BENCH', 'FREEAGENT', 'FUM', 'PASSYD', 'CMP', 'LONG',
  'RUSHYD', 'INT6OT'
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

exports.computeScore = function(stats) {
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

  return {
    'total': score['total'],
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
  constructor(pointValue, description) {
    /**
     * @type {number}
     * @const
     */
    this.pointValue = pointValue;

    /**
     * @type {string}
     * @const
     */
    this.description = description;
  }
};

/**
 * @return {{components: !Array<!ScoreComponent>, total: number}}
 */
function computeScoreComponents(qbScore) {
  // Zero out any undefined keys
  SCORE_KEYS.forEach((k) => {
    qbScore[k] = qbScore[k] || 0;
  });
  let pointsList = [
    simpleMultiple(25, qbScore['INT6'] - qbScore['INT6OT'],
                        'INT returned for TD'),
    simpleMultiple(5, qbScore['INT'] - qbScore['INT6'], 'INT'),
    simpleMultiple(25, qbScore['FUM6'], 'fumble lost for TD'),
    simpleMultiple(5, qbScore['FUML'] - qbScore['FUM6'], 'fumble lost'),
    simpleMultiple(2, qbScore['FUM'] - qbScore['FUML'], 'fumble kept'),
    turnoverPoints(qbScore),
    touchdownPoints(qbScore['TD']),
    passingYardPoints(qbScore['PASSYD'] + qbScore['SACKYD']),
    completionRatePoints(qbScore['CMP'], qbScore['ATT']),
    simpleMultiple(1, qbScore['SACK'], 'sacked'),
    simpleMultiple(20, qbScore['SAF'], 'QB at fault for safety'),
    simpleMultiple(35, qbScore['BENCH'], 'QB benched'),
    simpleMultiple(20, qbScore['FREEAGENT'], 'free agent starter')
  ];
  if (qbScore['LONG'] < 25)
    pointsList.push(new ScoreComponent(10, 'no pass of 25+ yards'));
  if (qbScore['RUSHYD'] >= 75)
    pointsList.push(new ScoreComponent(-8, '75+ rushing yards'));
  if (qbScore['INT6OT'])
    pointsList.push(new ScoreComponent(50, 'game-losing pick six in OT'));

  pointsList = pointsList.filter((x) => x.pointValue != 0);
  let total = pointsList.reduce((sum, p) => sum + p.pointValue, 0);
  return {
    'components': pointsList,
    'total': total,
  };
};

function turnoverPoints(qbScore) {
  let totalTurnovers = qbScore['INT'] + qbScore['FUML'];
  let points = 0;
  if (totalTurnovers == 3) points = 10;
  else if (totalTurnovers == 4) points = 20;
  else if (totalTurnovers >= 5) points = 32;
  // 1.5x points for subsequent turnovers.
  for (let to = 6; to <= totalTurnovers; to++) {
    points = points + points / 2;
  }
  return new ScoreComponent(points, totalTurnovers + '-turnover game');
};

function passingYardPoints(yards) {
  let points, rangeString;
  if (yards < 100) { points = 25; rangeString = 'under 100'; }
  else if (yards < 150) { points = 12; rangeString = 'under 150'; }
  else if (yards < 200) { points = 6; rangeString = 'under 200'; }
  else if (yards < 300) { points = 0; rangeString = 'under 300'; }
  else if (yards < 350) { points = -6; rangeString = '300+'; }
  else if (yards < 400) { points = -9; rangeString = '350+'; }
  else { points = -12; rangeString = '400+'; }
  return new ScoreComponent(points, rangeString + ' passing yards');
};

function completionRatePoints(completions, attempts) {
  let completionRate = completions / attempts;
  let points, rangeString;
  if (completionRate < 0.3) { points = 25; rangeString = 'under 30%'; }
  else if (completionRate < 0.4) { points = 15; rangeString = 'under 40%'; }
  else if (completionRate < 0.5) { points = 5; rangeString = 'under 50%'; }
  else { points = 0; rangeString = '50%+'; }
  return new ScoreComponent(points, rangeString + ' completion rate');
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
  return new ScoreComponent(points, tds + '-touchdown game');
};

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
