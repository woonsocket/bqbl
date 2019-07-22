
class FakeReference {
  constructor(data) {
    this.data = data;
  }

  once() {
    return new FakeSnapshot(this.data);
  }
}

class FakeSnapshot {
  constructor(data) {
    this.data = data;
  }

  val() {
    return this.data;
  }
}

export default FakeReference;