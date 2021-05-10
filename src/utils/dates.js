import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isBefore from 'dayjs/plugin/isSameOrBefore';
import { getRandomNumber } from './common.js';
import { DATE_RANGES, DATE_PERIOD, DAYS_WEEK } from '../const.js';

// Функции с датой
export const getRandomDate = () => {
  dayjs.extend(isBefore);
  const randomDate = dayjs().add(getRandomNumber(DATE_RANGES.years), 'year')
    .add(getRandomNumber(DATE_RANGES.months), 'month')
    .add(getRandomNumber(DATE_RANGES.days), 'day')
    .toDate();

  return dayjs().isBefore(dayjs(randomDate))
    ? dayjs().toDate()
    : randomDate;
};
export const getYearFromDate = (date) => dayjs(date).year();
export const humanizeDate = (date) => dayjs(date).format('D MMMM YYYY');
export const humanizeFullDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

// Переводим минуты в часы и минуты
export const humanizeDuration = (duration, {asObject = false} = {}) => {
  const hours = Math.trunc(duration / 60);
  const minutes = duration % 60;
  if (asObject) {
    return {
      hours,
      minutes,
    };
  }
  return `${hours}h ${minutes}m`;
};

// Проверяем есть ли дата в диапазоне
export const isDateInRange = (currentDate, dateFrom) => {
  dayjs.extend(isSameOrBefore);
  return dayjs(dateFrom).isSameOrBefore(currentDate);
};

// Получаем дату конца периода
export const getDateFrom = (period) => {
  switch (period) {
    case DATE_PERIOD.today:
      return dayjs().toDate();
    case DATE_PERIOD.week:
      return dayjs().subtract(DAYS_WEEK, 'day').toDate();
    case DATE_PERIOD.month:
      return dayjs().subtract(1, 'month').toDate();
    case DATE_PERIOD.year:
      return dayjs().subtract(1, 'year').toDate();
  }
};
