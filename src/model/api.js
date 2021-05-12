import { AUTHORIZATION, END_POINT } from '../const.js';
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
    this._authorization = AUTHORIZATION;
    this._endPoint = END_POINT;
  }

  getData(dataUrl) {
    return this._load({url: dataUrl})
      .then(Api.toJSON);
  }

  updateData() {

  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append('Authorization', this._authorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers});
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
