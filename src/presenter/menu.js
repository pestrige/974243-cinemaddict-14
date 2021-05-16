import MenuBlockView from '../view/menu-block.js';
import { generateFilteredFilmsCounts } from '../utils/common.js';
import { render, replace, remove } from '../utils/render.js';
import { UpdateType } from '../const.js';

export default class MenuPresenter {
  constructor(container, menuModel, filmsModel) {
    this._container = container;
    this._menuModel = menuModel;
    this._filmsModel = filmsModel;

    this._component = null;

    this._handleTypeChange = this._handleTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._menuModel.addObserver(this._handleModelEvent);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  _getFiltersCount() {
    const films = this._filmsModel.get();
    return generateFilteredFilmsCounts(films);
  }

  init() {
    const oldComponent = this._component;
    this._component = new MenuBlockView(this._getFiltersCount(), this._menuModel.getState());
    this._component.setTypeChangeHandler(this._handleTypeChange);
    if (oldComponent === null) {
      render(this._container, this._component);
      return;
    }
    replace(oldComponent, this._component);
    remove(oldComponent);
  }

  _handleTypeChange(linkType) {
    this._menuModel.setState(UpdateType.MAJOR, linkType);
  }

  _handleModelEvent() {
    this.init();
  }
}
