export class State {
  constructor(data) {
    this.state = data;
  }

  setState(newData) {
    this.state = {
      ...this.state,
      ...newData
    };
  }

  getState() {
    return this.state;
  }

}