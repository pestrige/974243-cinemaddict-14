// export default class Observer {
//   constructor() {
//     this._observers = [];
//   }

//   addObserver(observer) {
//     this._observers.push(observer);
//   }

//   removeObserver(observer) {
//     this._observers = this._observers.filter((item) => item !== observer);
//   }

//   _notify(event, update, payload) {
//     this._observers.forEach((observer) => observer(event, update, payload));
//   }
// }

export const observerMixin = (superclass) => class extends superclass {
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
};
