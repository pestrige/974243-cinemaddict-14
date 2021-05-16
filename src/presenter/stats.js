import StatsView from '../view/stats.js';
import { remove, render, replace } from '../utils/render.js';
import { filter } from '../utils/common.js';
import { FilterType } from '../const.js';

export default class Stats {
  constructor(container, filmsModel) {
    this._films = filmsModel.getFilms();
    this._container = container;
    this._statsComponent = null;
  }

  init() {
    const oldStatsComponent = this._statsComponent;
    this._statsComponent = new StatsView(filter[FilterType.HISTORY](this._films));

    if (oldStatsComponent === null) {
      render(this._container, this._statsComponent);
      return;
    }

    replace(oldStatsComponent, this._statsComponent);
    remove(oldStatsComponent);
  }

  destroy() {
    remove(this._statsComponent);
  }
}
