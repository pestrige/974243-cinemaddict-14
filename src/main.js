import { createProfileBlock } from './view/profile-block.js';
import { createMainNavBlock } from './view/main-nav-block.js';
import { createSortBlock } from './view/sort-block.js';
import { createFilmsSection } from './view/films-section.js';
import { createFilmCardBlock } from './view/film-card-block.js';
import { createFilmDetailsPopup } from './view/film-details-popup.js';
import { generateFilm } from './mock/film.js';

const FILMS_CARDS_COUNT = 20;
const EXTRA_FILMS_CARDS_COUNT = 2;

const films = new Array(FILMS_CARDS_COUNT).fill().map(generateFilm);

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

const renderElement = (container, element, place = 'beforeend') => {
  container.insertAdjacentHTML(place, element);
};

const renderElements = (container, element, elementsCount, place = 'beforeend') => {
  for (let i = 0; i < elementsCount; i++) {
    renderElement(container, element(films[i]), place);
  }
};

renderElement(header, createProfileBlock());
renderElement(main, createMainNavBlock());
renderElement(main, createSortBlock());
renderElement(main, createFilmsSection());

const filmsList = main.querySelector('.films-list__container');
const filmsTopRatedList = main.querySelector('.films-list--top-rated .films-list__container');
const filmsMostCommentedList = main.querySelector('.films-list--most-commented .films-list__container');

renderElements(filmsList, createFilmCardBlock, FILMS_CARDS_COUNT);
renderElements(filmsTopRatedList, createFilmCardBlock, EXTRA_FILMS_CARDS_COUNT);
renderElements(filmsMostCommentedList, createFilmCardBlock, EXTRA_FILMS_CARDS_COUNT);

renderElement(footer, createFilmDetailsPopup(), 'afterend');
