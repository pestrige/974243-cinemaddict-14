import AbstractSmartPresenter from './abstract-smart.js';
import FilmCardBlockView from '../view/film-card-block.js';
import { render, remove, replace } from '../utils/render.js';

export default class FilmPresenter extends AbstractSmartPresenter {
  constructor(container, handleFilmChange) {
    super();
    this._container = container;
    this._component = null;
    //_changeData и _handleControlButtons наследуются от AbstractSmartPresenter
    this._changeData = handleFilmChange;
    this._handleControlButtons = this._handleControlButtons.bind(this);
  }

  init(film) {
    this._film = film;
    const oldComponent = this._component;

    this._component = new FilmCardBlockView(this._film);
    this._component.setControlButtonsClick(this._handleControlButtons);

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
