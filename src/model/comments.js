import Observer from '../utils/observer.js';

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  addComment(updateType, newComment) {
    this._comments = [newComment, ...this._comments];
    this._notify(updateType, newComment);
  }

  deleteComment(updateType, deletedCommentId, film) {
    this._comments = [...this._comments];
    const index = this._comments.findIndex((comment) => comment.id === Number(deletedCommentId));
    if (index !== -1) {
      // TODO: раскомментировать на реальных данных
      // пока массив не изменяется, чтобы не съезжали индексы элементов
      // удаляются только индексы комментариев в данных о фильме
      //this._comments.splice(index, 1);
    }

    this._notify(updateType, film, index);
  }
}
