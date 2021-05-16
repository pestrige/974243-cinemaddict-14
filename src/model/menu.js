import AbstractModel from './abstract-model.js';
import { FilterType } from '../const.js';

export default class Menu extends AbstractModel {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
    this._isStatsActive = false;
    this._state = {
      activeFilter: FilterType.ALL,
      isStatsActive: false,
    };
  }

  setState(updateType, linkType) {
    if (linkType === FilterType.STATS) {
      this._state.activeFilter = FilterType.NONE;
      this._state.isStatsActive = true;
    } else {
      this._state.activeFilter = linkType;
      this._state.isStatsActive = false;
    }
    this._notify(updateType, this._state, {statsFlag: this._state.isStatsActive});
  }

  getState() {
    return this._state;
  }

  getActiveFilter() {
    return this._state.activeFilter;
  }
}
