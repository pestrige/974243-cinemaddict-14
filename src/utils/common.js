import dayjs from 'dayjs';
import { FilterType } from '../const.js';

const Rang = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  MOVIE_BUFF: 'Movie Buff',
};

const RangLevel = {
  NOVICE: {
    min: 1,
    max: 10,
  },
  FAN: {
    min: 11,
    max: 20,
  },
};

// Заменяем один элемент в массиве
export const updateItem = (items, updatedItem) => {
  const newItems = [...items];
  const index = newItems.findIndex((item) => item.filmInfo.id === updatedItem.filmInfo.id);
  if (index !== -1) {
    newItems.splice(index, 1, updatedItem);
  }
  return newItems;
};

// Сортируем по дате
export const sortByDate = (filmA, filmB) => {
  const dateFilmA = filmA.filmInfo.release.date;
  const dateFilmB = filmB.filmInfo.release.date;
  return dayjs(dateFilmB).diff(dateFilmA);
};

// Сорируем по рейтингу
export const sortByRating = (filmA, filmB) => {
  const ratingFilmA = filmA.filmInfo.rating;
  const ratingFilmB = filmB.filmInfo.rating;
  return ratingFilmB - ratingFilmA;
};

// Получаем массив с количеством фильмов по ключу
export const generateFilteredFilmsCounts = (films) => {
  // фильтруем массив по переданному ключу
  const getCount = (filter) => films.filter(({userDetails}) => userDetails[filter]).length;

  const watchlistedCount = getCount('isWatchlisted');
  const watchedCount = getCount('isWatched');
  const favoriteCount = getCount('isFavorite');

  return [watchlistedCount, watchedCount, favoriteCount];
};

// Список отфиотрованных массивов фильмов
export const filter = {
  [FilterType.NONE]: (films) => films.slice(),
  [FilterType.ALL]: (films) => films.slice(),
  [FilterType.WATCHLIST]: (films) => films.filter(({userDetails}) => userDetails['isWatchlisted']),
  [FilterType.HISTORY]: (films) => films.filter(({userDetails}) => userDetails['isWatched']),
  [FilterType.FAVORITE]: (films) => films.filter(({userDetails}) => userDetails['isFavorite']),
};

// Получаем ранг пользователя по просмотренным фильмам
export const getRang = (filmsCount) => {
  const { NOVICE, FAN } = RangLevel;
  if (!filmsCount) {
    return false;
  }
  if (filmsCount >= NOVICE.min && filmsCount <= NOVICE.max) {
    return Rang.NOVICE;
  } else if (filmsCount >= FAN.min && filmsCount <= FAN.max) {
    return Rang.FAN;
  } else {
    return Rang.MOVIE_BUFF;
  }
};

// находим жанры и их количество, сортируем
export const getSortedGenres = (films) => {
  const genresMap = new Map();
  films.forEach(({filmInfo}) => {
    filmInfo.genres.forEach((genre) => {
      const counter = genresMap.get(genre) + 1 || 1;
      genresMap.set(genre, counter);
    });
  });
  return [...genresMap.entries()].sort((a, b) => b[1] - a[1]);
  // return  [...genresMap.entries()]
  //   .reduce((accum, current) => current[1] > accum[1] ? current : accum)[0];
};
