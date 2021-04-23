const MAX_COMMENTS = 5;
const MAX_DESCRIPTION_SIZE = 140;
const FILMS_CARDS_COUNT = 20;
const EXTRA_FILMS_CARDS_COUNT = 2;
const FILMS_PER_STEP = 5;
const DATE_RANGES = {
  years: -50,
  months: 12,
  days: 31,
};
const RENDER_POSITION = {
  start: 'afterbegin',
  end: 'beforeend',
};
const SORT_BY = {
  rating: 'filmInfo.rating',
  comments: 'comments.length',
};
const BUTTON_TYPE = {
  watchlisted: 'watchlist',
  watched: 'watched',
  favorite: 'favorite',
};

export {
  MAX_COMMENTS,
  MAX_DESCRIPTION_SIZE,
  FILMS_CARDS_COUNT,
  FILMS_PER_STEP,
  EXTRA_FILMS_CARDS_COUNT,
  DATE_RANGES,
  RENDER_POSITION,
  SORT_BY,
  BUTTON_TYPE
};
