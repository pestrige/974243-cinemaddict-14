import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { DATE_PERIOD, DAYS_WEEK } from '../const.js';

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
