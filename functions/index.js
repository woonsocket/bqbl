const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions');

const eventTicker = require('./event-ticker.js');
const scoring = require('./scoring.js');

admin.initializeApp(functions.config().firebase);

exports.score = functions.database.ref('/stats/{year}/{week}/{team}')
    .onWrite(event => {
      const {year, week, team} = event.params;
      const stats = event.data.val();
      const overrides = admin.database()
          .ref(`/events/${year}/${week}/overrides/${team}`)
          .once('value')
          .then(d => d.val());
      doScore(stats, overrides, year, week, team);
    });


exports.rescoreOnOverride = functions.database.ref('/events/{year}/{week}/overrides/{team}')
    .onWrite(event => {
      const {year, week, team} = event.params;
      const stats = admin.database()
          .ref(`/stats/${year}/${week}/${team}`)
          .once('value')
          .then(d => d.val());
      const overrides = event.data.val();
      doScore(stats, overrides, year, week, team);
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
  const {year, week, team} = req.body;
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
  const {year, week} = req.body;
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
        entries(weekStats).forEach(([team, stats]) => {
          doScore(stats, overrides.then(v => v[team] || {}), year, week, team);
        });
        res.status(200).send(`wrote ${Object.keys(weekStats).join(' ')}`);
      });
});
