goog.provide('bqbl');

goog.require('goog.array');
goog.require('goog.date');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.History');
goog.require('goog.net.XhrIo');
goog.require('goog.string');
goog.require('goog.Uri');


bqbl.DEFAULT_SORT_ORDER = 'active,score';
bqbl.DEFAULT_SCORE_MODE = 'proj';
bqbl.MAX_WEEK_NUM = 17;
bqbl.SEASON = '2016';

// Set this to the start date of Week 1 of the current season. Typically a
// Thursday, so that the week changes before Thursday Night Football each week.
bqbl.SEASON_START = new Date(2016, 8, 8);  // September 8, 2016
bqbl.ONE_WEEK = 1000 * 60 * 60 * 24 * 7;


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
 * Reference to the Firebase database.
 * @type {?firebase.database.Database}
 */
bqbl.database = null;


/**
 * The database location we're currently listening to.
 * @type {string}
 */
bqbl.dbListenLocation = '';


/**
 * Initializes the module. Must be called before the page is completely loaded,
 * and before any other function in this module.
 */
bqbl.init = function() {
  firebase.initializeApp({
    'apiKey': 'AIzaSyCVbZ7U5Y4ZO-tsQpsZgIf7ROPJdpAXLuE',
    'databaseURL': 'https://bqbl-591f3.firebaseio.com',
  });
  bqbl.database = firebase.database();

  bqbl.historyState_ = new goog.History();
  bqbl.historyState_.setEnabled(true);
  goog.events.listen(
      bqbl.historyState_,
      goog.history.EventType.NAVIGATE,
      (e) => setTimeout(bqbl.redrawScores, 0));
  bqbl.listenToScores(bqbl.SEASON, bqbl.activeWeek());
};


bqbl.registerListeners = function() {
  /**
   * @param {?Element} element The element to which to add the listener. If
   *     null, returns without doing anything.
   * @param {!Object.<string, string>} params Parameters from the history token.
   * @param {boolean=} opt_weekChange Whether this is a week change, i.e.,
   *     whether we should switch the DB listener.
   */
  function addListener(element, params, opt_weekChange) {
    if (!element) return;
    goog.events.listen(
        element,
        goog.events.EventType.CLICK,
        function(e) {
          bqbl.updateHistoryToken(params);
          if (opt_weekChange) {
            bqbl.listenToScores(bqbl.SEASON, bqbl.activeWeek());
          }
          e.preventDefault();
        });
  }

  addListener(document.getElementById('sortbyactive'),
              {'sort': ['active', 'team']});
  addListener(document.getElementById('sortbyscore'),
              {'sort': ['score', 'team']});
  addListener(document.getElementById('sortbyteam'),
              {'sort': ['team']});

  var weekSelectorsElem = document.getElementById('weekselectors');
  goog.dom.appendChild(weekSelectorsElem, goog.dom.createTextNode('Week: '));
  for (var weekNum = 1; weekNum <= bqbl.MAX_WEEK_NUM; weekNum++) {
    var weekLink = goog.dom.createDom('a', {href: '#'},
                                      goog.dom.createTextNode('' + weekNum));
    goog.dom.appendChild(weekSelectorsElem, weekLink);
    if (weekNum != bqbl.MAX_WEEK_NUM) {
      var separator = goog.dom.createDom('span');
      separator.innerHTML = '&nbsp;&middot;&nbsp;';
      goog.dom.appendChild(weekSelectorsElem, separator);
    }
    addListener(weekLink, {'week': weekNum}, /* weekChange */ true);
  }

  addListener(document.getElementById('scoresreal'), {'score': 'real'});
  addListener(document.getElementById('scoresprojected'), {'score': 'proj'});
};


/**
 * Parses the history token string. The token consists of key-value pairs. Each
 * key name is separated from its value by a colon. The key-value pairs are
 * delimited by semicolons.
 * Malformed or empty key-value strings are ignored. If duplicate keys are
 * present, only one is returned; it is unspecified which one is returned.
 * @param {string} token A string.
 * @return {!Object.<string, string>} The key-value pairs from the token string,
 *     as an object.
 */
bqbl.parseHistoryToken = function(token) {
  var kvPairs = token.split(';');
  var result = {};
  for (var pairNum = 0, kvPair; kvPair = kvPairs[pairNum++]; ) {
    if (kvPair.indexOf(':') < 0) {
      continue;
    }
    var firstColon = kvPair.indexOf(':');
    if (firstColon < 0) {
      continue;
    }
    var key = kvPair.substring(0, firstColon);
    var value = kvPair.substring(firstColon + 1);
    result[key] = value;
  }
  return result;
};


/**
 * Converts an object into a history token string. See bqbl.parseHistoryToken
 * for the string format.
 * @param {!Object.<string, string>} params Key-value pairs.
 * @return {string} A history token representing the given params.
 */
bqbl.unparseHistoryToken = function(params) {
  var kvPairs = [];
  for (var key in params) {
    kvPairs.push(key + ':' + params[key]);
  }
  return kvPairs.join(';');
};


/**
 * Updates the history token with new values.
 * Not thread-safe; multiple concurrent invocations may result in updates being
 * lost.
 * @param {!Object.<string, string>} newParams A collection of new key-value
 *     pairs to update in the history token. Keys that already exist in the
 *     history token are overwritten. Keys that do not exist are added.
 */
bqbl.updateHistoryToken = function(newParams) {
  var oldParams = bqbl.parseHistoryToken(bqbl.historyState_.getToken());
  for (var key in newParams) {
    oldParams[key] = newParams[key];
  }
  bqbl.historyState_.setToken(bqbl.unparseHistoryToken(oldParams));
};


/**
 * @return {string} Which week to show scores for.
 */
bqbl.activeWeek = function() {
  var history = bqbl.parseHistoryToken(bqbl.historyState_.getToken());
  return history['week'] || bqbl.getCurrentWeekNumber_();
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
 * Gets the URL of the JSON containing data for the given week.
 * @param {number|string} weekNumber The week number.
 * @return {string} A URL.
 */
bqbl.jsonUrl_ = function(weekNumber) {
  // Check that the input is a positive integer (or a string of one).
  if (!('' + weekNumber).match(/^\d+$/))
    throw 'Invalid week number: ' + weekNumber;
  return 'week' + weekNumber + '.json';
};


/**
 * Determines the current week number of the NFL season.
 * @param {!goog.date.Date=} opt_date A date. Defaults to today.
 * @return {string} The current NFL week number.
 */
bqbl.getCurrentWeekNumber_ = function(opt_date) {
  var date = opt_date || new goog.date.Date();
  return '' + Math.min(
      Math.floor((new Date() - bqbl.SEASON_START) / bqbl.ONE_WEEK) + 1,
      bqbl.MAX_WEEK_NUM);
};


/**
 * The Firebase database location for scores for the given week.
 * @param {string|number} season A season ID.
 * @param {string|number} week A week ID.
 */
bqbl.dbLocationForScores = function(season, week) {
  return `/score/${season}/${week}`;
};


/**
 * Listen for score updates for the given week. Removes the old listener. The
 * listener redraws the scores on the page whenever score data changes.
 * @param {string|number} season A season ID.
 * @param {string|number} week A week ID.
 */
bqbl.listenToScores = function(season, week) {
  if (bqbl.dbListenLocation) {
    bqbl.database.ref(bqbl.dbListenLocation).off();
  }

  var loc = bqbl.dbLocationForScores(season, week);
  bqbl.dbListenLocation = loc;
  bqbl.database.ref(loc)
      .on('value', (snapshot) => {
        // TODO: Add an error/disconnection handler.
        document.getElementById('status').textContent = 'Listening for updates.';

        var v = snapshot.val();
        if (!v || !(v instanceof Object)) {
          return;
        }
        bqbl.scoreState_ = Object.values(v);

        bqbl.redrawScores();
      });
};


/**
 * Updates the document with the current score state.
 */
bqbl.redrawScores = function() {
  var params = bqbl.parseHistoryToken(bqbl.historyState_.getToken());
  var sortString = params['sort'];
  var sortCriteria = sortString ? sortString.split(',') : [];

  bqbl.writeScores(bqbl.scoreState_, sortCriteria);

  document.getElementById('updatetime').textContent = new Date();
};


/**
 * Updates the document with the given scores.
 * @param {!Object} jsonData A list of score objects.
 * @param {!Array.<string>=} opt_sortOrder A list of strings describing how to
 *     sort the scores.
 */
bqbl.writeScores = function(jsonData, opt_sortOrder) {
  var sortOrder = opt_sortOrder || [];
  if (sortOrder.length == 0)
    sortOrder = bqbl.DEFAULT_SORT_ORDER.split(',');
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
    var val = '' + qbScore[key];
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
bqbl.TeamScore = function(teamName, opponentName, boxscoreUrl, gameStatus,
                          statLine, scoreComponents) {
  /**
   * @type {string}
   * @const
   */
  this.teamName = teamName;

  /**
   * @type {string}
   * @const
   */
  this.opponentName = opponentName;

  /**
   * @type {string}
   * @const
   */
  this.boxscoreUrl = boxscoreUrl;

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
  return this.gameStatus.indexOf('Final') >= 0;
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
  var originalScoreObject = scoreObject;
  var history = bqbl.parseHistoryToken(bqbl.historyState_.getToken());
  var mode = history['score'] || bqbl.DEFAULT_SCORE_MODE;
  if (mode == 'proj') {
    scoreObject = bqbl.computeStupidProjection(
        scoreObject,
        bqbl.parseElapsedFraction('' + scoreObject['game_time']));
  }
  var scoreComponents = bqbl.computeScoreComponents(scoreObject);
  return new bqbl.TeamScore(
      scoreObject['team'],
      scoreObject['opponent'] || '',
      scoreObject['boxscore_url'] || 'javascript:void(0);',
      scoreObject['game_time'],
      bqbl.computeStatLine(originalScoreObject),
      scoreComponents);
};


/**
 * @param {!bqbl.TeamScore} score A team score.
 * @return {string} HTML markup rendering the score.
 */
bqbl.generateTeamScoreMarkup = function(score) {
  // TODO(juangj): Use goog.dom.
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

  // Weeks before 2014 Week 17 don't have opponent data.
  var opponentString = '';
  if (score.opponentName) {
    opponentString = '(vs. ' + score.opponentName + ')';
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
      '  <div class="gamestatus">',
      '    <a href="' + score.boxscoreUrl + '">' + score.gameStatus + '</a>',
      '    ' + opponentString,
      '  </div>',
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
  quantity = quantity || 0;
  if (quantity != 1) {
    description = quantity + 'x ' + description;
  }
  return new bqbl.ScoreComponent(quantity * pointsPer, description);
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
    bqbl.simpleMultiple(25, qbScore['fumbles_lost_td'], 'fumble lost for TD'),
    bqbl.simpleMultiple(5, qbScore['fumbles_lost_notd'], 'fumble lost'),
    bqbl.simpleMultiple(2, qbScore['fumbles_kept'], 'fumble kept'),
    bqbl.turnoverPoints(qbScore),
    bqbl.touchdownPoints(qbScore['pass_tds'] + qbScore['rush_tds']),
    bqbl.passingYardPoints(qbScore['pass_yards']),
    bqbl.completionRatePoints(qbScore['completions'], qbScore['attempts']),
    bqbl.simpleMultiple(1, qbScore['sacks'], 'sacked'),
    bqbl.simpleMultiple(20, qbScore['safeties'], 'QB at fault for safety'),
    bqbl.simpleMultiple(35, qbScore['benchings'], 'QB benched'),
    bqbl.simpleMultiple(20, qbScore['street_free_agent'], 'free agent starter')
  ];
  if (qbScore['long_pass'] < 25)
    pointsList.push(new bqbl.ScoreComponent(10, 'no pass of 25+ yards'));
  if (qbScore['rush_yards'] >= 75)
    pointsList.push(new bqbl.ScoreComponent(-8, '75+ rushing yards'));
  if (qbScore['game_losing_taint'])
    pointsList.push(new bqbl.ScoreComponent(50, 'game-losing pick six in OT'));
  return pointsList.filter(function(x) { return x.pointValue != 0; });
};


bqbl.turnoverPoints = function(qbScore) {
  var totalTurnovers = qbScore['interceptions_notd'] +
      qbScore['interceptions_td'] + qbScore['fumbles_lost_notd'] +
      qbScore['fumbles_lost_td'];
  var points = 0;
  if (totalTurnovers == 3) points = 10;
  else if (totalTurnovers == 4) points = 20;
  else if (totalTurnovers >= 5) points = 32;
  // 1.5x points for subsequent turnovers.
  for (var to = 6; to <= totalTurnovers; to++) {
    points = points + points / 2;
  }
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
  else points = -5;
  // Penalty doubled for each TD beyond 3.
  for (var td = 4; td <= tds; td++) {
    points *= 2;
  }
  return new bqbl.ScoreComponent(points, tds + '-touchdown game');
};


/**
 * A score object with the same format as the qbScore that is parsed from
 * JSON. Represents "average" stats for a QB. Fields that are absent are not
 * modified by the projection.
 */
bqbl._STUPID_PROJECTION_TARGET = {
  // These numbers are a little arbitrary. They're approximated from the average
  // stats for all 32 teams in Week 3 of the 2014 season.
  'pass_yards': 250,
  'pass_tds': 1.6,
  'completions': 22,
  'attempts': 35,
  // This one has the effect of only making the 'No 25+ yard pass' line show up
  // late in the game.
  'long_pass': 40
};


/**
 * @param {!Object.<string, *>} qbScore Quarterback stats.
 * @param {number} elapsedFrac The fraction of regulation time that has
 *     elapsed. Equal to 0 at the start of the game, and 1 during overtime and
 *     when the game is over.
 * @return {!Object.<string, *>} Projected stats. The parameter object is not
 *     modified.
 */
bqbl.computeStupidProjection = function(qbScore, elapsedFrac) {
  var projected = {};
  for (var stat in qbScore) {
    if (stat in bqbl._STUPID_PROJECTION_TARGET && elapsedFrac < 1) {
      var currentStat = parseInt(qbScore[stat], 10);
      var targetStat = bqbl._STUPID_PROJECTION_TARGET[stat];
      projected[stat] =
          Math.round(currentStat + (1 - elapsedFrac) * targetStat);
    } else {
      projected[stat] = qbScore[stat];
    }
  }
  return projected;
};


/**
 * @param {string} gameStatus String describing the game time remaining.
 * @return {number} The fraction of regulation time that has elapsed, between 0
 *     and 1.
 */
bqbl.parseElapsedFraction = function(gameStatus) {
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


goog.exportSymbol('bqbl.init', bqbl.init);
goog.exportSymbol('bqbl.registerListeners', bqbl.registerListeners);