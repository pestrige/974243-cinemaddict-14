import { createDomElement } from '../utils/render.js';

const ANIMATION_DURATION = 600;

export default class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract class, only concrete one.');
    }
    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: ${this.getTemplate.name}`);
  }

  getElement() {
    if (!this._element) {
      this._element = createDomElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  shake(element, callback) {
    element.style.animation = `shake ${ANIMATION_DURATION / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, ANIMATION_DURATION);
  }
}
