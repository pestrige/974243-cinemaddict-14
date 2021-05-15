import AbstractModel from './abstract-model.js';

export default class Films extends AbstractModel {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();
    this._notify(updateType, this._films);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    this._films = [...this._films];
    const updatedFilm = update.id ? this._adaptFilmToClient(update) : update;
    const index = this._films.findIndex((film) => film.filmInfo.id === updatedFilm.filmInfo.id);
    if (index !== -1) {
      this._films.splice(index, 1, updatedFilm);
    }
    if (updateType) {
      this._notify(updateType, updatedFilm);
    }
  }
}
