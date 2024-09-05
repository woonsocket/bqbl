import * as R from 'ramda';

export function isInLeague(leagueSpec, uid, year) {
  let users = R.path([ 'users', year], leagueSpec) || {}
  return uid in users;
}

export function hasDh(leagueSpec, year) {
  return R.path(['settings', year, 'dh'], leagueSpec) || false;
}
