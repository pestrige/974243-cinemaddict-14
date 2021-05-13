import AbstractModel from './abstract-model.js';
import { FILTER_TYPE } from '../const.js';

export default class Menu extends AbstractModel {
  constructor() {
    super();
    this._activeFilter = FILTER_TYPE.all;
    this._isStatsActive = false;
    this._state = {
      activeFilter: FILTER_TYPE.all,
      isStatsActive: false,
    };
  }

  setState(updateType, linkType) {
    if (linkType === FILTER_TYPE.stats) {
      this._state.activeFilter = FILTER_TYPE.none;
      this._state.isStatsActive = true;
    } else {
      this._state.activeFilter = linkType;
      this._state.isStatsActive = false;
    }
    this._notify(updateType, this._state, this._state.isStatsActive);
  }

  getState() {
    return this._state;
  }

  getActiveFilter() {
    return this._state.activeFilter;
  }
}
