const generateFilteredFilmsCounts = (films) => {
  // фильтруем массив по переданному ключу
  const getCount = (filter) => films.filter(({userDetails}) => userDetails[filter]).length;

  const watchlistedCount = getCount('isWatchlisted');
  const watchedCount = getCount('isWatched');
  const favoriteCount = getCount('isFavorite');

  return [watchlistedCount, watchedCount, favoriteCount];
};

export { generateFilteredFilmsCounts };
