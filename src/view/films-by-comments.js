import { createDomElement } from '../util.js';

const createFilmsByCommentsSection = () => {
  return `<section class="films-list films-list--extra films-list--most-commented">
  <h2 class="films-list__title">Most commented</h2>
  <div class="films-list__container"></div>
</section>`;
};

export default class FilmsByCommentsSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsByCommentsSection();
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

