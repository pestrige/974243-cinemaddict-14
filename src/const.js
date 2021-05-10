const MAX_COMMENTS = 50;
const MAX_SHOWN_COMMENTS = 5;
const MAX_DESCRIPTION_SIZE = 140;
const FILMS_CARDS_COUNT = 20;
const EXTRA_FILMS_CARDS_COUNT = 2;
const FILMS_PER_STEP = 5;
const DATE_RANGES = {
  years: -5,
  months: 12,
  days: 31,
};
const EMOJIES = {
  smile: 'smile',
  sleeping: 'sleeping',
  puke: 'puke',
  angry: 'angry',
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
  watchlist: 'watchlist',
  history: 'history',
  favorite: 'favorite',
};
const SORT_TYPE = {
  default: 'default',
  date: 'date',
  rating: 'rating',
};
const UPDATE_TYPE = {
  patch: 'patch',
  minor: 'minor',
  major: 'major',
};
const FILTER_TYPE = {
  none: undefined,
  all: 'all',
  watchlist: 'watchlist',
  history: 'history',
  favorites: 'favorites',
  stats: 'stats',
};

const DAYS_WEEK = 6;

const DATE_PERIOD = {
  all: 'all-time',
  today: 'today',
  week: 'week',
  month: 'month',
  year: 'year',
};

const RANG = {
  novice: 'Novice',
  fan: 'Fan',
  movieBuff: 'Movie Buff',
};

export {
  MAX_COMMENTS,
  MAX_SHOWN_COMMENTS,
  MAX_DESCRIPTION_SIZE,
  FILMS_CARDS_COUNT,
  FILMS_PER_STEP,
  EXTRA_FILMS_CARDS_COUNT,
  DATE_RANGES,
  EMOJIES,
  RENDER_POSITION,
  SORT_BY,
  BUTTON_TYPE,
  SORT_TYPE,
  UPDATE_TYPE,
  FILTER_TYPE,
  DAYS_WEEK,
  DATE_PERIOD,
  RANG
};
