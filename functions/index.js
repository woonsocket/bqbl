const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions');

const scoring = require('./scoring.js');

admin.initializeApp(functions.config().firebase);

exports.score = functions.database.ref('/stats/{year}/{week}/{team}')
    .onWrite(event => {
      const {year, week, team} = event.params;
      const statsRef = admin.database().ref(`/scores/${year}/${week}/${team}`);

      const stats = event.data.val();
      if (stats == null) {
        console.log('Removing', team, stats);
        statsRef.remove();
        return;
      }
      console.log('Scoring', team, stats);
      statsRef.update(scoring.computeScore(stats));
    });


/** Same as score(), but via HTTP. Sorta useful for local debugging. */
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
