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

  deleteFilm(updateType, update) {
    this._films = [...this._films];
    const index = this._films.findIndex((film) => film.filmInfo.id === update.filmInfo.id);
    if (index !== -1) {
      this._films.splice(index, 1);
    }

    this._notify(updateType);
  }
}
