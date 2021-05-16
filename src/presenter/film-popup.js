import AbstractSmartPresenter from './abstract-smart.js';
import FilmPopupView from '../view/film-popup.js';
import { render, remove } from '../utils/render.js';
import { UpdateType, ApiUrl } from '../const.js';

export default class FilmPopupPresenter extends AbstractSmartPresenter {
  constructor(container, commentsModel, handleFilmChange, clearCallback) {
    super();
    this._commentsModel = commentsModel;
    this._comments = null;
    this._container = container;
    this._component = null;
    this._scrollTop = 0;
    // _changeData и _handleControlButtons наследуются от AbstractSmartPresenter
    this._changeData = handleFilmChange;
    this._handleControlButtons = this._handleControlButtons.bind(this);

    this._clear = clearCallback;
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleCloseButton = this._handleCloseButton.bind(this);
    this._handleDeleteCommentButton = this._handleDeleteCommentButton.bind(this);
    this._handleCommentFormSubmit = this._handleCommentFormSubmit.bind(this);
  }

  init(film) {
    this._film = film;
    this._commentsModel.getData(`${ApiUrl.COMMENTS}/${this._film.filmInfo.id}`)
      .then((comments) => {
        this._commentsModel.set(comments);
        this._comments = this._commentsModel.get();
        this._render();
      })
      .catch((error) => {
        const errorMsg = error.message;
        this._commentsModel.set([]);
        this._comments = this._commentsModel.get();
        this._render({ isLoadError: true, errorMsg });
      });
  }

  _render(error = {}) {
    const oldComponent = this._component;
    this._component = new FilmPopupView(this._film, this._comments, error);
    // если попап открыт, удаляем и сохраняем позицию скролла
    if (oldComponent !== null) {
      this._scrollTop = oldComponent.getElement().scrollTop;
      remove(oldComponent);
    }
    // рендерим попап
    render(this._container, this._component);
    this._component.getElement().scrollTop = this._scrollTop;
    // навешиваем нужные классы и слушатели
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._handleEscKeyDown);
    this._component.setCloseButtonClickHandler(this._handleCloseButton);
    this._component.setControlButtonsClickHandler(this._handleControlButtons);
    this._component.setCommentsListClickHandler(this._handleDeleteCommentButton);
    this._component.setCommentsFormKeydownHandler(this._handleCommentFormSubmit);
  }

  _destroy() {
    remove(this._component);
    this._component = null;
    this._comments = null;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._clear();
  }

  _setSavingState() {
    this._component.updateState({
      isSaving: true,
    });
  }

  _setDeletingState(commentID) {
    this._component.updateState({
      isDeleting: true,
      deletingCommentID: commentID,
    });
  }

  shake(commentID = null) {
    const resetState = () => {
      this._component.updateState({
        isDeleting: false,
        isSaving: false,
        deletingCommentID: null,
      });
    };
    const elementClass = commentID
      ? `.film-details__comment[data-id='${commentID}']`
      : '.film-details__new-comment';
    const element = this._component.getElement()
      .querySelector(elementClass);

    this._component.shake(element, resetState);
  }

  // обработчик Esc
  _handleEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._destroy();
    }
  }

  // обработчик закрытия попапа
  _handleCloseButton() {
    this._destroy();
  }

  // обновляет модель комментариев
  _handleDeleteCommentButton(commentId, film) {
    this._setDeletingState(commentId);
    this._commentsModel.deleteComment(UpdateType.PATCH, commentId, film);
  }

  _handleCommentFormSubmit(text, emoji, film) {
    this._setSavingState();
    //this._removeHandlers();
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._component.removeCloseButtonClickHandler();
    this._component.removeControlButtonsClickHandler();
    this._component.removeCommentsListClickHandler();
    this._component.removeCommentsFormKeydownHandler();

    this._commentsModel.createComment(UpdateType.PATCH, text, emoji, film);
  }
}
