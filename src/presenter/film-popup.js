import AbstractFilmPresenter from './abstract-film.js';
import FilmPopupView from '../view/film-popup.js';
import { render, remove, replace } from '../utils/render.js';

export default class FilmPopupPresenter extends AbstractFilmPresenter {
  constructor(container, handleFilmChange, callback) {
    super();
    this._popupContainer = container;
    this._filmPopupComponent = null;
    // _changeData и _handleControlButtons наследуются от AbstractFilmPresenter
    this._changeData = handleFilmChange;
    this._handleControlButtons = this._handleControlButtons.bind(this);

    this._clearPopup = callback;
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleClosePopupButton = this._handleClosePopupButton.bind(this);
  }

  init(film, comments) {
    this._film = film;
    this._comments = comments;
    const oldPopupComponent = this._filmPopupComponent;
    this._filmPopupComponent = new FilmPopupView(film, this._comments);
    // рендерим попап
    if (oldPopupComponent === null) {
      render(this._popupContainer, this._filmPopupComponent);
    } else {
      // если попап открыт перерисовываем
      const scrollY = oldPopupComponent.getElement().scrollTop;
      replace(oldPopupComponent, this._filmPopupComponent);
      this._filmPopupComponent.getElement().scrollTop = scrollY;
      remove(oldPopupComponent);
    }
    // навешиваем нужные классы и слушатели
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._handleEscKeyDown);
    this._filmPopupComponent.setCloseButtonClickHandler(this._handleClosePopupButton);
    this._filmPopupComponent.setControlButtonsClick(this._handleControlButtons);
  }

  // обработчик Esc
  _handleEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._removePopup();
    }
  }

  _removePopup() {
    remove(this._filmPopupComponent);
    this._filmPopupComponent = null;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._clearPopup();
  }

  // обработчик закрытия попапа
  _handleClosePopupButton() {
    this._removePopup();
  }
}
