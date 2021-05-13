//import Observer from '../utils/observer.js';
import Api from './api.js';
import { observerMixin } from '../utils/observer.js';

export default class Films extends observerMixin(Api) {
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

  adaptToClient(films) {
    return films.map((film) => {
      const adaptedFilm = {
        filmInfo: {
          id: film.id,
          title: film.film_info.title,
          alternativeTitle: film.film_info.alternative_title,
          rating: film.film_info.total_rating,
          ageRating: film.film_info.age_rating,
          poster: film.film_info.poster,
          description: film.film_info.description,
          genres: film.film_info.genre,
          release: {
            date: new Date(film.film_info.release.date),
            country: film.film_info.release_country,
          },
          duration: film.film_info.runtime,
          director: film.film_info.director,
          writers: film.film_info.writers,
          actors: film.film_info.actors,
        },
        userDetails: {
          isWatchlisted: film.user_details.watchlist,
          isWatched: film.user_details.already_watched,
          isFavorite: film.user_details.favorite,
          date: new Date(film.user_details.watching_date),
        },
        comments: film.comments,
      };
      return adaptedFilm;
    });
  }

  adaptToServer({filmInfo, userDetails, comments}) {
    return {
      'id': filmInfo.id,
      'comments': comments,
      'film_info': {
        'title': filmInfo.title,
        'alternative_title': filmInfo.alternativeTitle,
        'total_rating': filmInfo.rating,
        'poster': filmInfo.poster,
        'age_rating': filmInfo.ageRating,
        'director': filmInfo.director,
        'writers': filmInfo.writers,
        'actors': filmInfo.actors,
        'release': {
          'date': filmInfo.release.date.toISOString(),
          'release_country': filmInfo.release.country,
        },
        'runtime': filmInfo.duration,
        'genre': filmInfo.genres,
        'description': filmInfo.description,
      },
      'user_details': {
        'watchlist': userDetails.isWatchlisted,
        'already_watched': userDetails.isWatched,
        'watching_date': userDetails.date.toISOString(),
        'favorite': userDetails.isFavorite,
      },
    };
  }
}
