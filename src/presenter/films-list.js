import AbstractView from '../view/abstract.js';
import SortBlockView from '../view/sort-block.js';
import FilmsSectionView from '../view/films-section.js';
import FilmsByRatingView from '../view/films-by-rating.js';
import FilmsByCommentsView from '../view/films-by-comments.js';
import NoFilmsBlockView from '../view/no-films-block.js';
import ShowMoreButtonView from '../view/button-show-more.js';
import FilmPresenter from '../presenter/film.js';
import PopupPresenter from '../presenter/film-popup.js';
import { render, remove } from '../utils/render.js';
import { updateItem, sortByDate, sortByRating } from '../utils/common.js';
import { FILMS_PER_STEP, SORT_BY, SORT_TYPE, EXTRA_FILMS_CARDS_COUNT } from '../const.js';

export default class FilmsList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._films = null;
    this._comments = null;
    this._renderedFilmsCount = FILMS_PER_STEP;
    this._currentSortType = SORT_TYPE.default;
    this._filmPresentersList = new Map(); // для сохранения всех экземпляров карточек фильмов

    this._sortBlockComponent = new SortBlockView();
    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsByRatingComponent = new FilmsByRatingView();
    this._filmsByCommentsComponent = new FilmsByCommentsView();
    this._noFilmsBlockComponent = new NoFilmsBlockView();
    this._buttonShowMoreComponent = new ShowMoreButtonView();
    this._popupPresenter = null;

    this._handleButtonShowMore = this._handleButtonShowMore.bind(this);
    this._handleFilmsList = this._handleFilmsList.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortButtons = this._handleSortButtons.bind(this);
    this._clearPopupPresenter = this._clearPopupPresenter.bind(this);

    this._filmsListSection = this._filmsSectionComponent.getElement().querySelector('.films-list');
    this._filmsListContainer = this._filmsListSection.querySelector('.films-list__container');

  }

  init(films, comments) {
    this._films = films.slice();
    this._initialFilms = films.slice(); // для сортировки по умолчанию
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
    render(this._filmsContainer, this._filmsSectionComponent);
    // ловим клики по карточкам фильмов
    this._filmsSectionComponent.setFilmCardClickHandler(this._handleFilmsList);
  }

  _renderNoFilmsBlock() {
    this._filmsListSection.innerHTML = '';
    render(this._filmsListSection, this._noFilmsBlockComponent);
  }

  _renderSortBlock() {
    render(this._filmsContainer, this._sortBlockComponent);
    this._sortBlockComponent.setSortButtonsClickHandler(this._handleSortButtons);
  }

  _renderFilmsList(films) {
    this._renderExtraFilmsBlock();
    this._renderFilms(films);
    this._renderFilmsByKey(this._filmsByRatingComponent, films);
    this._renderFilmsByKey(this._filmsByCommentsComponent, films);

  }
  _renderExtraFilmsBlock() {
    render(this._filmsSectionComponent, this._filmsByRatingComponent);
    render(this._filmsSectionComponent, this._filmsByCommentsComponent);
  }

  _renderFilms(filmsArray) {
    // рендерим первые N фильмов
    for (let i = 0; i < Math.min(filmsArray.length, this._renderedFilmsCount); i++) {
      this._renderFilm(this._filmsListContainer, filmsArray[i]);
    }
    // рендерим кнопку показа фильмов, если есть еще фильмы
    if (FILMS_PER_STEP < filmsArray.length) {
      this._renderButtonShowMore();
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

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange);
    filmPresenter.init(film);
    this._filmPresentersList.set(filmPresenter, film.filmInfo.id);
  }

  _renderButtonShowMore() {
    render(this._filmsListSection, this._buttonShowMoreComponent);
    // по клику рендерим больше фильмов
    this._buttonShowMoreComponent.setClickHandler(this._handleButtonShowMore);
  }

  _renderPopup(container, film, callback) {
    this._popupPresenter = new PopupPresenter(container, this._handleFilmChange, callback);
    this._popupPresenter.init(film, this._comments);
    this._filmsSectionComponent.removeFilmCardClickHandler();
  }

  //=====
  // Методы очистки и сортировки
  //=====

  _clearFilmsList() {
    this._filmPresentersList
      .forEach((_id, film) => film.destroy());
    this._filmPresentersList.clear();
    this._renderedFilmsCount = FILMS_PER_STEP;
    remove(this._buttonShowMoreComponent);
  }

  _clearPopupPresenter() {
    this._popupPresenter = null;
    this._filmsSectionComponent.setFilmCardClickHandler(this._handleFilmsList);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SORT_TYPE.date:
        this._films.sort(sortByDate);
        break;
      case SORT_TYPE.rating:
        this._films.sort(sortByRating);
        break;
      default:
        this._films = this._initialFilms.slice();
    }
    this._currentSortType = sortType;
  }

  //=====
  // Обработчики
  //=====

  // обработчик кнопки "Show More"
  _handleButtonShowMore() {
    this._films
      .slice(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_PER_STEP) // берем кусок массива от уже показанных, до + шаг
      .forEach((film) => this._renderFilm(this._filmsListContainer, film));
    this._renderedFilmsCount += FILMS_PER_STEP; // прибавляем к счетчику показанные фильмы
    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._buttonShowMoreComponent);
    }
  }

  // обработчик кликов по карточкам фильмов
  _handleFilmsList(evt) {
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
    // рендерим попап
    this._renderPopup(this._filmsContainer, film, this._clearPopupPresenter);
  }

  // обработчик изменения данных фильма
  _handleFilmChange(updatedFilm) {
    // заменяем в массиве данных измененный фильм
    this._films = updateItem(this._films, updatedFilm);
    this._initialFilms = updateItem(this._initialFilms, updatedFilm); // дефолтный список тоже актуализируем
    // ищем все экземпляры отрендеренных карточек фильмов по id
    // * иногда карточки дублируются в дополнительных блоках
    this._filmPresentersList.forEach((id, component) => {
      if (id === updatedFilm.filmInfo.id) {
        // запускаем их перерисовку
        component.init(updatedFilm);
      }
    });
    // и перерисовку попапа, если он открыт
    if (this._popupPresenter !== null) {
      this._popupPresenter.init(updatedFilm, this._comments);
    }
  }

  // обработчик кнопок сортировки
  _handleSortButtons(sortType) {
    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderFilmsList(this._films);
  }
}
