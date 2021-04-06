import { getYearFromDate, humanizeDuration } from '../util.js';

const MAX_DESCRIPTION_SIZE = 140;

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
    <button class="${userDetailsActiveClass(isWatchlisted)} film-card__controls-item button film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
    <button class="${userDetailsActiveClass(isWatched)} film-card__controls-item button film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
    <button class="${userDetailsActiveClass(isFavorite)} film-card__controls-item button film-card__controls-item--favorite" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export { createFilmCardBlock };
