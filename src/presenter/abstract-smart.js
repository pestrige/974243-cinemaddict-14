import { UpdateType } from '../const.js';

const ButtonType = {
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorite',
};

export default class AbstractSmart {
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
      case ButtonType.WATCHLIST:
        changedUserDetails.isWatchlisted = !this._film.userDetails.isWatchlisted;
        break;
      case ButtonType.HISTORY:
        changedUserDetails.isWatched = !this._film.userDetails.isWatched;
        break;
      case ButtonType.FAVORITE:
        changedUserDetails.isFavorite = !this._film.userDetails.isFavorite;
        break;
    }

    // и передаем объект с измененными данными фильма
    this._changeData(UpdateType.MINOR, {...this._film, userDetails: changedUserDetails});
  }
}
