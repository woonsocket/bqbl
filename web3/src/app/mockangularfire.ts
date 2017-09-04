
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

export let mockAngularFireDb = {
  'object': function () {
    console.log("hello");
    return {
      subscribe: function(fn) {
        fn({'$exists': _ => {return true;}});
      }
    }
  }
};