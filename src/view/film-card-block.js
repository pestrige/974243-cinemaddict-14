import AbstractView from './abstract.js';
import { getYearFromDate, humanizeDuration } from '../utils/dates.js';
import { MAX_DESCRIPTION_SIZE } from '../const.js';

const createFilmCardBlock = ({filmInfo, userDetails, comments}) => {
  const {
    id,
    title,
    rating,
    poster,
    description,
    genres,
    release,
    duration,
  } = filmInfo;
  const {
    isWatchlisted,
    isWatched,
    isFavorite,
  } = userDetails;

  const shortDescription = description.length > MAX_DESCRIPTION_SIZE
    ? `${description.slice(0, MAX_DESCRIPTION_SIZE)} ...`
    : description;

  const oneGenre = genres.slice(0, 1);

  const userDetailsActiveClass = (isKey) => {
    return isKey ? 'film-card__controls-item--active' : '';
  };

  return `<article class="film-card" data-id="${id}">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${getYearFromDate(release.date)}</span>
    <span class="film-card__duration">${humanizeDuration(duration)}</span>
    <span class="film-card__genre">${oneGenre}</span>
  </p>
  <img src="${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${shortDescription}</p>
  <a class="film-card__comments">${comments.length} comments</a>
  <div class="film-card__controls">
    <button class="${userDetailsActiveClass(isWatchlisted)} film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button" data-type="watchlist">Add to watchlist</button>
    <button class="${userDetailsActiveClass(isWatched)} film-card__controls-item button film-card__controls-item--mark-as-watched" type="button" data-type="history">Mark as watched</button>
    <button class="${userDetailsActiveClass(isFavorite)} film-card__controls-item button film-card__controls-item--favorite" type="button" data-type="favorite">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCardBlock extends AbstractView {
  constructor(film) {
    super();
    this._element = null;
    this._film = film;
    this._controlButtonsClickHandler = this._controlButtonsClickHandler.bind(this);
  }
  getTemplate() {
    return createFilmCardBlock(this._film);
  }

  _controlButtonsClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonsClick(evt);
  }

  setControlButtonsClick(callback) {
    this._callback.buttonsClick = callback;
    this.getElement()
      .querySelector('.film-card__controls')
      .addEventListener('click', this._controlButtonsClickHandler);
  }
}
