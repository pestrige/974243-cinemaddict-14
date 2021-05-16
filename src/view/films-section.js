import AbstractView from './abstract.js';

const createFilmsSection = () => {
  return `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

    <div class="films-list__container"></div>

    </section></section>`;
};

export default class FilmsSection extends AbstractView {
  constructor() {
    super();
    this._filmCardClickHandler = this._filmCardClickHandler.bind(this);
  }
  getTemplate() {
    return createFilmsSection();
  }

  setFilmCardClickHandler(callback) {
    this._callback.filmCardClick = callback;
    this.getElement().addEventListener('click', this._filmCardClickHandler);
  }

  removeFilmCardClickHandler() {
    this.getElement().removeEventListener('click', this._filmCardClickHandler);
  }

  _filmCardClickHandler(evt) {
    evt.preventDefault();
    this._callback.filmCardClick(evt);
  }
}
