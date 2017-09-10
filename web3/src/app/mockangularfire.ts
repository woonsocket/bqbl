
export let fakeAuthState = {
  'uid': '30',
  'displayName': 'Harvey'
};

export class MockAngularFireDbSnapshot {  
  constructor(data: any) {
    for (let prop in data) {
      this[prop] = data[prop];
    }
  }

  $exists() {
    return true;
  } 
};

export class MockAngularFireDbResponse {
  data: {};

  constructor(data: any) {
    this.data = data;
  }

  subscribe(fn) {
    // TODO(harveyj): Figure out what's going on here
    if (fn.next) {
      fn.next(new MockAngularFireDbSnapshot(this.data));
    } else {
      fn(new MockAngularFireDbSnapshot(this.data));
    }
  }

  take() {
    return this;
  } 
}; 

export let mockAngularFireAuth = {
  'authState': {
    'uid': '30',
    subscribe: function(fn) {
      fn(fakeAuthState);
    }
  }
};

export class MockAngularFireDb {
  data: {};
  constructor() {
    this.data = {
      'users': {
        '30': {
          'leagueId': 'nbqbl',
          'weeks': [{
            'id': '1',
            'teams': [
              {'name': 'CLE', 'selected': false},
              {'name': 'HOU', 'selected': true},
              {'name': 'NYJ', 'selected': true},
              {'name': 'CHI', 'selected': false},
            ]
          }]
        }
      },
      'leagues': {
        'nbqbl': {
          'dh': false,
          'maxPlays': 13
        }
      },
    };
  }

  object(path: string) {
    let obj = this.data;
    console.log('LOOKUP: ' + path);
    for (let pathFrag of path.split('/')) {
      if (!pathFrag) {
        continue; // Skip leading / and elide '//'
      }
      if (!obj[pathFrag]) {
        console.log(`PATH NOT FOUND: ${path}`);
      }
      obj = obj[pathFrag];
    } 
    return new MockAngularFireDbResponse(obj);
  }


};