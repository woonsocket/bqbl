import { Observable } from 'rxjs/Rx'

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
    const exists = !!data;
    this.data = data || {};
    this.data['$exists'] = () => exists;
    this.path = path;
  }

  // Call fn with a snapshot constructed from this.data
  subscribe(fn) {
    // TODO(harveyj): Figure out what's going on here
    // Ohhhhhh, this is an iterable...
    if (fn.next) {
      fn.next(new MockAngularFireDbSnapshot(this.data));
    } else {
      fn(new MockAngularFireDbSnapshot(this.data));
    }
  }

  set(obj: any) {
    console.log('SET:' + this.path + ' ' + obj);
    Object.assign(this.data, obj);
    return Promise.resolve();
  }

  map(fn: (x: any) => any): Observable<any> {
    return Observable.of(fn(this.data));
  }

  // NOTE(harveyj): I don't understand this. I had to mock it out because
  // template renderer's async stuff was expecting it to be there.
  take() {
    return this;
  }
}

// TODO: This whole class should probably just be an Observable, instead of
// implementing stubs for every Observable operator.
export class MockAngularFireDbListResponse {
  data = [];

  constructor(public path: string, data: any) {
    for (let key of Object.keys(data)) {
      data[key]['$key'] = key;
      this.data.push(data[key]);
    }
    this.path = path;
  }

  // Call fn with a snapshot constructed from this.data
  subscribe(fn) {
    // TODO(harveyj): Figure out what's going on here
    if (fn.next) {
      fn.next(this.data);
    } else {
      fn(this.data);
    }
  }

  map(fn: (x: any) => any): Observable<any> {
    return Observable.of(fn(this.data));
  }

  // NOTE(harveyj): I don't understand this. I had to mock it out because
  // template renderer's async stuff was expecting it to be there.
  take() {
    return this;
  }
}

export class MockAngularFireAuthState {
  constructor (public uid: string, public displayName: string) {}
}

export class MockAngularFireAuth {
  authState: Observable<MockAngularFireAuthState>;
  constructor(public uid: string, public displayName: string) {
    this.authState = Observable.of(new MockAngularFireAuthState(uid, displayName));
  }
}

export class MockAngularFireDb {
  data: {};
  constructor() {}

  object(path: string) : MockAngularFireDbResponse {
    let obj = this.getDbObject(path);
    return new MockAngularFireDbResponse(path, obj);
  }

  list(path: string) : MockAngularFireDbListResponse {
    let obj = this.getDbObject(path);
    return new MockAngularFireDbListResponse(path, obj);
  }

  private getDbObject(path:string) {
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
    return obj;
  }
}
