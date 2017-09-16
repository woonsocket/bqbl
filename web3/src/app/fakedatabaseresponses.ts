const USER_ID = '30';

export function emptyDb() {
  return {
    'users': {},
    'leagues': {},
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
    'leagueId': 'nbqbl',
    'weeks': []
  };
}

export function emptyWeek () {
  return {
    'id': 'n/a',
    'teams': [
    {'name': 'CLE', 'selected': false},
    {'name': 'HOU', 'selected': false},
    {'name': 'NYJ', 'selected': false},
    {'name': 'CHI', 'selected': false},
    ]
  }
}

export class DefaultData {

  get() {
    let retVal = emptyDb();
    let user = emptyUser();
    user.weeks.push(emptyWeek());
    user.weeks.push(emptyWeek());

    retVal.leagues['nbqbl'] = nbqblLeague();
    retVal.users[USER_ID] = user;
    return retVal;
  }
}