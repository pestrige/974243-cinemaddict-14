import { render, renderFilms, renderFilmsByKey } from './utils/render.js';
import ProfileBlockView from './view/profile-block.js';
import MainNavBlockView from './view/main-nav-block.js';
import SortBlockView from './view/sort-block.js';
import FilmsSectionView from './view/films-section.js';
import FilmsByRatingView from './view/films-by-rating.js';
import FilmsByCommentsView from './view/films-by-comments.js';
import FooterStatsView from './view/footer-stats.js';
import FilmCardBlockView from './view/film-card-block.js';
import NoFilmsBlockView from './view/no-films-block.js';
//import ShowMoreButtonView from './view/button-show-more.js';
import FilmPopupView from './view/film-popup.js';
import { generateFilm } from './mock/film.js';
import { gererateComment } from './mock/comment.js';
import { generateFilteredFilmsCounts } from './mock/filter.js';
import { FILMS_CARDS_COUNT, MAX_COMMENTS } from './const.js';

const body = document.querySelector('body');
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStats = footer.querySelector('.footer__statistics');

// =====
// создаем моковые данные
// =====
const films = new Array(FILMS_CARDS_COUNT).fill().map(generateFilm);
const comments = new Array(MAX_COMMENTS).fill().map(gererateComment);
// создаем массив с количеством фильмов по фильтрам
const filters = generateFilteredFilmsCounts(films);

// =====
// Обработчик клика по карточке фильма
// =====
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
  const filmCardId = target.closest('.film-card').dataset.id;
  const film = films.find(({filmInfo}) => filmCardId === filmInfo.id);
  // рендерим попап на основе найденного фильма
  const filmPopupComponent = new FilmPopupView(film, comments);
  const filmPopupElement = filmPopupComponent.getElement();
  render(body, filmPopupComponent);
  body.classList.add('hide-overflow');

  // Удаляем попап
  const removePopup = () => {
    filmPopupElement.remove();
    filmPopupComponent.removeElement();
    body.classList.remove('hide-overflow');
  };

  // обработчик Esc
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      removePopup();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  document.addEventListener('keydown', onEscKeyDown);
  filmPopupElement.querySelector('.film-details__close-btn').addEventListener('click', removePopup);
};

// =====
// Создаем экземпляры классов
// =====
const filmSectionComponent = new FilmsSectionView();
const filmsByRatingComponent = new FilmsByRatingView();
const filmsByCommentsComponent = new FilmsByCommentsView();

// =====
// рендерим основные компоненты
// =====
render(header, new ProfileBlockView());
render(main, new MainNavBlockView(filters));
render(main, new SortBlockView());
render(main, filmSectionComponent);
render(filmSectionComponent, filmsByRatingComponent);
render(filmSectionComponent, filmsByCommentsComponent);
render(footerStats, new FooterStatsView(films));

// =====
// рендерим фильмы
// =====
if (films.length > 0) {
  renderFilms(filmSectionComponent, FilmCardBlockView, films);
  renderFilmsByKey(filmsByRatingComponent, FilmCardBlockView, films);
  renderFilmsByKey(filmsByCommentsComponent, FilmCardBlockView, films);
} else {
  render(filmSectionComponent, new NoFilmsBlockView());
}

// =====
// Слушатели кликов
// =====
filmSectionComponent.getElement().addEventListener('click', filmsListHandler);
// filmSectionElement.querySelector('.films-list__container').addEventListener('click', filmsListHandler);
// filmsByRatingElement.querySelector('.films-list__container').addEventListener('click', filmsListHandler);
// filmsByCommentsElement.querySelector('.films-list__container').addEventListener('click', filmsListHandler);
