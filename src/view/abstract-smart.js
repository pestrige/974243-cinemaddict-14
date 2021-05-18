import Abstract from './abstract.js';

export default class AbstractSmart extends Abstract {
  constructor() {
    super();
    this._state = {};
  }

  updateElement() {
    const oldElement = this.getElement();
    const currentScroll = oldElement.scrollTop;
    const parent = oldElement.parentElement;

    this.removeElement();
    const newElement = this.getElement();
    parent.replaceChild(newElement, oldElement);
    newElement.scrollTop = currentScroll;
    this.restoreHandlers();
  }

  updateState(update) {
    if (!update) {
      return;
    }
    this._state = {...this._state, ...update};
    this.updateElement();
  }

  restoreHandlers() {
    throw new Error('Abstract method not implemented: resetHandlers');
  }
}
