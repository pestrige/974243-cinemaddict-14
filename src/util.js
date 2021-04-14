import dayjs from 'dayjs';
import { DATE_RANGES, RENDER_POSITION } from './const.js';


// Генерируем рандомное целое число
const getRandomNumber = (a = 0, b = 0) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Генерируем нецелое случайное число
const generateFloat = (a, b, digits = 1) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  const exponent = Math.pow(10, digits);
  const random = min + Math.random() * (max - min);

  return (Math.trunc(random * exponent) / exponent).toFixed(digits); //toFixed для отображения нулей
};

// Получаем рандомный элемент массива
const getRandomArrayElement = (array) => {
  const randomId = getRandomNumber(0, array.length - 1);
  return array[randomId];
};

// Функции с датой
const getRandomDate = () => dayjs().add(getRandomNumber(DATE_RANGES.years), 'year')
  .add(getRandomNumber(DATE_RANGES.months), 'month')
  .add(getRandomNumber(DATE_RANGES.days), 'day')
  .toDate();
const getYearFromDate = (date) => dayjs(date).year();
const humanizeDate = (date) => dayjs(date).format('D MMMM YYYY');
const humanizeFullDate = (date) => dayjs(date).format('YYYY/MM/DD HH:mm');

// Переводим минуты в часы и минуты
const humanizeDuration = (duration) => {
  const hours = Math.trunc(duration / 60);
  const minutes = duration % 60;
  return `${hours}h ${minutes}m`;
};

// шаблон рендера компонента из строки
const renderElement = (container, element, place = RENDER_POSITION.end ) => {
  container.insertAdjacentHTML(place, element);
};

// шаблон рендера компонента
const render = (container, element, place) => {
  switch (place) {
    case RENDER_POSITION.start:
      container.prepend(element);
      break;
    case RENDER_POSITION.end:
    default:
      container.append(element);
  }
};

// шаблон создания DOM элемента
const createDomElement = (template) => {
  const templateContainer = document.createElement('template');
  templateContainer.innerHTML = template;
  return templateContainer.content.firstElementChild;
};

export {
  getRandomNumber,
  generateFloat,
  getRandomArrayElement,
  getRandomDate,
  getYearFromDate,
  humanizeDate,
  humanizeFullDate,
  humanizeDuration,
  renderElement,
  render,
  createDomElement
};
