const admin = require('firebase-admin');
const entries = require('object.entries');
const functions = require('firebase-functions');

exports.copyFromTmp = functions.https.onCall((data, context) => {
  const path = data.path;

  return admin.database()
    .ref(`/tmp/${path}`)
    .once('value').then(data => {
      admin.database().ref(`/${path}`).update(data.val())
    })
})

exports.portStartsNewFormat = functions.https.onCall((data, context) => {
  const toYear = data.toYear;

  return admin.database()
    .ref(`tmp/users/`)
    .once('value').then(data => {
      const users = Object.entries(data.val());
      let leagues = {};
      leagueMap = { "-KtE306q7vKIIgOgMbZM": 'abqbl', "-KtC8hcGgvbh2W2Tq79n": 'nbqbl' }
      const weeks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];
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

exports.makeDuplicateUser = functions.https.onCall(({league, year, fromUid, toUid}, context) => {
  console.log(`/leaguespec/${league}/plays/${year}/${fromUid}`);
  return admin.database()
    .ref(`/leaguespec/${league}/plays/${year}/${fromUid}`)
    .once('value').then(data => {
      admin.database().ref(`/leaguespec/${league}/plays/${year}/${toUid}`).set(data.val())
    })
})
