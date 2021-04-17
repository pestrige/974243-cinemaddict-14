import dayjs from 'dayjs';
import { getRandomNumber } from './common.js';
import { DATE_RANGES } from '../const.js';

// Функции с датой
export const getRandomDate = () => dayjs().add(getRandomNumber(DATE_RANGES.years), 'year')
  .add(getRandomNumber(DATE_RANGES.months), 'month')
  .add(getRandomNumber(DATE_RANGES.days), 'day')
  .toDate();
export const getYearFromDate = (date) => dayjs(date).year();
export const humanizeDate = (date) => dayjs(date).format('D MMMM YYYY');
export const humanizeFullDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

// Переводим минуты в часы и минуты
export const humanizeDuration = (duration) => {
  const hours = Math.trunc(duration / 60);
  const minutes = duration % 60;
  return `${hours}h ${minutes}m`;
};
