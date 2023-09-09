import store from './store'

export function isInLeague(uid, year) {
  const uids = Object.keys(store.league.spec.users[year]);
  return uids.indexOf(uid) !== -1;
}

export function hasDh(leagueSpec, year) {
  if (leagueSpec && leagueSpec['settings'] && leagueSpec['settings'][year]) {
    return leagueSpec['settings'][year].dh;
  }
  return false;
}