import AbstractSmartPresenter from './abstract-smart.js';
import FilmPopupView from '../view/film-popup.js';
import { render, remove } from '../utils/render.js';
import { UPDATE_TYPE, API_URL } from '../const.js';

export default class FilmPopupPresenter extends AbstractSmartPresenter {
  constructor(container, commentsModel, handleFilmChange, clearPopupCallback) {
    super();
    this._commentsModel = commentsModel;
    this._comments = null;
    this._popupContainer = container;
    this._filmPopupComponent = null;
    this._scrollTop = 0;
    // _changeData и _handleControlButtons наследуются от AbstractSmartPresenter
    this._changeData = handleFilmChange;
    this._handleControlButtons = this._handleControlButtons.bind(this);

    this._clearPopup = clearPopupCallback;
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleClosePopupButton = this._handleClosePopupButton.bind(this);
    this._handleDeleteCommentButton = this._handleDeleteCommentButton.bind(this);
    this._handleCommentFormSubmit = this._handleCommentFormSubmit.bind(this);
  }

  init(film) {
    this._film = film;
    this._commentsModel.getData(`${API_URL.comments}/${this._film.filmInfo.id}`)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._comments = this._commentsModel.getComments();
        this._renderPopup();
      })
      .catch((error) => {
        const errorMsg = error.message;
        this._commentsModel.setComments([]);
        this._comments = this._commentsModel.getComments();
        this._renderPopup({ isLoadError: true, errorMsg });
      });
  }

  _renderPopup(error = {}) {
    const oldPopupComponent = this._filmPopupComponent;
    this._filmPopupComponent = new FilmPopupView(this._film, this._comments, error);
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
    this._filmPopupComponent.setControlButtonsClickHandler(this._handleControlButtons);
    this._filmPopupComponent.setCommentsListClickHandler(this._handleDeleteCommentButton);
    this._filmPopupComponent.setCommentsFormKeydownHandler(this._handleCommentFormSubmit);
  }

  _removePopup() {
    remove(this._filmPopupComponent);
    this._filmPopupComponent = null;
    this._comments = null;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._clearPopup();
  }

  _setSavingState() {
    this._filmPopupComponent.updateState({
      isSaving: true,
    });
  }

  _setDeletingState(commentID) {
    this._filmPopupComponent.updateState({
      isDeleting: true,
      deletingCommentID: commentID,
    });
  }

  shake(commentID = null) {
    const resetState = () => {
      this._filmPopupComponent.updateState({
        isDeleting: false,
        isSaving: false,
        deletingCommentID: null,
      });
    };
    const elementClass = commentID
      ? `.film-details__comment[data-id='${commentID}']`
      : '.film-details__new-comment';
    const element = this._filmPopupComponent.getElement()
      .querySelector(elementClass);

    this._filmPopupComponent.shake(element, resetState);
  }

  // обработчик Esc
  _handleEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._removePopup();
    }
  }

  // обработчик закрытия попапа
  _handleClosePopupButton() {
    this._removePopup();
  }

  // обновляет модель комментариев
  _handleDeleteCommentButton(commentId, film) {
    this._setDeletingState(commentId);
    this._commentsModel.deleteComment(UPDATE_TYPE.patch, commentId, film);
  }

  _handleCommentFormSubmit(text, emoji, film) {
    this._setSavingState();
    //this._removeHandlers();
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._filmPopupComponent.removeCloseButtonClickHandler();
    this._filmPopupComponent.removeControlButtonsClickHandler();
    this._filmPopupComponent.removeCommentsListClickHandler();
    this._filmPopupComponent.removeCommentsFormKeydownHandler();

    this._commentsModel.createComment(UPDATE_TYPE.patch, text, emoji, film);
  }
}
