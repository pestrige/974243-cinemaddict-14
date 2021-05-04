import AbstractView from './abstract.js';
import { FILTER_TYPE } from '../const.js';

const createFiltersBlock = (filters, activeFilter) => {
  const [watchlisted, watched, favorite] = filters;
  const activeClass = 'main-navigation__item--active';

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item ${activeFilter === FILTER_TYPE.all ? activeClass : ''}" data-type="all">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${activeFilter === FILTER_TYPE.watchlist ? activeClass : ''}" data-type="watchlist">Watchlist <span class="main-navigation__item-count">${watchlisted}</span></a>
    <a href="#history" class="main-navigation__item ${activeFilter === FILTER_TYPE.history ? activeClass : ''}" data-type="history">History <span class="main-navigation__item-count">${watched}</span></a>
    <a href="#favorites" class="main-navigation__item ${activeFilter === FILTER_TYPE.favorites ? activeClass : ''}" data-type="favorites">Favorites <span class="main-navigation__item-count">${favorite}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional">Stats</a>
</nav>`;
};

export default class FiltersBlock extends AbstractView {
  constructor(filters, activeFilter) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersBlock(this._filters, this._activeFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterClick(evt.target.dataset.type);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}

