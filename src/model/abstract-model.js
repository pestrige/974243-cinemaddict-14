import Api from './api.js';

export default class AbstractModel extends Api {
  constructor() {
    super();
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((item) => item !== observer);
  }

  _notify(event, update, payload) {
    this._observers.forEach((observer) => observer(event, update, payload));
  }
}
