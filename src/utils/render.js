import AbstractView from '../view/abstract.js';
import ButtonShowMoreView from '../view/button-show-more.js';
import { RENDER_POSITION, FILMS_PER_STEP, SORT_BY, EXTRA_FILMS_CARDS_COUNT } from '../const.js';

// =====
// шаблон рендера компонента
// =====
export const render = (container, element, place) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (place) {
    case RENDER_POSITION.start:
      container.prepend(element);
      break;
    case RENDER_POSITION.end:
    default:
      container.append(element);
  }
};

// =====
// шаблон рендера фильмов
// =====
export const renderFilms = (container, filmCard, filmsArray) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }
  const filmsList = container.querySelector('.films-list');
  const filmsListContainer = filmsList.querySelector('.films-list__container');

  // рендерим первые N фильмов или заглушку, если фильмов нет
  for (let i = 0; i < Math.min(filmsArray.length, FILMS_PER_STEP); i++) {
    render(filmsListContainer, new filmCard(filmsArray[i]));
  }

  // рендерим кнопку показа фильмов, если есть еще фильмы
  if (FILMS_PER_STEP < filmsArray.length) {
    let renderedFilms = FILMS_PER_STEP;
    const buttonShowMoreComponent = new ButtonShowMoreView();
    const buttonShowMoreElement = buttonShowMoreComponent.getElement();
    render(filmsList, buttonShowMoreComponent);

    // по клику рендерим больше фильмов
    buttonShowMoreElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      filmsArray
        .slice(renderedFilms, renderedFilms + FILMS_PER_STEP) // берем кусок массива от уже показанных, до + шаг
        .forEach((film) => render(filmsListContainer, new filmCard(film)));
      renderedFilms += FILMS_PER_STEP; // прибавляем к счетчику показанные фильмы

      if (renderedFilms >= filmsArray.length) {
        buttonShowMoreElement.remove();
        buttonShowMoreComponent.removeElement();
      }
    });
  }
};

// =====
// шаблон для рендера фильмов, осортированных по ключу
// =====
export const renderFilmsByKey = (container, filmCard, filmsArray) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  const isTopRated = container.classList.contains('films-list--top-rated');
  const filmsList = isTopRated
    ? container.querySelector('.films-list--top-rated .films-list__container')
    : container.querySelector('.films-list--most-commented .films-list__container');
  const [key, value] = isTopRated ? SORT_BY.rating.split('.') : SORT_BY.comments.split('.');
  const sortedFilms = filmsArray.slice();

  sortedFilms
    .sort((a, b) => b[key][value] - a[key][value])
    .slice(0, EXTRA_FILMS_CARDS_COUNT)
    .forEach((film) => render(filmsList, new filmCard(film)));
};

// =====
// шаблон создания DOM элемента
// =====
export const createDomElement = (template) => {
  const templateContainer = document.createElement('template');
  templateContainer.innerHTML = template;
  return templateContainer.content.firstElementChild;
};
