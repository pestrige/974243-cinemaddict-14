import dayjs from 'dayjs';

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
