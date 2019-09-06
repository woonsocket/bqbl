const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions');

const eventTicker = require('./event-ticker.js');
const scoring = require('./scoring.js');
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
 * Dump a dummy league. This is to test createNewYear, among other reasons.
 */
exports.tmpWriteLeague = functions.https.onCall((data, context) => {
  const league = data.league;
  const year = data.year || '2019';
  const nbqbl = admin.database().ref(`/tmp/leaguespec/${league}/users/${year}`);
  return nbqbl.update([{ name: 'Joel', uid: '1', teams: [{ name: 'ARI' }, { name: 'BUF' }, { name: 'CLE' }, { name: 'NYJ' }] },
    { name: 'Jason', uid: '2', teams: [{ name: 'ARI' }, { name: 'BUF' }, { name: 'CLE' }, { name: 'NYJ' }] },
    { name: 'Harvey', uid: 'jzNyhVtHzKe8ERAaFrOAL2cFwZJ2' },
    { name: 'Sanchez', uid: '4' },
    { name: 'Testaverde', uid: '5' },
    { name: 'Cassell', uid: '6' },
    { name: 'Hanie', uid: '7' },
    { name: 'Tebow', uid: '8' },])
});

exports.addPlayerToLeague = functions.https.onCall((data, context) => {
  const league = data.league;
  const name = data.name;
  const uid = data.uid;
  const year = data.year || '2019';
  console.log(uid);

  return admin.database().ref(`/tmp/leaguespec/${league}/users/${year}`).once('value').then(
    dataPromise => {
      let users = dataPromise.val();
      console.log(users);
      users.push({name: name, uid: uid});
      return admin.database().ref(`/tmp/leaguespec/${league}/users/${year}`).set(users)

    }
  )})

exports.setDraftOrder = functions.https.onCall((data, context) => {
  const league = data.league;
  const year = data.year || '2019';
  return admin.database().ref(`/tmp/leaguespec/${league}/users/${year}`).once('value').then(
    dataPromise => {
      let filteredUsers = dataPromise.val().map(item => {return {uid: item.uid, name: item.name}});
      let shuffledUsers = shuffle(filteredUsers);
      const shuffledUsersReverse = [...shuffledUsers].reverse();
      let order = shuffledUsers.concat(shuffledUsersReverse, shuffledUsers, shuffledUsersReverse);
      console.log(`/tmp/leaguespec/${league}/draft/${year}`);
      return admin.database().ref(`/tmp/leaguespec/${league}/draft/${year}`).set(order)
    })
});


/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

/**
 * Create a league spec at /leaguespec/{LEAGUEID}.
 * 
 * league: string
 * year: year to populate the settings for
 */
exports.createLeague = functions.https.onCall((data, context) => {
  const leagueId = data.league;
  const year = data.year || '2019';
  
  const leagueRef = admin.database().ref(`tmp/leaguespec/${leagueId}`);
  const stubLeague = {
    id: leagueId,
    settings: {'2019': {dh: false}}
  };
  return leagueRef.set(stubLeague);
});

exports.finalizeDraft = functions.https.onCall((data, context) => {
  const leagueId = data.league;
  const year = data.year || '2019';
  return admin.database()
    .ref(`/tmp/leaguespec/${leagueId}/draft/${year}`)
    .once('value').then(data => {
      const draft = data.val();
      let users = {};
      for(const draftItem of draft) {
        users[draftItem.uid] = users[draftItem.uid] || {teams:[], name:draftItem.name, uid:draftItem.uid};
        users[draftItem.uid].teams.push({name: draftItem.team})
      }
      const usersRef = admin.database().ref(
        `tmp/leaguespec/${leagueId}/users/${year}/`);
      usersRef.set(users);
    })
});

/**
 * Read in a league spec from /leaguespec/{LEAGUEID}.
 * Write out all of the starts for that league.
 */
exports.createNewYear = functions.https.onCall((data, context) => {
  const league = data.league;
  const year = data.year || '2019';
  return admin.database()
    .ref(`/tmp/leaguespec/${league}/users/${year}`)
    .once('value').then(data => {
      const users = data.val();
      // TODO: Pull this into constants.
      const weeks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"];
        for (let [userKey, user] of Object.entries(users)) {
        let allWeeks = {};
        let teams = user.teams || [];
        for (let j = 0; j < teams.length; j++) {
          teams[j].selected = false;
        }
        console.log(teams);
        for (let j = 0; j < weeks.length; j++) {
          week = weeks[j];
          let thisWeek = { 'id': week, "teams": teams };
          allWeeks[week] = thisWeek;
        }
        // TODO: Get rid of /tmp
        const yearRef = admin.database().ref(
          `tmp/leaguespec/${league}/plays/${year}/${user.uid}`);
        yearRef.set(allWeeks);
    }})
    });

exports.portStartsNewFormat = functions.https.onCall((data, context) => {
  const toYear = data.toYear;

  return admin.database()
    .ref(`tmp/users/`)
    .once('value').then(data => {
      const users = Object.entries(data.val());
      let leagues = {}; 
      leagueMap = {"-KtE306q7vKIIgOgMbZM": 'abqbl', "-KtC8hcGgvbh2W2Tq79n": 'nbqbl'}
      const weeks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17"];
      for (let [uid, user] of users) {
        leagues[leagueMap[user.leagueId]] = leagues[leagueMap[user.leagueId]] || {}
        leagues[leagueMap[user.leagueId]][uid] = {};
        for (let week of user.weeks) {
          leagues[leagueMap[user.leagueId]][uid][week.id] = week
        }
      }
      Object.entries(leagues).map(([leagueId, leagueVal]) => {
        const leagueRef = admin.database().ref(
         `tmp/leaguespec/${leagueId}/plays/${toYear}/`);
        leagueRef.set(leagueVal);
      });
    })
});


exports.copyFromTmp = functions.https.onCall((data, context) => {
  const path = data.path;

  return admin.database()
    .ref(`/tmp/${path}`)
    .once('value').then(data => {
      admin.database().ref(`/${path}`).update(data.val())
    })
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
  res.status(200).send("success");

});

DRAFT = [{uid:"1DJFVujDWmZIxCyRnCrjknIJVUa2", name:"David", team:"MIA"},{uid:"46tRhEz00sWKtaEiU9fBsVtd2gJ3", name:"Jason", team:"WAS"},{uid:"ePwyJgCBZDZaVY6V9zN058JicZB2", name:"Doug", team:"BUF"},{uid:"53rC2vSu2jb2SYXXN4hzUDVgK2D2", name:"Neil", team:"NYG"},{uid:"N0thoSRax0hgu4af2rbfHoykYAw1", name:"Jon", team:"CIN"},{uid:"Y80tDYo161XP915qXwjCDbMsZp82", name:"Phil", team:"JAX"},{uid:"kbRk5suraJfCXxxjvQWkq4prHTt2", name:"Chris", team:"TEN"},{uid:"UHQdh2453WUslbc8LinFk4AGupi1", name:"Kelly", team:"ARI"},{uid:"UHQdh2453WUslbc8LinFk4AGupi1", name:"Kelly", team:"NYJ"},{uid:"kbRk5suraJfCXxxjvQWkq4prHTt2", name:"Chris", team:"CAR"},{uid:"Y80tDYo161XP915qXwjCDbMsZp82", name:"Phil", team:"IND"},{uid:"N0thoSRax0hgu4af2rbfHoykYAw1", name:"Jon", team:"DEN"},{uid:"53rC2vSu2jb2SYXXN4hzUDVgK2D2", name:"Neil", team:"TB"},{uid:"ePwyJgCBZDZaVY6V9zN058JicZB2", name:"Doug", team:"SF"},{uid:"46tRhEz00sWKtaEiU9fBsVtd2gJ3", name:"Jason", team:"BAL"},{uid:"1DJFVujDWmZIxCyRnCrjknIJVUa2", name:"David", team:"CHI"},{uid:"1DJFVujDWmZIxCyRnCrjknIJVUa2", name:"David", team:"OAK"},{uid:"46tRhEz00sWKtaEiU9fBsVtd2gJ3", name:"Jason", team:"MIN"},{uid:"Y80tDYo161XP915qXwjCDbMsZp82", name:"Doug", team:"PIT"},{uid:"53rC2vSu2jb2SYXXN4hzUDVgK2D2", name:"Neil", team:"DAL"},{uid:"N0thoSRax0hgu4af2rbfHoykYAw1", name:"Jon", team:"DET"},{uid:"Y80tDYo161XP915qXwjCDbMsZp82", name:"Phil", team:"HOU"},{uid:"kbRk5suraJfCXxxjvQWkq4prHTt2", name:"Chris", team:"NE"},{uid:"UHQdh2453WUslbc8LinFk4AGupi1", name:"Kelly", team:"CLE"},{uid:"UHQdh2453WUslbc8LinFk4AGupi1", name:"Kelly", team:"PHI"},{uid:"kbRk5suraJfCXxxjvQWkq4prHTt2", name:"Chris", team:"SEA"},{uid:"Y80tDYo161XP915qXwjCDbMsZp82", name:"Phil", team:"LAR"},{uid:"N0thoSRax0hgu4af2rbfHoykYAw1", name:"Jon", team:"GB"},{uid:"53rC2vSu2jb2SYXXN4hzUDVgK2D2", name:"Neil", team:"KC"},{uid:"ePwyJgCBZDZaVY6V9zN058JicZB2", name:"Doug", team:"ATL"},{uid:"46tRhEz00sWKtaEiU9fBsVtd2gJ3", name:"Jason", team:"LAC"},{uid:"1DJFVujDWmZIxCyRnCrjknIJVUa2", name:"David", team:"NO"},]
exports.writeDraft = functions.https.onCall((req, res) => {
  return admin.database().ref(`tmp/leaguespec/abqbl/draft/2019`).update(DRAFT)
})

/**
 * Draft a team. 
 * team: string the team to draft
 * league: the league we're drafting in
 * uidOverride: TEST ONLY - masquerade as a different user.
 */
exports.draftTeam = functions.https.onCall((data, context) => {
  const team = data.team;
  const league = data.league;
  const year = data.year;
  // Authentication / user information is automatically added to the request.
  const name = context.auth && context.auth.token.name || null;
  const uid = context.auth && context.auth.uid || data.uidOverride;

  const draftRef = `tmp/leaguespec/${league}/draft/${year}`;
  console.log(draftRef)
  return admin.database()
    .ref(draftRef)
    .once('value').then(data => {
      let draft = data.val();
      console.log(draft)
      for (let i = 0; i < draft.length; i++) {
        if (draft[i].team) {
          if (draft[i].team === team) {
            throw new functions.https.HttpsError(
              'invalid-argument', 'This team is already drafted.');
          }
          continue;
        }
        if (draft[i].uid != uid) {
          throw new functions.https.HttpsError(
            'invalid-argument', `It's not your turn. ${uid} ${draft[i].uid}`);
        } else {
          admin.database().ref(draftRef+`/${i}/team`).set(team);
          return;
        }
      }
    })
});
