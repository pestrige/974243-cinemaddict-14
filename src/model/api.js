import { ApiUrl, DataType } from '../const.js';

const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  POST: 'POST',
};
const SuccessServerStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor() {
    this._authorization = null;
    this._endPoint = END_POINT;
  }

  _getToken() {
    const token = localStorage.getItem('token');
    token ? this._authorization = token : this._generateToken();
  }

  getData(dataUrl, dataType = DataType.OTHER) {
    this._getToken();
    return this._load({url: dataUrl})
      .then(Api.toJSON)
      .then((data) => {
        switch (dataType) {
          case DataType.FILMS:
            return this._adaptToClient(data);
          case DataType.OTHER:
          default:
            return data;
        }
      });
  }

  updateData(data) {
    const adaptedData = this._adaptToServer(data);
    return this._load({
      url: `${ApiUrl.MOVIES}/${adaptedData.id}`,
      method: Method.PUT,
      body: JSON.stringify(adaptedData),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then((data) => this._adaptToClient(data));
  }

  addData(data) {
    return this._load({
      url: `${ApiUrl.COMMENTS}/${data.id}`,
      method: Method.POST,
      body: JSON.stringify(data.comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(({movie}) => this._adaptToClient(movie));
  }

  _deleteCommentFromServer(id) {
    return this._load({
      url: `${ApiUrl.COMMENTS}/${id}`,
      method: Method.DELETE,
    });
  }

  _generateToken() {
    const randomString = Math.random().toString(36).replace(/[.]/g, '');
    this._authorization = `Basic ${randomString}`;
    localStorage.setItem('token', this._authorization);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append('Authorization', this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (response.status < SuccessServerStatusRange.MIN || response.status > SuccessServerStatusRange.MAX) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(error) {
    throw error;
  }

  _adaptToClient(data) {
    return Array.isArray(data)
      ? data.map((film) => this._adaptFilmToClient(film))
      : this._adaptFilmToClient(data);
  }

  _adaptFilmToClient(film) {
    return {
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
          country: film.film_info.release.release_country,
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
  }

  _adaptToServer({filmInfo, userDetails, comments}) {
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
