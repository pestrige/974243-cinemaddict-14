import AbstractFilmPresenter from './abstract-film.js';
import FilmPopupView from '../view/film-popup.js';
import { render, remove } from '../utils/render.js';

export default class FilmPopupPresenter extends AbstractFilmPresenter {
  constructor(container, handleFilmChange, callback) {
    super();
    this._popupContainer = container;
    this._filmPopupComponent = null;
    this._scrollTop = 0;
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
    // если попап открыт, удаляем и сохраняем позицию скролла
    if (oldPopupComponent !== null) {
      this._scrollTop = oldPopupComponent.getElement().scrollTop;
      remove(oldPopupComponent);
    }
    // рендерим попап
    render(this._popupContainer, this._filmPopupComponent);
    this._filmPopupComponent.getElement().scrollTop = this._scrollTop;
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
