import AbstractSmartPresenter from './abstract-smart.js';
import FilmPopupView from '../view/film-popup.js';
import { render, remove } from '../utils/render.js';
import { UPDATE_TYPE, API_URL } from '../const.js';

export default class FilmPopupPresenter extends AbstractSmartPresenter {
  constructor(container, commentsModel, handleFilmChange, callback) {
    super();
    this._commentsModel = commentsModel;
    this._comments = null;
    this._popupContainer = container;
    this._filmPopupComponent = null;
    this._scrollTop = 0;
    // _changeData и _handleControlButtons наследуются от AbstractFilmPresenter
    this._changeData = handleFilmChange;
    this._handleControlButtons = this._handleControlButtons.bind(this);

    this._clearPopup = callback;
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleClosePopupButton = this._handleClosePopupButton.bind(this);
    this._handleDeleteCommentButton = this._handleDeleteCommentButton.bind(this);
    this._handleCommentFormSubmit = this._handleCommentFormSubmit.bind(this);
  }

  init(film) {
    this._film = film;
    if (!this._comments) {
      this._commentsModel.getData(`${API_URL.comments}/${this._film.filmInfo.id}`)
        .then((comments) => {
          this._commentsModel.setComments(comments);
          this._comments = this._commentsModel.getComments();
          this._renderPopup();
        });
    } else {
      this._renderPopup();
    }
  }

  _renderPopup() {
    const oldPopupComponent = this._filmPopupComponent;
    this._filmPopupComponent = new FilmPopupView(this._film, this._comments);
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
    this._filmPopupComponent.setCommentsListClickHandler(this._handleDeleteCommentButton);
    this._filmPopupComponent.setCommentsFormKeydownHandler(this._handleCommentFormSubmit);
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
    this._comments = null;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._clearPopup();
  }

  // обработчик закрытия попапа
  _handleClosePopupButton() {
    this._removePopup();
  }

  // обновляет модель комментариев
  _handleDeleteCommentButton(commentId, film) {
    this._commentsModel.deleteComment(UPDATE_TYPE.minor, commentId, film);
  }

  _handleCommentFormSubmit(text, emoji, film) {
    this._commentsModel.createComment(UPDATE_TYPE.minor, text, emoji, film);
  }
}
