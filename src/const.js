const MAX_DESCRIPTION_SIZE = 140;
const EXTRA_FILMS_CARDS_COUNT = 2;
const FILMS_PER_STEP = 5;
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
  init: 'init',
};
const FILTER_TYPE = {
  none: null,
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

const RANG_LEVELS = {
  novice: {
    min: 1,
    max: 10,
  },
  fan: {
    min: 11,
    max: 20,
  },
};

const AUTHORIZATION = 'Basic tD3df4fgDevk2ds3k';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const API_URL = {
  movies: 'movies',
  comments: 'comments',
};

export {
  MAX_DESCRIPTION_SIZE,
  FILMS_PER_STEP,
  EXTRA_FILMS_CARDS_COUNT,
  EMOJIES,
  RENDER_POSITION,
  SORT_BY,
  BUTTON_TYPE,
  SORT_TYPE,
  UPDATE_TYPE,
  FILTER_TYPE,
  DAYS_WEEK,
  DATE_PERIOD,
  RANG,
  RANG_LEVELS,
  AUTHORIZATION,
  END_POINT,
  API_URL
};
