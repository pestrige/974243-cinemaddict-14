import { render } from './util.js';
import ProfileBlockView from './view/profile-block.js';
import MainNavBlockView from './view/main-nav-block.js';
import SortBlockView from './view/sort-block.js';
import FilmsSectionView from './view/films-section.js';
import FilmsByRatingView from './view/films-by-rating.js';
import FilmsByCommentsView from './view/films-by-comments.js';
import FooterStatsView from './view/footer-stats.js';
import FilmCardBlockView from './view/film-card-block.js';
import NoFilmsBlockView from './view/no-films-block.js';
import ShowMoreButtonView from './view/button-show-more.js';
import FilmPopupView from './view/film-popup.js';
import { generateFilm } from './mock/film.js';
import { gererateComment } from './mock/comment.js';
import { generateFilteredFilmsCounts } from './mock/filter.js';
import { FILMS_CARDS_COUNT, FILMS_PER_STEP, EXTRA_FILMS_CARDS_COUNT, MAX_COMMENTS, SORT_BY } from './const.js';

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
// шаблон рендера фильмов
// =====
const renderFilms = (container, films) => {
  const filmsList = container.querySelector('.films-list');
  const filmsListContainer = filmsList.querySelector('.films-list__container');

  // рендерим первые N фильмов или заглушку, если фильмов нет
  for (let i = 0; i < Math.min(films.length, FILMS_PER_STEP); i++) {
    render(filmsListContainer, new FilmCardBlockView(films[i]).getElement());
  }

  // рендерим кнопку показа фильмов, если есть еще фильмы
  if (FILMS_PER_STEP < films.length) {
    let renderedFilms = FILMS_PER_STEP;
    const showMoreButtonComponent = new ShowMoreButtonView();
    const showMoreButtonElement = showMoreButtonComponent.getElement();
    render(filmsList, showMoreButtonElement);

    // по клику рендерим больше фильмов
    showMoreButtonElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilms, renderedFilms + FILMS_PER_STEP) // берем кусок массива от уже показанных, до + шаг
        .forEach((film) => render(filmsListContainer, new FilmCardBlockView(film).getElement()));
      renderedFilms += FILMS_PER_STEP; // прибавляем к счетчику показанные фильмы

      if (renderedFilms >= films.length) {
        showMoreButtonElement.remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }
};

// =====
// шаблон для рендера фильмов, осортированных по ключу
// =====
const renderFilmsByKey = (container, films) => {
  const isTopRated = container.classList.contains('films-list--top-rated');
  const filmsList = isTopRated
    ? container.querySelector('.films-list--top-rated .films-list__container')
    : container.querySelector('.films-list--most-commented .films-list__container');
  const [key, value] = isTopRated ? SORT_BY.rating.split('.') : SORT_BY.comments.split('.');
  const sortedFilms = films.slice();

  sortedFilms
    .sort((a, b) => b[key][value] - a[key][value])
    .slice(0, EXTRA_FILMS_CARDS_COUNT)
    .forEach((film) => render(filmsList, new FilmCardBlockView(film).getElement()));
};

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
  render(body, filmPopupElement);
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
const filmSectionElement = new FilmsSectionView().getElement();
const filmsByRatingElement = new FilmsByRatingView().getElement();
const filmsByCommentsElement = new FilmsByCommentsView().getElement();

// =====
// рендерим основные компоненты
// =====
render(header, new ProfileBlockView().getElement());
render(main, new MainNavBlockView(filters).getElement());
render(main, new SortBlockView().getElement());
render(main, filmSectionElement);
render(filmSectionElement, filmsByRatingElement);
render(filmSectionElement, filmsByCommentsElement);
render(footerStats, new FooterStatsView(films).getElement());

// =====
// рендерим фильмы
// =====
if (films.length > 0) {
  renderFilms(filmSectionElement, films);
  renderFilmsByKey(filmsByRatingElement, films);
  renderFilmsByKey(filmsByCommentsElement, films);
} else {
  render(filmSectionElement, new NoFilmsBlockView().getElement());
}

// =====
// Слушатели кликов
// =====
filmSectionElement.addEventListener('click', filmsListHandler);
// filmSectionElement.querySelector('.films-list__container').addEventListener('click', filmsListHandler);
// filmsByRatingElement.querySelector('.films-list__container').addEventListener('click', filmsListHandler);
// filmsByCommentsElement.querySelector('.films-list__container').addEventListener('click', filmsListHandler);
