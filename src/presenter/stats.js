import StatsView from '../view/stats.js';
import { remove, render, replace } from '../utils/render.js';
import { filter } from '../utils/common.js';
import { FilterType } from '../const.js';

export default class Stats {
  constructor(container, filmsModel) {
    this._films = filmsModel.get();
    this._container = container;
    this._component = null;
  }

  init() {
    const oldComponent = this._component;
    this._component = new StatsView(filter[FilterType.HISTORY](this._films));

    if (oldComponent === null) {
      render(this._container, this._component);
      return;
    }

    replace(oldComponent, this._component);
    remove(oldComponent);
  }

  destroy() {
    remove(this._component);
  }
}
