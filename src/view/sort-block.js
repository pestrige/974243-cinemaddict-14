import { createDomElement } from '../util.js';

const createSortBlock = () => {
  return `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
</ul>`;
};

export default class SortBlock {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortBlock();
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

