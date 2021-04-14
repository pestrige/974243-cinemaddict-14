import { createDomElement } from '../util.js';

const createFooterStats = (filmsCount) => {
  return `<p>${filmsCount} movies inside</p>`;
};

export default class FooterStats {
  constructor(films) {
    this._element = null;
    this._filmsCount = films.length;
  }

  getTemplate() {
    return createFooterStats(this._filmsCount);
  }

  getElement() {
    if(!this._element) {
      this._element = createDomElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
