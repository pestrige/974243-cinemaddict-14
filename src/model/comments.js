import AbstractModel from './abstract-model.js';
import { isOnline } from '../utils/common.js';

export default class Comments extends AbstractModel {
  constructor() {
    super();
    this._comments = [];
  }

  setItems(comments) {
    this._comments = comments.slice();
    return this._comments;
  }

  getItems() {
    return this._comments;
  }

  createComment(updateType, text, emoji, film) {
    const data = {
      comment: {
        comment: text,
        emotion: emoji,
      },
      id: Number(film.filmInfo.id),
    };

    if (!isOnline()) {
      this._notify(updateType, data, {isError: true, isOffline: true});
      return;
    }

    this.addData(data)
      .then((updatedData) => {
        this._notify(updateType, updatedData);
      })
      .catch(() => this._notify(updateType, data, {isError: true}));
  }

  deleteComment(updateType, deletedCommentId, film) {
    // обновляем количество комментариев в данных фильма
    const comments = [...film.comments];
    const index = comments.findIndex((comment) => comment.id === deletedCommentId);
    const updatedFilmCardComments = comments.splice(index, 1);
    const updatedFilm = {...film, updatedFilmCardComments};

    if (!isOnline()) {
      this._notify(updateType, updatedFilm, {isError: true, isOffline: true, deletedCommentId});
      return;
    }

    // удалем комментарий с сервера
    this._deleteCommentFromServer(deletedCommentId)
      .then((response) => {
        if (response.ok) {
          // обновляем данные фильма на сервере
          this.updateData(updatedFilm)
            .then((film) => {
              // и запускаем перерисовку
              this._notify(updateType, film);
            });
        } else {
          this._notify(updateType, film, {isDeteleError: true, deletedCommentId});
        }
      })
      .catch(() => this._notify(updateType, film, {isError: true, deletedCommentId}));
  }
}
