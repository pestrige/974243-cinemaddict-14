import AbstractView from '../view/abstract.js';
import { FILMS_PER_STEP, SortBy, EXTRA_FILMS_CARDS_COUNT } from '../const.js';

const RenderPosition = {
  START: 'afterbegin',
  END: 'beforeend',
};

// =====
// создание DOM элемента
// =====
export const createDomElement = (template) => {
  const templateContainer = document.createElement('template');
  templateContainer.innerHTML = template;
  return templateContainer.content.firstElementChild;
};

// =====
// рендер компонента
// =====
export const render = (container, element, place) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPosition.START:
      container.prepend(element);
      break;
    case RenderPosition.END:
    default:
      container.append(element);
  }
};

// =====
// удаление компонента
// =====
export const remove = (component) => {
  if (component === null) {
    return;
  }
  if (component instanceof AbstractView) {
    component.getElement().remove();
    component.removeElement();
  } else {
    throw new Error('Can remove components only');
  }
};

// =====
// замена элемента
// =====
export const replace = (oldChild, newChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }
  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }
  const parent = oldChild.parentElement;
  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

// =====
// рендер фильмов
// =====
export const renderFilms = (container, filmCard, films, button) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }
  const filmsList = container.querySelector('.films-list');
  const filmsListContainer = filmsList.querySelector('.films-list__container');

  // рендерим первые N фильмов
  for (let i = 0; i < Math.min(films.length, FILMS_PER_STEP); i++) {
    render(filmsListContainer, new filmCard(films[i]));
  }

  // рендерим кнопку показа фильмов, если есть еще фильмы
  if (FILMS_PER_STEP < films.length) {
    let renderedFilms = FILMS_PER_STEP;
    const buttonShowMoreComponent = new button();
    render(filmsList, buttonShowMoreComponent);

    // по клику рендерим больше фильмов
    buttonShowMoreComponent.setClickHandler((evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilms, renderedFilms + FILMS_PER_STEP) // берем кусок массива от уже показанных, до + шаг
        .forEach((film) => render(filmsListContainer, new filmCard(film)));
      renderedFilms += FILMS_PER_STEP; // прибавляем к счетчику показанные фильмы

      if (renderedFilms >= films.length) {
        remove(buttonShowMoreComponent);
      }
    });
  }
};

// =====
// рендера фильмов, осортированных по ключу
// =====
export const renderFilmsByKey = (container, filmCard, films) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  const isTopRated = container.classList.contains('films-list--top-rated');
  const filmsList = isTopRated
    ? container.querySelector('.films-list--top-rated .films-list__container')
    : container.querySelector('.films-list--most-commented .films-list__container');
  const [key, value] = isTopRated ? SortBy.RATING.split('.') : SortBy.COMMENTS.split('.');
  const sortedFilms = films.slice();

  sortedFilms
    .sort((a, b) => b[key][value] - a[key][value])
    .slice(0, EXTRA_FILMS_CARDS_COUNT)
    .forEach((film) => render(filmsList, new filmCard(film)));
};
