export class MockAngularFireDbSnapshot {

  // Take all of the fields of data and make them fields of the snapshot.
  // data: a plain Javascript object.
  constructor(data: any) {
    for (const prop in data) {
      if (data.hasOwnProperty(prop)) {
        this[prop] = data[prop];
      }
    }
  }

  $exists() {
    return true;
  }
}

export class MockAngularFireDbResponse {
  data: {};

  constructor(public path: string, data: any) {
    this.data = data;
    this.path = path;
  }

  // Call fn with a snapshot constructed from this.data
  subscribe(fn) {
    // TODO(harveyj): Figure out what's going on here
    if (fn.next) {
      fn.next(new MockAngularFireDbSnapshot(this.data));
    } else {
      fn(new MockAngularFireDbSnapshot(this.data));
    }
  }

  set(obj: any) {
    console.log('SET:' + this.path + ' ' + obj);
    Object.assign(this.data, obj);
  }

  // NOTE(harveyj): I don't understand this. I had to mock it out because
  // template renderer's async stuff was expecting it to be there.
  take() {
    return this;
  }
}

export class MockAngularFireDbListResponse {
  data: {};

  constructor(public path: string, data: any) {
    this.data = data;
    this.path = path;
  }

  // Call fn with a snapshot constructed from this.data
  subscribe(fn) {
    // TODO(harveyj): Figure out what's going on here
    if (fn.next) {
      fn.next(new MockAngularFireDbSnapshot(this.data));
    } else {
      fn(new MockAngularFireDbSnapshot(this.data));
    }
  }

  set(obj: any) {
    console.log('SET:' + this.path + ' ' + obj);
    Object.assign(this.data, obj);
  }

  // NOTE(harveyj): I don't understand this. I had to mock it out because
  // template renderer's async stuff was expecting it to be there.
  take() {
    return this;
  }
}

export class MockAngularFireAuthState {
  constructor (public uid: string, public displayName: string) {}

  subscribe(fn) {
    fn({
      'uid': this.uid,
      'displayName': this.displayName
    });
  }
}

export class MockAngularFireAuth {
  authState: MockAngularFireAuthState;
  constructor(public uid: string, public displayName: string) {
    this.authState = new MockAngularFireAuthState(uid, displayName);
  }
}

export class MockAngularFireDb {
  data: {};
  constructor() {}

  object(path: string) : MockAngularFireDbResponse {
    let obj = this.data;
    console.log('LOOKUP: ' + path);
    for (const pathFrag of path.split('/')) {
      if (!pathFrag) {
        continue; // Skip leading / and elide '//'
      }
      if (!obj[pathFrag]) {
        console.log(`PATH NOT FOUND: ${path}`);
      }
      obj = obj[pathFrag];
    }
    return new MockAngularFireDbResponse(path, obj);
  }

  list(path: string) : MockAngularFireDbListResponse {
    let obj = this.data;
    console.log('LOOKUP: ' + path);
    for (const pathFrag of path.split('/')) {
      if (!pathFrag) {
        continue; // Skip leading / and elide '//'
      }
      if (!obj[pathFrag]) {
        console.log(`PATH NOT FOUND: ${path}`);
      }
      obj = obj[pathFrag];
    }
    return new MockAngularFireDbListResponse(path, obj);
  }


}
