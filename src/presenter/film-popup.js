import AbstractSmartPresenter from './abstract-smart.js';
import FilmPopupView from '../view/film-popup.js';
import { render, remove } from '../utils/render.js';
import { UpdateType, ApiUrl } from '../const.js';

export default class FilmPopupPresenter extends AbstractSmartPresenter {
  constructor(container, commentsModel, store, handleFilmChange, clearCallback) {
    super();
    this._container = container;
    this._commentsModel = commentsModel;
    this._store = store;
    this._comments = null;
    this._component = null;
    this._scrollTop = 0;
    // методы _changeData и _handleControlButtons
    // наследуются от AbstractSmartPresenter
    this._changeData = handleFilmChange;
    this._handleControlButtons = this._handleControlButtons.bind(this);

    this._clear = clearCallback;
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleCloseButton = this._handleCloseButton.bind(this);
    this._handleDeleteCommentButton = this._handleDeleteCommentButton.bind(this);
    this._handleCommentFormSubmit = this._handleCommentFormSubmit.bind(this);
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

  init(film) {
    this._film = film;
    this._commentsModel.getDataToCache(`${ApiUrl.COMMENTS}/${this._film.filmInfo.id}`, this._store, {id: this._film.filmInfo.id})
      .then(({data, isCached}) => {
        this._commentsModel.setItems(data);
        this._comments = this._commentsModel.getItems();
        isCached ? this._render() : this._render({ isLoadError: true, errorMsg: 'no cached comments' });
      })
      .catch((error) => {
        const errorMsg = error.message;
        this._commentsModel.setItems([]);
        this._comments = this._commentsModel.getItems();
        this._render({ isLoadError: true, errorMsg });
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
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._component.removeCloseButtonClickHandler();
    this._component.removeControlButtonsClickHandler();
    this._component.removeCommentsListClickHandler();
    this._component.removeCommentsFormKeydownHandler();

    this._commentsModel.createComment(UpdateType.PATCH, text, emoji, film);
  }
}
