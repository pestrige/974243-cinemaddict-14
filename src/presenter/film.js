import FilmCardBlockView from '../view/film-card-block.js';
import { render, remove, replace } from '../utils/render.js';
import { BUTTON_TYPE } from '../const.js';

export default class FilmPresenter {
  constructor(container, handleFilmChange) {
    this._filmContainer = container;
    this._changeData = handleFilmChange;
    this._filmComponent = null;
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

  _handleControlButtons(evt) {
    const buttonType = evt.target.dataset.type;
    // делаем копию данных фильма
    const changedUserDetails = {...this._film.userDetails};

    if (!buttonType) {
      return;
    }
    // изменяем ключи на противоположное значение
    // в зависимости от типа кнопки
    switch (buttonType) {
      case BUTTON_TYPE.watchlisted:
        changedUserDetails.isWatchlisted = !this._film.userDetails.isWatchlisted;
        break;
      case BUTTON_TYPE.watched:
        changedUserDetails.isWatched = !this._film.userDetails.isWatched;
        break;
      case BUTTON_TYPE.favorite:
        changedUserDetails.isFavorite = !this._film.userDetails.isFavorite;
        break;
    }

    // и передаем объект с измененными данными фильма
    this._changeData({...this._film, userDetails: changedUserDetails});
  }
}
