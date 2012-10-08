goog.provide('bqbl');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.History');
goog.require('goog.net.XhrIo');
goog.require('goog.string');
goog.require('goog.Uri');


/**
 * The history object. May be null before the page is initialized.
 * @type {?goog.History}
 */
bqbl.historyState_ = null;


/**
 * Global state holding the current scores, parsed from JSON.
 */
bqbl.scoreState_ = [];


/**
 * Initializes the module. Must be called before the page is completely loaded,
 * and before any other function in this module.
 */
bqbl.init = function() {
  bqbl.historyState_ = new goog.History();
  bqbl.historyState_.setToken('active,team');
  bqbl.historyState_.setEnabled(true);
  goog.events.listen(
      bqbl.historyState_,
      goog.history.EventType.NAVIGATE,
      function(e) {
        bqbl.redrawScores(e.token.split(','));
      });
};


bqbl.registerListeners = function() {
  function addListener(elementId, sortOrder) {
    goog.events.listen(
        document.getElementById(elementId),
        goog.events.EventType.CLICK,
        function(e) {
          bqbl.setSortOrder(sortOrder);
          e.preventDefault();
        });
  }
  addListener('sortbyactive', ['active', 'team']);
  addListener('sortbyscore', ['score', 'team']);
  addListener('sortbyteam', ['team']);
};


/**
 * Updates the sort order stored in the history state.
 * @param {!Array.<string>} sortOrder A list of strings describing how to sort
 *     the scores.
 */
bqbl.setSortOrder = function(sortOrder) {
  bqbl.historyState_.setToken(sortOrder.join(','));
};


bqbl.comparisons = {};


bqbl.comparisons.teamNameAlphabetical = function(a, b) {
  return a.teamName > b.teamName ? 1 : (a.teamName == b.teamName ? 0 : -1);
};


bqbl.comparisons.activeGamesFirst = function(a, b) {
  var aOver = a.isGameOver() ? 1 : 0;
  var bOver = b.isGameOver() ? 1 : 0;
  return aOver - bOver;
};


bqbl.comparisons.scoresDescending = function(a, b) {
  return b.totalScore - a.totalScore;
};


/**
 * Loads JSON data and asynchronously renders the scores on the page, then
 * enqueues another invocation of this function for some time in the future.
 * @param {string} url The URL from which to load the JSON.
 * @param {number=} opt_updateInterval The number of seconds to wait until
 *     updating again. Defaults to 5 minutes.
 */
bqbl.startUpdating = function(url, opt_updateInterval) {
  var loadAndQueueUpdate = function() {
    bqbl.loadAndUpdate(url);
    window.setTimeout(
        loadAndQueueUpdate, opt_updateInterval || 1000 * 60 * 5);
  };
  loadAndQueueUpdate();
};


/**
 * Loads JSON data and asynchronously renders the scores on the page.
 * @param {string} jsonUrl The URL from which to load the JSON.
 */
bqbl.loadAndUpdate = function(jsonUrl) {
  // Tack on a random parameter to bust the cache.
  var uri = new goog.Uri(jsonUrl);
  uri.makeUnique();
  goog.net.XhrIo.send(
      uri.toString(),
      function() {
        bqbl.scoreState_ = this.getResponseJson();
        bqbl.redrawScores(bqbl.historyState_.getToken().split(','));
        // TODO: Include the update time in the JSON response instead, and
        // display that as the time the data was scraped.
        document.getElementById('updatetime').innerHTML = new Date();
      },
      undefined,  // opt_method
      undefined,  // opt_content
      undefined,  // opt_headers
      60 * 1000  // opt_timeoutInterval
      );
};


/**
 * Updates the document with the current score state.
 * TODO: Make the strings be enums instead.
 * @param {!Array.<string>} sortOrder A list of strings describing how to sort
 *     the scores.
 */
bqbl.redrawScores = function(sortOrder) {
  bqbl.writeScores(bqbl.scoreState_, sortOrder);
};


/**
 * Updates the document with the given scores.
 * @param {!Object} jsonData A list of score objects.
 * @param {!Array.<string>=} opt_sortOrder A list of strings describing how to
 *     sort the scores.
 */
bqbl.writeScores = function(jsonData, opt_sortOrder) {
  var sortOrder = opt_sortOrder || [];
  var teamScores = jsonData.map(bqbl.numberifyJson).map(
      function(o) { return bqbl.scoreObjectToTeamScore(o); });

  for (var sortNum = sortOrder.length - 1; sortNum >= 0; sortNum--) {
    var compareFn;
    if (sortOrder[sortNum] == 'team') {
      compareFn = bqbl.comparisons.teamNameAlphabetical;
    } else if (sortOrder[sortNum] == 'active') {
      compareFn = bqbl.comparisons.activeGamesFirst;
    } else if (sortOrder[sortNum] == 'score') {
      compareFn = bqbl.comparisons.scoresDescending;
    }
    if (compareFn)
      goog.array.stableSort(teamScores, compareFn);
  }

  var scoreMarkups = teamScores.map(
      function(score) {
        return bqbl.generateTeamScoreMarkup(score);
      });
  document.getElementById('bqblscores').innerHTML = '';
  for (var j = 0; j < scoreMarkups.length; j++) {
    document.getElementById('bqblscores').innerHTML += scoreMarkups[j];
  }
};


/**
 * Attempts to converts all strings in the JSON-parsed output to numbers. If the
 * string cannot be parsed as a number, it is left alone. Non-string values are
 * left unmodified, as are all keys. The provided object is modified in-place,
 * and also returned.
 * @param {!Object.<string, *>} qbScore An object parsed from JSON.
 * @return {!Object.<string, *>} The modified object.
 */
bqbl.numberifyJson = function(qbScore) {
  for (var key in qbScore) {
    if (!goog.isString(qbScore[key]))
      continue;
    var val = /** @type {string} */ qbScore[key];
    var numberwang = goog.string.toNumber(val);
    if (!isNaN(numberwang))
      qbScore[key] = numberwang;
  }
  return qbScore;
};


/**
 * Object holding the data to be displayed, along with some attributes for
 * sorting.
 * @constructor
 */
bqbl.TeamScore = function(teamName, gameStatus, statLine, scoreComponents) {
  /**
   * @type {string}
   * @const
   */
  this.teamName = teamName;

  /**
   * The status of the game, e.g., the time remaining.
   * @type {string}
   * @const
   */
  this.gameStatus = gameStatus;

  /**
   * @type {string}
   * @const
   */
  this.statLine = statLine;

  /**
   * @type {!Array.<!bqbl.ScoreComponent>}
   */
  this.scoreComponents = scoreComponents;  // TODO: I wish this was immutable.

  /**
   * @type {number}
   * @const
   */
  this.totalScore = (scoreComponents
                     .map(function(x) { return x.pointValue; })
                     .reduce(function(a, b) { return a + b; }, 0));
};


/**
 * @return {boolean} Whether the game is over.
 */
bqbl.TeamScore.prototype.isGameOver = function() {
  return this.gameStatus == 'Final';
};


/**
 * An immutable data object.
 * @constructor
 */
bqbl.ScoreComponent = function(pointValue, description) {
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


/**
 * @param {!Object.<string, *>} scoreObject A JSON-parsed score object.
 * @return {!bqbl.TeamScore} The score data, as a TeamScore.
 */
bqbl.scoreObjectToTeamScore = function(scoreObject) {
  return new bqbl.TeamScore(
      scoreObject['team'],
      scoreObject['game_time'],
      bqbl.computeStatLine(scoreObject),
      bqbl.computeScoreComponents(scoreObject));
};


/**
 * @param {!bqbl.TeamScore} score A team score.
 * @return {string} HTML markup rendering the score.
 */
bqbl.generateTeamScoreMarkup = function(score) {
  var componentMarkups = [];

  for (var cNum = 0, component; component = score.scoreComponents[cNum++]; ) {
    if (component.pointValue == 0)
      continue;
    var pointString = bqbl.numberToHtml(component.pointValue);
    componentMarkups.push(
        '<tr class="scorerow">' +
        '  <td class="scoredesc">' + component.description + '</td>' +
        '  <td class="scorepoints">' + pointString + '</td>' +
        '</tr>');
  }

  var scoreMarkups = [
      '<div class="team' + (score.isGameOver() ? '' : ' active') +
          '">',
      '  <div class="teamheader">',
      '    <img class="teamlogo" src="images/' + score.teamName + '.png" ',
      '        width="48" height="32">',
      '    <span class="teamname">' + score.teamName + '</span>',
      '    <span class="teampoints">' + bqbl.numberToHtml(score.totalScore) +
          '</span>',
      '  </div>',
      '  <div class="statline">' + score.statLine + '</div>',
      '  <div class="gamestatus">' + score.gameStatus + '</div>',
      '  <table class="scoretable">'
  ];
  scoreMarkups = scoreMarkups.concat(componentMarkups);
  scoreMarkups = scoreMarkups.concat([
      '  </table>',
      '</div>'
  ]);

  return scoreMarkups.join('\n');
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
  return pointsList.filter(function(x) { return x.pointValue != 0; });
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


goog.exportSymbol('bqbl.init', bqbl.init);
goog.exportSymbol('bqbl.loadAndUpdate', bqbl.loadAndUpdate);
goog.exportSymbol('bqbl.registerListeners', bqbl.registerListeners);
goog.exportSymbol('bqbl.startUpdating', bqbl.startUpdating);
