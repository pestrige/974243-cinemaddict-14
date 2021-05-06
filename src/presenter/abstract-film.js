import { BUTTON_TYPE, UPDATE_TYPE } from '../const.js';

export default class AbstractFilm {
  constructor() {
    this._changeData = null;
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
      case BUTTON_TYPE.watchlist:
        changedUserDetails.isWatchlisted = !this._film.userDetails.isWatchlisted;
        break;
      case BUTTON_TYPE.history:
        changedUserDetails.isWatched = !this._film.userDetails.isWatched;
        break;
      case BUTTON_TYPE.favorite:
        changedUserDetails.isFavorite = !this._film.userDetails.isFavorite;
        break;
    }

    // и передаем объект с измененными данными фильма
    this._changeData(UPDATE_TYPE.minor, {...this._film, userDetails: changedUserDetails});
  }
}
