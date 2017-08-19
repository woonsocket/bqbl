// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.score = functions.database.ref('/stats/{year}/{week}/{team}')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      const original = event.data.val();
      console.log('Scoring', event.params.team, original);
      var components = bqbl.computeScoreComponents(event.data.val());
      var score = 0;
      for (var i = 0; i < components.length; i++) {
        score += components[i].pointValue;
      }

      return event.data.ref.child('score').set(score);
    });


bqbl = {};

/**
 * An immutable data object.
 * @constructor
 */
ScoreComponent = function(pointValue, description) {
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
};

/**
 * @return {!Array.<!ScoreComponent>} A list of ScoreComponents.
 */
bqbl.computeScoreComponents = function(qbScore) {
  keys = ['ATT', 'INT', 'INT6', 'INT6OT', 'FUM6', 'FUM6OT', 'FUML', 'TD', 'PASSYD', 'SACKYD', 'SACK', 'SAF',
   'BENCH', 'FREEAGENT', 'FUM', 'PASSYD', 'CMP', 'LONG', 'RUSHYD', 'INT6OT']
  // Zero out any undefined keys
  for (var i = 0; i < keys.length; i++) {
    qbScore[keys[i]] = qbScore[keys[i]] || 0;
  }
  var pointsList = [
    bqbl.simpleMultiple(25, qbScore['INT6'] - qbScore['INT6OT'],
                        'INT returned for TD'),
    bqbl.simpleMultiple(5, qbScore['INT'] - qbScore['INT6'], 'INT'),
    bqbl.simpleMultiple(25, qbScore['FUM6'], 'fumble lost for TD'),
    bqbl.simpleMultiple(5, qbScore['FUML'] - qbScore['FUM6'], 'fumble lost'),
    bqbl.simpleMultiple(2, qbScore['FUM'] - qbScore['FUML'], 'fumble kept'),
    bqbl.turnoverPoints(qbScore),
    bqbl.touchdownPoints(qbScore['TD']),
    bqbl.passingYardPoints(qbScore['PASSYD'] + qbScore['SACKYD']),
    bqbl.completionRatePoints(qbScore['CMP'], qbScore['ATT']),
    bqbl.simpleMultiple(1, qbScore['SACK'], 'sacked'),
    bqbl.simpleMultiple(20, qbScore['SAF'], 'QB at fault for safety'),
    bqbl.simpleMultiple(35, qbScore['BENCH'], 'QB benched'),
    bqbl.simpleMultiple(20, qbScore['FREEAGENT'], 'free agent starter')
  ];
  if (qbScore['LONG'] < 25)
    pointsList.push(new ScoreComponent(10, 'no pass of 25+ yards'));
  if (qbScore['RUSHYD'] >= 75)
    pointsList.push(new ScoreComponent(-8, '75+ rushing yards'));
  if (qbScore['INT6OT'])
    pointsList.push(new ScoreComponent(50, 'game-losing pick six in OT'));
  return pointsList.filter(function(x) { return x.pointValue != 0; });
};


bqbl.turnoverPoints = function(qbScore) {
  var totalTurnovers = qbScore['INT'] + qbScore['FUML'];
  var points = 0;
  if (totalTurnovers == 3) points = 10;
  else if (totalTurnovers == 4) points = 20;
  else if (totalTurnovers >= 5) points = 32;
  // 1.5x points for subsequent turnovers.
  for (var to = 6; to <= totalTurnovers; to++) {
    points = points + points / 2;
  }
  return new ScoreComponent(points, totalTurnovers + '-turnover game');
};


bqbl.passingYardPoints = function(yards) {
  var points, rangeString;
  if (yards < 100) { points = 25; rangeString = 'under 100'; }
  else if (yards < 150) { points = 12; rangeString = 'under 150'; }
  else if (yards < 200) { points = 6; rangeString = 'under 200'; }
  else if (yards < 300) { points = 0; rangeString = 'under 300'; }
  else if (yards < 350) { points = -6; rangeString = '300+'; }
  else if (yards < 400) { points = -9; rangeString = '350+'; }
  else { points = -12; rangeString = '400+'; }
  return new ScoreComponent(points, rangeString + ' passing yards');
};


bqbl.completionRatePoints = function(completions, attempts) {
  var completionRate = completions / attempts;
  var points, rangeString;
  if (completionRate < 0.3) { points = 25; rangeString = 'under 30%'; }
  else if (completionRate < 0.4) { points = 15; rangeString = 'under 40%'; }
  else if (completionRate < 0.5) { points = 5; rangeString = 'under 50%'; }
  else { points = 0; rangeString = '50%+'; }
  return new ScoreComponent(points, rangeString + ' completion rate');
};


bqbl.touchdownPoints = function(tds) {
  var points;
  if (tds == 0) points = 10;
  else if (tds < 3) points = 0;
  else points = -5;
  // Penalty doubled for each TD beyond 3.
  for (var td = 4; td <= tds; td++) {
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
bqbl.simpleMultiple = function(pointsPer, quantity, description) {
  quantity = quantity || 0;
  if (quantity != 1) {
    description = quantity + 'x ' + description;
  }
  return new ScoreComponent(quantity * pointsPer, description);
};
