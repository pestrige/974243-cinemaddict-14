import FilmCardBlockView from '../view/film-card-block.js';
import { render, remove } from '../utils/render.js';

export default class FilmPresenter {
  constructor(container) {
    this._filmContainer = container;
    this._filmComponent = null;
    this._handleWatchlistButton = this._handleWatchlistButton.bind(this);
  }

  init(film) {
    if (!(this._filmComponent === null)) {
      remove(this._filmComponent);
    }
    this._filmComponent = new FilmCardBlockView(film);
    render(this._filmContainer, this._filmComponent);
    this._filmComponent.setWatchlistButtonClick(this._handleWatchlistButton);
  }

  destroy() {
    remove(this._filmComponent);
  }

  _handleWatchlistButton(evt) {
    console.log(evt.target);
  }
}
