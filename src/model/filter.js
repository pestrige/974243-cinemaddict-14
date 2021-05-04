import Observer from '../utils/observer.js';
import { FILTER_TYPE } from '../const.js';

export default class Filters extends Observer {
  constructor() {
    super();
    this._activeFilter = FILTER_TYPE.all;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
