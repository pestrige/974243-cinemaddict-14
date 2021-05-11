import AbstractSmartPresenter from './abstract-smart.js';
import FilmCardBlockView from '../view/film-card-block.js';
import { render, remove, replace } from '../utils/render.js';
//import { UPDATE_TYPE } from '../const.js';

export default class FilmPresenter extends AbstractSmartPresenter {
  constructor(container, handleFilmChange) {
    super();
    this._filmContainer = container;
    this._filmComponent = null;
    //_changeData и _handleControlButtons наследуются от AbstractFilmPresenter
    this._changeData = handleFilmChange;
    this._handleControlButtons = this._handleControlButtons.bind(this);
  }

  init(film) {
    this._film = film;
    const oldFilmComponent = this._filmComponent;

    this._filmComponent = new FilmCardBlockView(this._film);
    this._filmComponent.setControlButtonsClick(this._handleControlButtons);

    if (oldFilmComponent === null) {
      render(this._filmContainer, this._filmComponent);
      return;
    }

    replace(oldFilmComponent, this._filmComponent);
    remove(oldFilmComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }
}
