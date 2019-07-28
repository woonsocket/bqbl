const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions');

const eventTicker = require('./event-ticker.js');
const scoring = require('./scoring.js');
admin.initializeApp();

// Uncomment this to run locally. TODO: Make this work locally or remotely.
// admin.initializeApp({
//   credential: admin.credential.cert('../private-keys/bqbl-591f3-f7f1062e9016.json'),
//   databaseURL: 'https://bqbl-591f3.firebaseio.com'
// });
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

exports.createStartsTable = functions.https.onRequest((req, res) => {
  admin.database()
    .ref(`/users`)
    .once('value').then(data => {
      var users = data.val();
      var updateItems = [];
      for (let [userKey, user] of Object.entries(users)) {
        user.weeks.forEach(week => {
          var starts = week.teams.filter(team => {
            if (team.selected) {
              return team.name;
            }
          })
          var a = { [user.leagueId + '/2018/' + week.id + '/' + userKey]: { 'starts': starts, 'name': user.name } };
          updateItems.push(a);
        })
      }

      updateItems.forEach(updateItem => {
        const yearRef = admin.database().ref(`/tmp/leagues/`);
        yearRef.update(updateItem);
      });
      res.status(200).send("success");
    })
});

// read: year/uid/teams
// write: users/${uid}/plays/${year}/${week}[/${team}/[id, selected], id]
exports.createNewYear = functions.https.onRequest((req, res) => {
  var updateItems = [];
  // TODO: Make this a param or constant.
  var YEAR = 2019;
  // TODO: Pull this into constants.
  var weeks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"];
  var allWeeksList = [];
  for (var i = 0; i < weeks.length; i++) {
    week = weeks[i];
    // TODO: Pull this out of the league spec
    var teams = [{ 'name': 'ARI', selected: false },
    { 'name': 'CHI', selected: false },
    { 'name': 'NYJ', selected: false },
    { 'name': 'TEN', selected: false }];
    var thisWeek = { 'id': week, "teams": teams };
    allWeeksList.push(thisWeek);
  }
  // TODO: Write this to the right place.
  const yearRef = admin.database().ref(`tmp/users/jzNyhVtHzKe8ERAaFrOAL2cFwZJ2/plays/2019/`);

  yearRef.set(allWeeksList);
})

/**
 * Copy the whole db into /tmp/.
 */
exports.forkDataToTmp = functions.https.onRequest((req, res) => {
  admin.database()
    .ref(`/users`)
    .once('value').then(data => {
      admin.database().ref(`tmp/users`).update(data.val())
    })

  admin.database()
    .ref(`/scores`)
    .once('value').then(data => {
      admin.database().ref(`tmp/scores`).update(data.val())
    })

  admin.database()
    .ref(`/leagues`)
    .once('value').then(data => {
      admin.database().ref(`tmp/leagues`).update(data.val())
    })

  admin.database()
    .ref(`/scores247`)
    .once('value').then(data => {
      admin.database().ref(`tmp/scores247`).update(data.val())
    })

});