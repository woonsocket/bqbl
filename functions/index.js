const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions');

const eventTicker = require('./event-ticker.js');
const scoring = require('./scoring.js');
// admin.initializeApp();

// Uncomment this to run locally. TODO: Make this work locally or remotely.
admin.initializeApp({
  credential: admin.credential.cert('../private-keys/bqbl-591f3-f7f1062e9016.json'),
  databaseURL: 'https://bqbl-591f3.firebaseio.com'
});
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
          // TODO: Hard-coded year.
          var a = { [user.leagueId + '/2018/' + week.id + '/' + userKey]: { 'starts': starts, 'name': user.name } };
          updateItems.push(a);
        })
      }

      updateItems.forEach(updateItem => {
        // TODO: hard-coded tmp.
        const yearRef = admin.database().ref(`/tmp/leagues/`);
        yearRef.update(updateItem);
      });
      res.status(200).send("success");
    })
});

/**
 * Dump a dummy league with id nbqbl. This is to test createNewYear, among other reasons.
 */
exports.tmpWriteLeague = functions.https.onRequest((req, res) => {
  const nbqbl = admin.database().ref(`/tmp/leaguespec/nbqbl`);
  nbqbl.update({
    users: [{ name: 'Joel', uid: '1', teams: [{name: 'ARI'}, {name: 'BUF'}, {name: 'CLE'}, {name: 'NYJ'}]},
    { name: 'Harvey', uid: '2', teams: [{name: 'ARI'}, {name: 'BUF'}, {name: 'CLE'}, {name: 'NYJ'}]}],
  })
  res.status(200).send("success");
});


/**
 * Create a league spec at /leaguespec/{LEAGUEID}.
 * 
 * url - createNewYear/{LEAGUE_ID}
 */
exports.createLeague = functions.https.onRequest((req, res) => {
  const leagueId = new URL(req.url, "http://bqbl.futbol").pathname.slice(1);
  const leagueRef = admin.database().ref(`tmp/leaguespec/` + leagueId);
  const stubLeague = {
    id: leagueId
  };
  leagueRef.set(stubLeague);
  res.status(200).send("success");
});

/**
 * Read in a league spec from /leaguespec/{LEAGUEID}.
 * Write out all of the starts for that league.
 */
exports.createNewYear = functions.https.onRequest((req, res) => {
  const leagueId = new URL(req.url, "http://bqbl.futbol").pathname.slice(1);

  admin.database()
    .ref(`/tmp/leaguespec/` + leagueId)
    .once('value').then(data => {
      const users = data.val().users;
      // TODO: Make this a param or constant.
      const YEAR = 2019;
      // TODO: Pull this into constants.
      const weeks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"];
      for (let i = 0; i < users.length; i++) {
        let allWeeksList = [];
        let teams = users[i].teams;
        for (let j = 0; j < teams.length; j++) {
          teams[j].selected = "false";
        }
        console.log(teams);
        for (let j = 0; j < weeks.length; j++) {
          week = weeks[j];
          let thisWeek = { 'id': week, "teams": teams };
          allWeeksList.push(thisWeek);
        }
        // TODO: Get rid of /tmp
        const yearRef = admin.database().ref(`tmp/users/` + users[i].uid + `/plays/` + leagueId + `/` + YEAR);
        yearRef.set(allWeeksList);
      }
      res.status(200).send("success");
    })
});

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
  res.status(200).send("success");

});