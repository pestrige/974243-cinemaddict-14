import dayjs from 'dayjs';
import { FILTER_TYPE, RANG } from '../const.js';

// Генерируем рандомное целое число
export const getRandomNumber = (a = 0, b = 0) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Генерируем нецелое случайное число
export const generateFloat = (a, b, digits = 1) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  const exponent = Math.pow(10, digits);
  const random = min + Math.random() * (max - min);

  return (Math.trunc(random * exponent) / exponent).toFixed(digits); //toFixed для отображения нулей
};

// Получаем рандомный элемент массива
export const getRandomArrayElement = (array) => {
  const randomId = getRandomNumber(0, array.length - 1);
  return array[randomId];
};

// Заменяем один элемент в массиве
export const updateItem = (itemsArray, updatedItem) => {
  const newItemsArray = [...itemsArray];
  const index = newItemsArray.findIndex((item) => item.filmInfo.id === updatedItem.filmInfo.id);
  if (index !== -1) {
    newItemsArray.splice(index, 1, updatedItem);
  }
  return newItemsArray;
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
  [FILTER_TYPE.none]: (films) => films.slice(),
  [FILTER_TYPE.all]: (films) => films.slice(),
  [FILTER_TYPE.watchlist]: (films) => films.filter(({userDetails}) => userDetails['isWatchlisted']),
  [FILTER_TYPE.history]: (films) => films.filter(({userDetails}) => userDetails['isWatched']),
  [FILTER_TYPE.favorites]: (films) => films.filter(({userDetails}) => userDetails['isFavorite']),
};

// Получаем ранг пользователя по просмотренным фильмам
export const getRang = (filmsCount) => {
  if (!filmsCount) {
    return false;
  }
  if (filmsCount > 0 && filmsCount <= 10) {
    return RANG.novice;
  } else if (filmsCount > 10 && filmsCount <= 20) {
    return RANG.fan;
  } else {
    return RANG.movieBuff;
  }
};
