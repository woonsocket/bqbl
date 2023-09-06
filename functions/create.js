const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions');

exports.addPlayerToLeague = functions.https.onCall((data, context) => {
  const league = data.league;
  const name = data.name;
  const uid = data.uid;
  const year = data.year;

  return admin.database().ref(`/leaguespec/${league}/users/${year}`).once('value').then(
    dataPromise => {
      let users = dataPromise.val();
      users.push({ name: name, uid: uid });
      return admin.database().ref(`/leaguespec/${league}/users/${year}`).set(users)
    }
  )
})

/**
 * Read in the users at /leaguespec/{LEAGUE}/users/{YEAR}.
 * Write a randomized draft order to /leaguespec/${LEAGUE}/draft/${YEAR}
 * 
 * league: string
 * year: string, year to populate the settings for
 */
exports.setDraftOrder = functions.https.onCall((data, context) => {
  const league = data.league;
  const year = data.year;
  return admin.database().ref(`/leaguespec/${league}/users/${year}`).once('value').then(
    dataPromise => {
      let filteredUsers = dataPromise.val().map(item => { return { uid: item.uid, name: item.name } });
      let shuffledUsers = shuffle(filteredUsers);
      const shuffledUsersReverse = [...shuffledUsers].reverse();
      let order = shuffledUsers.concat(shuffledUsersReverse, shuffledUsers, shuffledUsersReverse);
      return admin.database().ref(`/leaguespec/${league}/draft/${year}`).set(order)
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
  const year = data.year;

  const leagueRef = admin.database().ref(`/leaguespec/${leagueId}`);
  const stubLeague = {
    id: leagueId,
    settings: {}
  };
  stubLeague["settings"][year] = { dh: false };
  return leagueRef.set(stubLeague);
});

exports.finalizeDraft = functions.https.onCall((data, context) => {
  const leagueId = data.league;
  const year = data.year;
  return admin.database()
    .ref(`/leaguespec/${leagueId}/draft/${year}`)
    .once('value').then(data => {
      const draft = data.val();
      let users = {};
      for (const draftItem of draft) {
        users[draftItem.uid] = users[draftItem.uid] || { teams: [], name: draftItem.name, uid: draftItem.uid };
        users[draftItem.uid].teams.push({ name: draftItem.team })
      }
      const usersRef = admin.database().ref(
        `/leaguespec/${leagueId}/users/${year}/`);
      usersRef.set(users);
    })
});

/**
 * Read in a league spec from /leaguespec/{LEAGUEID}.
 * Write out all of the starts for that league.
 */
exports.createNewYear = functions.https.onCall((data, context) => {
  const league = data.league;
  const year = data.year;
  return admin.database()
    .ref(`/leaguespec/${league}/users/${year}`)
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
        const yearRef = admin.database().ref(
          `/leaguespec/${league}/plays/${year}/${user.uid}`);
        yearRef.set(allWeeks);
      }
    })
});

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

  const draftRef = `/leaguespec/${league}/draft/${year}`;
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
          admin.database().ref(draftRef + `/${i}/team`).set(team);
          return;
        }
      }
    })
});