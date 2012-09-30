goog.provide('bqbl');

goog.require('goog.net.XhrIo');
goog.require('goog.string');


/**
 * Loads JSON data and asynchronously renders the scores on the page, then
 * enqueues another invocation of this function for some time in the future.
 * @param {string} url The URL from which to load the JSON.
 * @param {number=} opt_updateInterval The number of seconds to wait until
 *     updating again. Defaults to 5 minutes.
 */
bqbl.startUpdating = function(url, opt_updateInterval) {
  var loadAndQueueUpdate = function() {
    goog.net.XhrIo.send(
        url,
        function() {
          bqbl.writeScores(this.getResponseJson());
        },
        undefined,  // opt_method
        undefined,  // opt_content
        {
          'Cache-Control': 'max-age: 60'
        },
        opt_updateInterval  // opt_timeoutInterval
        );
    // TODO: Include the update time in the JSON response instead, and display
    // that as the time the data was scraped.
    document.getElementById('updatetime').innerHTML = new Date();
    window.setTimeout(
        loadAndQueueUpdate, opt_updateInterval || 1000 * 60 * 5);
  };
  loadAndQueueUpdate();
};


bqbl.writeScores = function(jsonData) {
  var scoreObjects = jsonData.map(bqbl.numberifyJson);
  scoreObjects.sort(
      function(a, b) {
        return a['team'] > b['team'] ? 1 : (a['team'] == b['team'] ? 0 : -1);
      });
  var scoreMarkups = scoreObjects.map(
      function(scoreObject) {
        return bqbl.generateTeamScoreMarkup(scoreObject);
      });
  document.getElementById('bqblscores').innerHTML = '';
  for (var j = 0; j < scoreMarkups.length; j++) {
    document.getElementById('bqblscores').innerHTML += scoreMarkups[j];
  }
};


bqbl.numberifyJson = function(qbScore) {
  for (var key in qbScore) {
    if (key == 'team')
      continue;
    qbScore[key] = goog.string.toNumber(qbScore[key]);
  }
  return qbScore;
};


/**
 * Just a data object.
 * @constructor
 */
bqbl.ScoreComponent = function(pointValue, description) {
  this.pointValue = pointValue;
  this.description = description;
};


/**
 * Converts a number to an HTML string. Mostly useful if you want do be pedantic
 * about the difference between a minus sign and a hyphen, which I kind of do.
 * @param {number} num A number.
 * @return {string} An HTML string of the number.
 */
bqbl.numberToHtml = function(num) {
  var str = '' + num;
  if (num < 0)
    return '<span class="neg">&minus;' + (-1 * num) + '</span>';
  else if (num > 0)
    return '+' + num;
  return '' + num;
};


bqbl.generateTeamScoreMarkup = function(scoreObject) {
  var statLine = bqbl.computeStatLine(scoreObject);
  var componentList = bqbl.computeScoreComponents(scoreObject);
  var componentMarkups = [
      '<div class="teamscore">',
      '<span class="teamname">' + scoreObject['team'] + '</span>: ' + statLine,
      '<table class="scoretable">'
  ];
  var totalPoints = 0;
  for (var cNum = 0, component; component = componentList[cNum++]; ) {
    if (component.pointValue == 0)
      continue;
    totalPoints += component.pointValue;
    var pointString = bqbl.numberToHtml(component.pointValue);
    componentMarkups.push(
        '<tr>' +
        '<td class="scorepoints">' + pointString + '</td>' +
        '<td class="scoredesc">' + component.description + '</td>' +
        '</tr>');
  }
  componentMarkups.push('<tr class="total">' +
                        '<td class="scorepoints">' +
                        bqbl.numberToHtml(totalPoints) + '</td>' +
                        '<td class="scoredesc">TOTAL</td>' +
                        '</tr>');
  componentMarkups.push('</table></div>');
  return componentMarkups.join('\n');
};


/**
 * Creates a ScoreComponent representing a simple "X points per Y" value.
 * @param {number} pointsPer How many points each Y is worth ("X").
 * @param {number} quantity How many Ys there are.
 * @param {string} description A description of what Y is. Probably should be
 *     for the singular form of Y.
 * @return {!bqbl.ScoreComponent} A ScoreComponent for the points described.
 */
bqbl.simpleMultiple = function(pointsPer, quantity, description) {
  return new bqbl.ScoreComponent(quantity * pointsPer,
                                 quantity + 'x ' + description);
};


/**
 * @return {string} The QB stat line.
 */
bqbl.computeStatLine = function(qbScore) {
  return goog.string.buildString(
      qbScore['completions'] + '/' + qbScore['attempts'] + ', ',
      qbScore['pass_yards'] + ' yd, ',
      qbScore['pass_tds'] + ' TD, ',
      qbScore['interceptions_td'] + qbScore['interceptions_notd'] + ' INT'
  );
};


/**
 * @return {!Array.<!bqbl.ScoreComponent>} A list of ScoreComponents.
 */
bqbl.computeScoreComponents = function(qbScore) {
  var pointsList = [
    bqbl.simpleMultiple(25, qbScore['interceptions_td'], 'INT returned for TD'),
    bqbl.simpleMultiple(5, qbScore['interceptions_notd'], 'INT'),
    bqbl.simpleMultiple(5, qbScore['fumbles_lost_notd'], 'fumble lost'),
    bqbl.simpleMultiple(2, qbScore['fumbles_kept'], 'fumble kept'),
    bqbl.turnoverPoints(qbScore),
    bqbl.touchdownPoints(qbScore['pass_tds'] + qbScore['rush_tds']),
    bqbl.passingYardPoints(qbScore['pass_yards']),
    bqbl.completionRatePoints(qbScore['completions'], qbScore['attempts'])
  ];
  if (qbScore['long_pass'] < 25)
    pointsList.push(new bqbl.ScoreComponent(10, 'no pass of 25+ yards'));
  if (qbScore['rush_yards'] >= 75)
    pointsList.push(new bqbl.ScoreComponent(-8, '75+ rushing yards'));
  return pointsList;
};


bqbl.turnoverPoints = function(qbScore) {
  var totalTurnovers = qbScore['interceptions_notd'] +
      qbScore['interceptions_td'] + qbScore['fumbles_lost_notd'] +
      qbScore['fumbles_lost_td'];
  var points = 0;
  if (totalTurnovers == 3) points = 12;
  else if (totalTurnovers == 4) points = 16;
  else if (totalTurnovers == 5) points = 24;
  else if (totalTurnovers > 5) points = 50;
  return new bqbl.ScoreComponent(points, totalTurnovers + '-turnover game');
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
  return new bqbl.ScoreComponent(points, rangeString + ' passing yards');
};


bqbl.completionRatePoints = function(completions, attempts) {
  var completionRate = completions / attempts;
  var points, rangeString;
  if (completionRate < 0.3) { points = 25; rangeString = 'under 30%'; }
  else if (completionRate < 0.4) { points = 15; rangeString = 'under 40%'; }
  else if (completionRate < 0.5) { points = 5; rangeString = 'under 50%'; }
  else { points = 0; rangeString = '50%+'; }
  return new bqbl.ScoreComponent(points, rangeString + ' completion rate');
};


bqbl.touchdownPoints = function(tds) {
  var points;
  if (tds == 0) points = 10;
  else if (tds < 3) points = 0;
  else if (tds == 3) points = -5;
  else if (tds == 4) points = -10;
  else points = -20;
  return new bqbl.ScoreComponent(points, tds + '-touchdown game');
};


goog.exportSymbol('bqbl.startUpdating', bqbl.startUpdating);
