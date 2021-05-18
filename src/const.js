export const MAX_DESCRIPTION_SIZE = 140;
export const EXTRA_FILMS_CARDS_COUNT = 2;
export const FILMS_PER_STEP = 5;

export const SortBy = {
  RATING: 'filmInfo.rating',
  COMMENTS: 'comments.length',
};
export const SortType = {
  DEFAULT: 'default',
  DATE: 'date',
  RATING: 'rating',
};
export const UpdateType = {
  NONE: 'none',
  PATCH: 'patch',
  MINOR: 'minor',
  MAJOR: 'major',
  INIT: 'init',
};
export const FilterType = {
  NONE: null,
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITE: 'favorites',
  STATS: 'stats',
};
export const DatePeriod = {
  ALL: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};
export const ApiUrl = {
  MOVIES: 'movies',
  COMMENTS: 'comments',
};
export const DataType = {
  FILMS: 'films',
  COMMENTS: 'comments',
};
