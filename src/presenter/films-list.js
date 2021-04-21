import AbstractView from '../view/abstract.js';
import SortBlockView from '../view/sort-block.js';
import FilmsSectionView from '../view/films-section.js';
import FilmsByRatingView from '../view/films-by-rating.js';
import FilmsByCommentsView from '../view/films-by-comments.js';
import FilmCardBlockView from '../view/film-card-block.js';
import NoFilmsBlockView from '../view/no-films-block.js';
import ShowMoreButtonView from '../view/button-show-more.js';
import FilmPopupView from '../view/film-popup.js';
import { render, remove } from '../utils/render.js';
import { FILMS_PER_STEP, SORT_BY, EXTRA_FILMS_CARDS_COUNT } from '../const.js';

export default class FilmsList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._films = null;
    this._comments = null;
    this._renderedFilms = FILMS_PER_STEP;

    this._sortBlockComponent = new SortBlockView();
    this._filmSectionComponent = new FilmsSectionView();
    this._filmsByRatingComponent = new FilmsByRatingView();
    this._filmsByCommentsComponent = new FilmsByCommentsView();
    this._noFilmsBlockComponent = new NoFilmsBlockView();
    this._buttonShowMoreComponent = new ShowMoreButtonView();
    this._filmPopupComponent = null;

    this._handleButtonShowMore = this._handleButtonShowMore.bind(this);
    this._handleFilmsList = this._handleFilmsList.bind(this);
    this._handleClosePopupButton = this._handleClosePopupButton.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);

    this._filmsListSection = this._filmSectionComponent.getElement().querySelector('.films-list');
    this._filmsListContainer = this._filmsListSection.querySelector('.films-list__container');

  }

  init(films, comments) {
    this._films = films;
    this._comments = comments;

    if (this._films.length > 0) {
      this._renderSortBlock();
      this._renderFilmsContainer();
      this._renderFilmsList(this._films);
    } else {
      this._renderFilmsContainer();
      this._renderNoFilmsBlock();
    }
  }

  //=====
  // Методы рендера
  //=====

  _renderFilmsContainer() {
    render(this._filmsContainer, this._filmSectionComponent);
    // ловим клики по карточкам фильмов
    this._filmSectionComponent.setFilmCardClickHandler(this._handleFilmsList);
  }

  _renderNoFilmsBlock() {
    this._filmsListSection.innerHTML = '';
    render(this._filmsListSection, this._noFilmsBlockComponent);
  }

  _renderSortBlock() {
    render(this._filmsContainer, this._sortBlockComponent);
  }

  _renderFilmsList(films) {
    this._renderExtraFilmsBlock();
    this._renderFilms(films);
    this._renderFilmsByKey(this._filmsByRatingComponent, films);
    this._renderFilmsByKey(this._filmsByCommentsComponent, films);

  }
  _renderExtraFilmsBlock() {
    render(this._filmSectionComponent, this._filmsByRatingComponent);
    render(this._filmSectionComponent, this._filmsByCommentsComponent);
  }

  _renderFilms(filmsArray) {
    // рендерим первые N фильмов
    for (let i = 0; i < Math.min(filmsArray.length, FILMS_PER_STEP); i++) {
      this._renderFilm(this._filmsListContainer, filmsArray[i]);
    }

    // рендерим кнопку показа фильмов, если есть еще фильмы
    if (FILMS_PER_STEP < filmsArray.length) {
      this._renderButtonShowMore();
      // по клику рендерим больше фильмов
      this._buttonShowMoreComponent.setClickHandler(this._handleButtonShowMore);
    }
  }

  _renderFilmsByKey(container, filmsArray) {
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
      .forEach((film) => this._renderFilm(filmsList, film));
  }

  _renderButtonShowMore() {
    render(this._filmsListSection, this._buttonShowMoreComponent);
  }

  _renderFilm(container, film) {
    render(container, new FilmCardBlockView(film));
  }

  _renderPopup(film) {
    this._filmPopupComponent = new FilmPopupView(film, this._comments);
    render(this._filmsContainer, this._filmPopupComponent);
    document.body.classList.add('hide-overflow');
  }

  _removePopup() {
    remove(this._filmPopupComponent);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._handleEscKeyDown);
  }

  //=====
  // Обработчики событий
  //=====

  // обработчик кнопки "Show More"
  _handleButtonShowMore(evt) {
    evt.preventDefault();
    this._films
      .slice(this._renderedFilms, this._renderedFilms + FILMS_PER_STEP) // берем кусок массива от уже показанных, до + шаг
      .forEach((film) => this._renderFilm(this._filmsListContainer, film));
    this._renderedFilms += FILMS_PER_STEP; // прибавляем к счетчику показанные фильмы

    if (this._renderedFilms >= this._films.length) {
      remove(this._buttonShowMoreComponent);
    }
  }

  // обработчик закрытия попапа
  _handleClosePopupButton() {
    this._removePopup();
  }

  // обработчик Esc
  _handleEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      this._removePopup();
    }
  }

  // обработчик кликов по карточкам фильмов
  _handleFilmsList(evt) {
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
    const film = this._films.find(({filmInfo}) => filmCardId === filmInfo.id);
    // рендерим попап на основе найденного фильма
    this._renderPopup(film);
    // слушаем клики и Esc
    this._filmPopupComponent.setCloseButtonClickHandler(this._handleClosePopupButton);
    document.addEventListener('keydown', this._handleEscKeyDown);
  }
}
