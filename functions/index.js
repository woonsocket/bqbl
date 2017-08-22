const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions');

const scoring = require('./scoring.js');

admin.initializeApp(functions.config().firebase);

exports.score = functions.database.ref('/stats/{year}/{week}/{team}')
    .onWrite(event => {
      const {year, week, team} = event.params;
      const stats = event.data.val();
      doScore(stats, year, week, team);
    });


function doScore(stats, year, week, team) {
  const statsRef = admin.database().ref(`/scores/${year}/${week}/${team}`);
  if (stats == null) {
    console.log('Removing', team, stats);
    statsRef.remove();
    return;
  }
  console.log('Scoring', team, stats);
  statsRef.update(scoring.computeScore(stats));
}


/**
 * Same as score(), but via HTTP. Returns the computed score via HTTP and does
 * not write to the database. Sorta useful for local debugging.
 */
exports.scoreHttp = functions.https.onRequest((req, res) => {
  const {year, week, team} = req.body;
  admin.database().ref(`/stats/${year}/${week}/${team}`)
      .once('value', (data) => {
        let stats = data.val();
        if (stats == null) {
          res.status(400).send();
          return;
        }
        res.status(200).send(scoring.computeScore(stats));
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
  admin.database().ref(`/stats/${year}/${week}`)
      .once('value', (data) => {
        let weekStats = data.val();
        if (weekStats == null) {
          res.status(400).send(`no stats known for ${year}/${week}`);
          return;
        }
        entries(weekStats).forEach(([team, stats]) => {
          doScore(stats, year, week, team);
        });
        res.status(200).send(`wrote ${Object.keys(weekStats).join(' ')}`);
      });
});
