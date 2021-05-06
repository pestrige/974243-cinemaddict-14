import FiltersBlockView from '../view/filters-block.js';
import { generateFilteredFilmsCounts } from '../utils/common.js';
import { render, replace, remove } from '../utils/render.js';
import { UPDATE_TYPE } from '../const.js';

export default class FilterPresenter {
  constructor(container, filtersModel, filmsModel) {
    this._container = container;
    this._filtersModel = filtersModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filtersModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FiltersBlockView(this._getFilters(), this._filtersModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    if (oldFilterComponent === null) {
      render(this._container, this._filterComponent);
      return;
    }
    replace(oldFilterComponent, this._filterComponent);
    remove(oldFilterComponent);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();
    return generateFilteredFilmsCounts(films);
  }

  _handleFilterTypeChange(filterType) {
    if (filterType === this._filtersModel.getFilter()) {
      return;
    }
    this._filtersModel.setFilter(UPDATE_TYPE.major, filterType);
  }

  _handleModelEvent() {
    this.init();
  }
}
