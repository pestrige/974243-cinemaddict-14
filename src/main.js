import { createProfileBlock } from './view/profile-block.js';
import { createMainNavBlock } from './view/main-nav-block.js';
import { createSortBlock } from './view/sort-block.js';
import { createFilmsSection } from './view/films-section.js';
import { createFilmCardBlock } from './view/film-card-block.js';
import { createFooterStats } from './view/footer-stats.js';
import { createFilmPopup } from './view/film-popup.js';
import { generateFilm } from './mock/film.js';
import { generateFilteredFilmsCounts } from './mock/filter.js';

const FILMS_CARDS_COUNT = 20;
const EXTRA_FILMS_CARDS_COUNT = 2;

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStats = footer.querySelector('.footer__statistics');

const films = new Array(FILMS_CARDS_COUNT).fill().map(generateFilm);
const filters = generateFilteredFilmsCounts(films);
//console.log(filters);

const renderElement = (container, element, place = 'beforeend') => {
  container.insertAdjacentHTML(place, element);
};

const renderElements = (container, element, elementsCount, place = 'beforeend') => {
  for (let i = 0; i < elementsCount; i++) {
    renderElement(container, element(films[i]), place);
  }
};

renderElement(header, createProfileBlock());
renderElement(main, createMainNavBlock(filters));
renderElement(main, createSortBlock());
renderElement(main, createFilmsSection());
renderElement(footerStats, createFooterStats(films));

const filmsList = main.querySelector('.films-list__container');
const filmsTopRatedList = main.querySelector('.films-list--top-rated .films-list__container');
const filmsMostCommentedList = main.querySelector('.films-list--most-commented .films-list__container');

renderElements(filmsList, createFilmCardBlock, FILMS_CARDS_COUNT);
renderElements(filmsTopRatedList, createFilmCardBlock, EXTRA_FILMS_CARDS_COUNT);
renderElements(filmsMostCommentedList, createFilmCardBlock, EXTRA_FILMS_CARDS_COUNT);

const filmsListHandler = (evt) => {
  evt.preventDefault();
  const target = evt.target;
  const isTargetCorrect = target.classList.contains('film-card__title')
    || target.classList.contains('film-card__poster')
    || target.classList.contains('film-card__comments');
  if (!isTargetCorrect) {
    return false;
  }

  const filmCardId = target.closest('.film-card').dataset.id;
  const film = films.find(({filmInfo}) => filmCardId === filmInfo.id);
  renderElement(footer, createFilmPopup(film), 'afterend');

  document.querySelector('.film-details__close-btn').addEventListener('click', () => {
    document.querySelector('.film-details').remove();
  });
};

filmsList.addEventListener('click', filmsListHandler);
