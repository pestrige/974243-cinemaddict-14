import AbstractView from './abstract.js';

const createFooterStats = (filmsCount) => {
  return `<p>${filmsCount} movies inside</p>`;
};

export default class FooterStats extends AbstractView {
  constructor(films) {
    super();
    this._filmsCount = films.length;
  }

  getTemplate() {
    return createFooterStats(this._filmsCount);
  }
}
