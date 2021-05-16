import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { DatePeriod } from '../const.js';

const DAYS_WEEK = 6;

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
    case DatePeriod.TODAY:
      return dayjs().toDate();
    case DatePeriod.WEEK:
      return dayjs().subtract(DAYS_WEEK, 'day').toDate();
    case DatePeriod.MONTH:
      return dayjs().subtract(1, 'month').toDate();
    case DatePeriod.YEAR:
      return dayjs().subtract(1, 'year').toDate();
  }
};
