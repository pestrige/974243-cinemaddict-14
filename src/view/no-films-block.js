import { createDomElement } from '../util.js';

const createNoFilmsBlock = () => {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
};

export default class ShowMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createNoFilmsBlock();
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
