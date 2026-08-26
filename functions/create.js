const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions/v1');

/**
 * Throws if the caller isn't signed in as one of the admins listed at
 * /roles/admins in the database -- the same check database.rules.json uses
 * for admin-only writes.
 */
async function requireAdmin(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 'You must be signed in to do this.');
  }
  const snapshot = await admin.database()
    .ref(`/roles/admins/${context.auth.uid}`).once('value');
  if (!snapshot.exists()) {
    throw new functions.https.HttpsError(
      'permission-denied', 'You must be an admin to do this.');
  }
}

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
 * Create (or add a season to) a league spec at /leaguespec/{LEAGUEID}. 
 *
 * leagueId: string
 * year: year to populate the settings for
 */
function ensureLeagueSettings(leagueId, year) {
  return admin.database().ref(`/leaguespec/${leagueId}/id`).set(leagueId)
    .then(() => admin.database()
      .ref(`/leaguespec/${leagueId}/settings/${year}`).set({ dh: false }));
}

exports.createLeague = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);
  return ensureLeagueSettings(data.league, data.year);
});

/**
 * Bootstrap a new season for a league: copies the roster forward from the
 * previous year's finalized users, creates the year's settings, and deals
 * out an empty draft board (order set, teams left blank) for those players.
 * Requires the previous year to already have a roster to copy.
 *
 * league: string
 * year: string, the new year to set up
 */
exports.startNewYear = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);
  const league = data.league;
  const year = data.year;
  const prevYear = String(Number(year) - 1);

  return admin.database().ref(`/leaguespec/${league}/users/${prevYear}`)
    .once('value')
    .then(snapshot => {
      const prevUsers = snapshot.val();
      if (!prevUsers) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          `No roster found for ${league} in ${prevYear} to copy forward.`);
      }
      const roster = Object.values(prevUsers).map(
        u => ({ name: u.name, uid: u.uid }));
      return Promise.all([
        ensureLeagueSettings(league, year),
        admin.database().ref(`/leaguespec/${league}/users/${year}`).set(roster),
      ]).then(() => roster);
    })
    .then(roster => { 
      const shuffledUsers = shuffle([...roster]);
      const shuffledUsersReverse = [...shuffledUsers].reverse();
      // Snake order
      const order = shuffledUsers.concat(shuffledUsersReverse, shuffledUsers, shuffledUsersReverse);
      return admin.database().ref(`/leaguespec/${league}/draft/${year}`).set(order);
    });
});

/**
 * Fill every slot of an existing (empty) draft board with a team, in random
 * order, as if the whole league had drafted all 32 NFL teams. Overwrites any
 * team assignments already present in the draft board.
 *
 * league: string
 * year: string
 * teams: array of team abbreviations, one per draft slot
 */
exports.randomizeDraft = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);
  const league = data.league;
  const year = data.year;
  const teams = data.teams;
  const draftRef = admin.database().ref(`/leaguespec/${league}/draft/${year}`);

  return draftRef.once('value').then(snapshot => {
    const draft = snapshot.val();
    if (!draft) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        `No draft board exists for ${league} in ${year} yet.`);
    }
    if (!Array.isArray(teams) || teams.length !== draft.length) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        `Expected ${draft.length} teams to fill the draft board, got ` +
        `${Array.isArray(teams) ? teams.length : teams}.`);
    }
    const shuffledTeams = shuffle([...teams]);
    const updates = {};
    for (let i = 0; i < draft.length; i++) {
      updates[`${i}/team`] = shuffledTeams[i];
    }
    return draftRef.update(updates);
  });
});

exports.finalizeDraft = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);
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
exports.createNewYear = functions.https.onCall(async (data, context) => {
  await requireAdmin(context);
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