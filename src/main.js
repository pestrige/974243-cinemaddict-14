import { renderElement, render } from './util.js';
import ProfileBlockView from './view/profile-block.js';
import MainNavBlockView from './view/main-nav-block.js';
import SortBlockView from './view/sort-block.js';
import FilmsSectionView from './view/films-section.js';
import FooterStatsView from './view/footer-stats.js';
import FilmCardBlockView from './view/film-card-block.js';
import { createShowMoreButton } from './view/button-show-more.js';
import { createFilmPopup } from './view/film-popup.js';
import { generateFilm } from './mock/film.js';
import { gererateComment } from './mock/comment.js';
import { generateFilteredFilmsCounts } from './mock/filter.js';
import { FILMS_CARDS_COUNT, FILMS_PER_STEP, EXTRA_FILMS_CARDS_COUNT, MAX_COMMENTS } from './const.js';

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStats = footer.querySelector('.footer__statistics');

// создаем моковые массивы фильмов и комментариев
const films = new Array(FILMS_CARDS_COUNT).fill().map(generateFilm);
const comments = new Array(MAX_COMMENTS).fill().map(gererateComment);
//создаем массив с количеством фильмов по фильтрам
const filters = generateFilteredFilmsCounts(films);

// рендерим основные компоненты
render(header, new ProfileBlockView().getElement());
render(main, new MainNavBlockView(filters).getElement());
render(main, new SortBlockView().getElement());
render(main, new FilmsSectionView().getElement());
render(footerStats, new FooterStatsView(films).getElement());

const filmsSection = main.querySelector('.films-list');
const filmsList = filmsSection.querySelector('.films-list__container');
const filmsTopRatedList = main.querySelector('.films-list--top-rated .films-list__container');
const filmsMostCommentedList = main.querySelector('.films-list--most-commented .films-list__container');

// рендерим первые N фильмов
for (let i = 0; i < Math.min(films.length, FILMS_PER_STEP); i++) {
  render(filmsList, new FilmCardBlockView(films[i]).getElement());
}

// рендерим кнопку показа фильмов если есть еще фильмы
if (FILMS_PER_STEP < films.length) {
  let renderedFilms = FILMS_PER_STEP;
  renderElement(filmsSection, createShowMoreButton());

  const showMoreButton = main.querySelector('.films-list__show-more');
  // по клику рендерим больше фильмов
  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedFilms, renderedFilms + FILMS_PER_STEP) // берем кусок массива от уже показанных до + шаг
      .forEach((film) => render(filmsList, new FilmCardBlockView(film).getElement()));
    renderedFilms += FILMS_PER_STEP; // прибавляем к счетчику показанные фильмы

    if (renderedFilms >= films.length) {
      showMoreButton.remove();
    }
  });
}

// шаблон для рендера фильмов осортированных по ключу
const renderExtraFilmsBlock = (container, sortingKey) => {
  const [key, value] = sortingKey.split('.');
  const sortedFilms = films.slice();
  sortedFilms
    .sort((a, b) => b[key][value] - a[key][value])
    .slice(0, EXTRA_FILMS_CARDS_COUNT)
    .forEach((film) => render(container, new FilmCardBlockView(film).getElement()));
};

// рендерим фильмы с наивысшим рейтингом
renderExtraFilmsBlock(filmsTopRatedList, 'filmInfo.rating');
// рендерим самые комментируемые фильмы
renderExtraFilmsBlock(filmsMostCommentedList, 'comments.length');

// Обработчик клика по карточке фильма
const filmsListHandler = (evt) => {
  evt.preventDefault();
  const target = evt.target;
  // отлавливаем клики по заголовку, постеру и комментариям
  const isTargetCorrect = target.classList.contains('film-card__title')
    || target.classList.contains('film-card__poster')
    || target.classList.contains('film-card__comments');
  if (!isTargetCorrect) {
    return false;
  }
  // сопоставляем id в карточке фильма с id фильма в массиве
  // и рендерим попап на его основе
  const filmCardId = target.closest('.film-card').dataset.id;
  const film = films.find(({filmInfo}) => filmCardId === filmInfo.id);
  renderElement(footer, createFilmPopup(film, comments), 'afterend');

  // удаляем попап по клику на кнопке
  document.querySelector('.film-details__close-btn').addEventListener('click', () => {
    document.querySelector('.film-details').remove();
  });
};

filmsList.addEventListener('click', filmsListHandler);
