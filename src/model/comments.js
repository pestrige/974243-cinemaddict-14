import AbstractModel from './abstract-model.js';
import { generateComment } from '../utils/common.js';

export default class Comments extends AbstractModel {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
    return this._comments;
  }

  getComments() {
    return this._comments;
  }

  createComment(updateType, text, emoji, film) {
    const newComment = generateComment(text, emoji);
    this._comments = [...this._comments, newComment];
    const commentIndex = this._comments.length - 1;
    this._notify(updateType, film, commentIndex);
  }

  deleteComment(updateType, deletedCommentId, film) {
    // обновляем количество комментариев в данных фильма
    const comments = [...film.comments];
    const index = comments.findIndex((comment) => comment.id === deletedCommentId);
    const updatedFilmCardComments = comments.splice(index, 1);
    const updatedFilm = {...film, updatedFilmCardComments};
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
        }
      });
  }
}
