import { END_POINT, API_URL } from '../const.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
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

  init() {
    const token = localStorage.getItem('token');
    token ? this._authorization = token : this._generateToken();
  }

  getData(dataUrl) {
    return this._load({url: dataUrl})
      .then(Api.toJSON);
  }

  updateData(data) {
    return this._load({
      url: `${API_URL.movies}/${data.id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
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
}
