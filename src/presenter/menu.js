import FiltersBlockView from '../view/menu-block.js';
import { generateFilteredFilmsCounts } from '../utils/common.js';
import { render, replace, remove } from '../utils/render.js';
import { UpdateType } from '../const.js';

export default class FilterPresenter {
  constructor(container, menuModel, filmsModel) {
    this._container = container;
    this._menuModel = menuModel;
    this._filmsModel = filmsModel;

    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._menuModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FiltersBlockView(this._getFiltersCount(), this._menuModel.getState());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    if (oldFilterComponent === null) {
      render(this._container, this._filterComponent);
      return;
    }
    replace(oldFilterComponent, this._filterComponent);
    remove(oldFilterComponent);
  }

  _getFiltersCount() {
    const films = this._filmsModel.getFilms();
    return generateFilteredFilmsCounts(films);
  }

  _handleFilterTypeChange(linkType) {
    this._menuModel.setState(UpdateType.MAJOR, linkType);
  }

  _handleModelEvent() {
    this.init();
  }
}
