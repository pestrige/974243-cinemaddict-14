import dayjs from 'dayjs';

const DATE_RANGES = {
  years: -50,
  months: 12,
  days: 31,
};

// Генерируем рандомное число
const getRandomNumber = (a = 0, b = 0) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Функции с датой
const getRandomDate = () => dayjs().add(getRandomNumber(DATE_RANGES.years), 'year')
  .add(getRandomNumber(DATE_RANGES.months), 'month')
  .add(getRandomNumber(DATE_RANGES.days), 'day')
  .toDate();
const getYearFromDate = (date) => dayjs(date).year();
const humanizeDate = (date) => dayjs(date).format('D MMMM YYYY');

// Переводим минуты в часы и минуты
const humanizeDuration = (duration) => {
  const hours = Math.trunc(duration / 60);
  const minutes = duration % 60;
  return `${hours}h ${minutes}m`;
};

export { getRandomNumber, getRandomDate, getYearFromDate, humanizeDate, humanizeDuration };