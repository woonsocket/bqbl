const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions');

const eventTicker = require('./event-ticker.js');
const scoring = require('./scoring.js');
const util = require('./util.js')
const create = require('./create.js')

admin.initializeApp();

exports.score = functions.database.ref('/stats/{year}/{week}/{team}')
  .onWrite((change, context) => {
    const { year, week, team } = context.params;
    const stats = change.after.val();
    const overrides = admin.database()
      .ref(`/events/${year}/${week}/overrides/${team}`)
      .once('value')
      .then(d => d.val());
    return doScore(stats, overrides, year, week, team);
  });

exports.rescoreOnOverride = functions.database.ref('/events/{year}/{week}/overrides/{team}')
  .onWrite((change, context) => {
    const { year, week, team } = context.params;
    const stats = admin.database()
      .ref(`/stats/${year}/${week}/${team}`)
      .once('value')
      .then(d => d.val());
    const overrides = change.after.val();
    return doScore(stats, overrides, year, week, team);
  });


exports.addNewEventToTicker = eventTicker.onNewEvent;


function doScore(stats, overrides, year, week, team) {
  return Promise.all([stats, overrides]).then(([stats, overrides]) => {
    const scoreRef = admin.database().ref(`/scores/${year}/${week}/${team}`);
    if (stats == null) {
      console.log('Removing', team);
      scoreRef.remove();
      return;
    }
    console.log('Scoring', team, stats);
    scoreRef.update(scoring.computeScore(stats, overrides));
  });
}


/**
 * Same as score(), but via HTTP. Returns the computed score via HTTP and does
 * not write to the database. Sorta useful for local debugging.
 */
exports.scoreHttp = functions.https.onRequest((req, res) => {
  const { year, week, team } = req.body;
  const statsPromise = admin.database()
    .ref(`/stats/${year}/${week}/${team}`).once('value');
  const overridesPromise = admin.database()
    .ref(`/events/${year}/${week}/overrides/${team}`).once('value');

  return Promise.all([statsPromise, overridesPromise])
    .then(([statsData, overridesData]) => {
      if (!statsData.exists()) {
        res.status(400).send();
        return;
      }
      const stats = statsData.val();
      const overrides = overridesData.val() || {};
      res.status(200).send(scoring.computeScore(stats, overrides));
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});


/**
 * Recompute one week's scores (for every team) and write them to the database.
 *
 * The scoring function normally only triggers when the database value
 * under /stats changes, so you can use this to manually force a re-score if
 * you've changed the scoring code.
 */
exports.rescoreAll = functions.https.onRequest((req, res) => {
  const { year, week } = req.body;
  const overrides = admin.database()
    .ref(`/events/${year}/${week}/overrides`)
    .once('value')
    .then(d => d.val() || {});
  admin.database().ref(`/stats/${year}/${week}`)
    .once('value', (data) => {
      let weekStats = data.val();
      if (weekStats == null) {
        res.status(400).send(`no stats known for ${year}/${week}`);
        return;
      }
      const promises = entries(weekStats).map(([team, stats]) => {
        return doScore(stats, overrides.then(v => v[team] || {}),
          year, week, team);
      });
      Promise.all(promises).then(() => {
        res.status(200).send(`wrote ${Object.keys(weekStats).join(' ')}`);
      });
    });
});


exports.addPlayerToLeague = create.addPlayerToLeague;
exports.setDraftOrder = create.setDraftOrder;
exports.createLeague = create.createLeague;
exports.finalizeDraft = create.finalizeDraft;
exports.createNewYear = create.createNewYear;
exports.draftTeam = create.draftTeam;

// exports.copyFromTmp = util.copyFromTmp;
// exports.portStartsNewFormat = util.portStartsNewFormat;
// exports.tmpWriteLeague = util.tmpWriteLeague;
exports.makeDuplicateUser = util.makeDuplicateUser;