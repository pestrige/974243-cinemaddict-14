import { createDomElement } from '../util.js';

const createShowMoreButton = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ShowMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createShowMoreButton();
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
}
