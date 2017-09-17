const USER_ID = '30';

export function emptyDb() {
  return {
    'users': {},
    'leagues': {},
    'scores': {},
    'unlockedweeks': [{}]
  }
};

export function nbqblLeague() {
  return {
    'dh': false,
    'maxPlays': 1
  };
}

export function emptyUser () {
  return {
    'name': 'Blaine',
    'leagueId': 'nbqbl',
    'weeks': []
  };
}

export function emptyWeek (id: string) {
  return {
    'id': id,
    'teams': [
    {'name': 'CLE', 'selected': false},
    {'name': 'HOU', 'selected': false},
    {'name': 'NYJ', 'selected': false},
    {'name': 'CHI', 'selected': false},
    ]
  }
}

export function emptyScores () {
  return {
    'CLE': {total:30, projection: {total: 1}, gameInfo: {clock: "Final"}}, 
    'HOU': {total:31, projection: {total: 2}, gameInfo: {clock: "Final"}}, 
    'NYJ': {total:32, projection: {total: 3}, gameInfo: {clock: "Final"}}, 
    'CHI': {total:33, projection: {total: 4}, gameInfo: {clock: "Final"}}, 
  }
}

export class DefaultData {

  get() {
    let retVal = emptyDb();
    let user = emptyUser();
    user.weeks.push(emptyWeek('1'));
    user.weeks.push(emptyWeek('2'));

    retVal.scores['2017'] = {};
    retVal.scores['2017']['1'] = emptyScores();
    retVal.leagues['nbqbl'] = nbqblLeague();
    retVal.users[USER_ID] = user;
    return retVal;
  }
}