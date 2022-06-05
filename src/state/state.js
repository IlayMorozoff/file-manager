export class State {

  #state;
  constructor(data) {
    this.#state = data;
  }

  setState(data) {
    this.#state = {
      ...this.#state,
      ...data
    };
  }

  getState() {
    return this.#state;
  }

}