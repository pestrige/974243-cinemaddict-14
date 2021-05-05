import Observer from '../utils/observer.js';

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(films) {
    this._films = films.slice();
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    this._films = [...this._films];
    const index = this._films.findIndex((film) => film.filmInfo.id === update.filmInfo.id);
    if (index !== -1) {
      this._films.splice(index, 1, update);
    }

    this._notify(updateType, update);
  }

  deleteComment(updateType, film, commentIndex) {
    const {comments} = film;
    const index = comments.findIndex((comment) => comment === commentIndex);
    if (index !== -1) {
      comments.splice(index, 1);
    } else {
      comments.push(commentIndex);
    }
    const updatedFilm = {...film, comments};
    this.updateFilm(updateType, updatedFilm);
  }
}
