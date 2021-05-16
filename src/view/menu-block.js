import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const LINK_CLASS = 'main-navigation__item';
const STATS_CLASS = 'main-navigation__additional';
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

export default class MenuBlock extends AbstractView {
  constructor(filters, state) {
    super();
    this._filters = filters;
    this._state = state;
    this._typeChangeHandler = this._typeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuBlock(this._filters, this._state);
  }

  setTypeChangeHandler(callback) {
    this._callback.filterClick = callback;
    this.getElement().addEventListener('click', this._typeChangeHandler);
  }

  _typeChangeHandler(evt) {
    const target = evt.target;
    const isTargetCorrect = target.classList.contains(LINK_CLASS) || target.classList.contains(STATS_CLASS);
    if (!isTargetCorrect) {
      return;
    }
    evt.preventDefault();
    const isActive = (link) => link.classList.contains(ACTIVE_CLASS);
    if (isActive(target)) {
      return;
    }

    this._callback.filterClick(target.dataset.type);
  }
}

