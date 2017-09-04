
export let fakeAuthState = {
  'uid': '30',
  'displayName': 'Harvey'
};

export let mockAngularFireAuth = {
  'authState': {
    'uid': '30',
    subscribe: function(fn) {
      fn(fakeAuthState);
    }
  }
};