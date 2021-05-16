import AbstractView from './abstract.js';
import { FilterType } from '../const.js';
const ACTIVE_CLASS = 'main-navigation__item--active';

const createMenuBlock = (filters, {activeFilter, isStatsActive}) => {
  const [watchlisted, watched, favorite] = filters;

  return `<nav class="main-navigation">
  <div class="main-navigation__items">
    <a href="#all" class="main-navigation__item ${activeFilter === FilterType.ALL ? ACTIVE_CLASS : ''}" data-type="all">All movies</a>
    <a href="#watchlist" class="main-navigation__item ${activeFilter === FilterType.WATCHLIST ? ACTIVE_CLASS : ''}" data-type="watchlist">Watchlist <span class="main-navigation__item-count">${watchlisted}</span></a>
    <a href="#history" class="main-navigation__item ${activeFilter === FilterType.HISTORY ? ACTIVE_CLASS : ''}" data-type="history">History <span class="main-navigation__item-count">${watched}</span></a>
    <a href="#favorites" class="main-navigation__item ${activeFilter === FilterType.FAVORITE ? ACTIVE_CLASS : ''}" data-type="favorites">Favorites <span class="main-navigation__item-count">${favorite}</span></a>
  </div>
  <a href="#stats" class="main-navigation__additional ${isStatsActive ? ACTIVE_CLASS : ''}" data-type="stats">Stats</a>
</nav>`;
};

export default class FiltersBlock extends AbstractView {
  constructor(filters, filterState) {
    super();
    this._filters = filters;
    this._filterState = filterState;
    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuBlock(this._filters, this._filterState);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    const isActive = (link) => link.classList.contains(ACTIVE_CLASS);
    if (isActive(evt.target)) {
      return;
    }
    this._callback.filterClick(evt.target.dataset.type);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}

