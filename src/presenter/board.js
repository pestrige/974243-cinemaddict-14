import AbstractView from '../view/abstract.js';
import ProfileBlockView from '../view/profile-block.js';
import LoadingBlockView from '../view/loading-block.js';
import SortBlockView from '../view/sort-block.js';
import FilmsSectionView from '../view/films-section.js';
import FilmsByRatingView from '../view/films-by-rating.js';
import FilmsByCommentsView from '../view/films-by-comments.js';
import NoFilmsBlockView from '../view/no-films-block.js';
import ShowMoreButtonView from '../view/button-show-more.js';
import FooterStatsView from '../view/footer-stats.js';
import FilmPresenter from './film.js';
import PopupPresenter from './film-popup.js';
import StatsPresenter from './stats.js';
import { render, remove } from '../utils/render.js';
import { sortByDate, sortByRating, filter } from '../utils/common.js';
import { FILMS_PER_STEP, SortBy, SortType, EXTRA_FILMS_CARDS_COUNT, UpdateType, FilterType } from '../const.js';

export default class BoardPresenter {
  constructor(filmsContainer, headerContainer, footerContainer, filmsModel, commentsModel, menuModel, store) {
    this._filmsContainer = filmsContainer;
    this._headerContainer = headerContainer;
    this._footerContainer = footerContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._menuModel = menuModel;
    this._store = store;
    this._renderedFilmsCount = FILMS_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresentersList = new Map(); // для сохранения всех экземпляров карточек фильмов
    this._isLoading = true;

    this._loadingBlockComponent = new LoadingBlockView();
    this._profileBlockComponent = null;
    this._sortBlockComponent = null;
    this._filmsSectionComponent = null;
    this._filmsListSection = null;
    this._filmsListContainer = null;
    this._filmsByRatingComponent = new FilmsByRatingView();
    this._filmsByCommentsComponent = new FilmsByCommentsView();
    this._noFilmsBlockComponent = new NoFilmsBlockView();
    this._buttonShowMoreComponent = null;
    this._footerStatsComponent = null;

    this._popupPresenter = null;
    this._statsPresenter = null;

    this._handleButtonShowMore = this._handleButtonShowMore.bind(this);
    this._handleFilmsList = this._handleFilmsList.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortButtons = this._handleSortButtons.bind(this);
    this._clearPopupPresenter = this._clearPopupPresenter.bind(this);
  }

  init() {
    this._render();
    this._filmsModel.addObserver(this._handleModelEvent);
    this._menuModel.addObserver(this._handleModelEvent);
  }

  // Получаем массив отсортированных фильмов из модели
  _getFilms({totalCount = false} = {}) {
    const films = this._filmsModel.getItems().slice();
    const filterType = this._menuModel.getActiveFilter();
    const filteredFilms = filter[filterType](films);
    switch (this._currentSortType) {
      case SortType.DATE:
        filteredFilms.sort(sortByDate);
        break;
      case SortType.RATING:
        filteredFilms.sort(sortByRating);
        break;
    }
    return totalCount ? films : filteredFilms;
  }

  //получаем массив просмотренных фильмов
  _getWatchedFilms() {
    const films = this._filmsModel.getItems().slice();
    return filter[FilterType.HISTORY](films);
  }

  //=====
  // Методы рендера
  //=====

  // основной метод отрисовки фильтров, сортировки и фильмов
  _render(update = null) {
    if (this._isLoading) {
      render(this._filmsContainer, this._loadingBlockComponent);
      return;
    }
    if (this._statsPresenter) {
      this._statsPresenter.destroy();
      this._statsPresenter = null;
    }
    if (this._getFilms().length > 0) {
      this._renderProfileBlock();
      this._renderSortBlock();
      this._renderFilmsContainer();
      this._renderFilmsList(this._getFilms());
    } else {
      this._renderFilmsContainer();
      this._renderNoFilmsBlock();
    }
    this._renderFooterStats(this._getFilms({totalCount: true}));
    this._rerenderPopup(update);
  }

  _renderProfileBlock() {
    this._profileBlockComponent = new ProfileBlockView(this._getWatchedFilms());
    render(this._headerContainer, this._profileBlockComponent);
  }

  _renderSortBlock() {
    this._sortBlockComponent = new SortBlockView(this._currentSortType);
    render(this._filmsContainer, this._sortBlockComponent);
    this._sortBlockComponent.setSortButtonsClickHandler(this._handleSortButtons);
  }

  // контейнер для секций films-list и films-list--extra
  _renderFilmsContainer() {
    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsListSection = this._filmsSectionComponent.getElement().querySelector('.films-list');
    this._filmsListContainer = this._filmsListSection.querySelector('.films-list__container');

    render(this._filmsContainer, this._filmsSectionComponent);
    this._filmsSectionComponent.setFilmCardClickHandler(this._handleFilmsList); // ловим клики по карточкам фильмов
  }

  // контейнер для фильмов: основной блок, top-rated и most-commented
  _renderFilmsList(films) {
    this._renderExtraFilmsBlock();
    this._renderFilms(films);
    this._renderFilmsByKey(this._filmsByRatingComponent, films);
    this._renderFilmsByKey(this._filmsByCommentsComponent, films);
  }

  _renderNoFilmsBlock() {
    this._filmsListSection.innerHTML = '';
    render(this._filmsListSection, this._noFilmsBlockComponent);
  }

  _renderExtraFilmsBlock() {
    render(this._filmsSectionComponent, this._filmsByRatingComponent);
    render(this._filmsSectionComponent, this._filmsByCommentsComponent);
  }

  _renderFilms(films) {
    // рендерим первые N фильмов
    for (let i = 0; i < Math.min(films.length, this._renderedFilmsCount); i++) {
      this._renderFilm(this._filmsListContainer, films[i]);
    }
    // рендерим кнопку показа фильмов, если есть еще фильмы
    if (this._renderedFilmsCount < films.length) {
      this._renderButtonShowMore();
    }
  }

  _renderFilmsByKey(container, films) {
    if (container instanceof AbstractView) {
      container = container.getElement();
    }

    const isTopRated = container.classList.contains('films-list--top-rated');
    const filmsList = isTopRated
      ? container.querySelector('.films-list--top-rated .films-list__container')
      : container.querySelector('.films-list--most-commented .films-list__container');
    const [key, value] = isTopRated ? SortBy.RATING.split('.') : SortBy.COMMENTS.split('.');
    const sortedFilms = films.slice();

    // проверка на нулевые рейтинг и комментарии
    const ratingSum = sortedFilms.reduce((sum, current) => sum + Number(current.filmInfo.rating), 0);
    const commentSum = sortedFilms.reduce((sum, current) => sum + current.comments.length, 0);
    if ((isTopRated && ratingSum === 0) || (!isTopRated && commentSum === 0)) {
      isTopRated
        ? remove(this._filmsByRatingComponent)
        : remove(this._filmsByCommentsComponent);
    } else {
      sortedFilms
        .sort((a, b) => b[key][value] - a[key][value])
        .slice(0, EXTRA_FILMS_CARDS_COUNT)
        .forEach((film) => this._renderFilm(filmsList, film));
    }
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction);
    filmPresenter.init(film);
    this._filmPresentersList.set(filmPresenter, film.filmInfo.id);
  }

  _renderButtonShowMore() {
    this._buttonShowMoreComponent = new ShowMoreButtonView();
    render(this._filmsListSection, this._buttonShowMoreComponent);
    // по клику рендерим больше фильмов
    this._buttonShowMoreComponent.setClickHandler(this._handleButtonShowMore);
  }

  _renderPopup(container, film, callback) {
    this._popupPresenter = new PopupPresenter(container, this._commentsModel, this._store, this._handleViewAction, callback);
    this._popupPresenter.init(film);
    this._filmsSectionComponent.removeFilmCardClickHandler();
    this._commentsModel.addObserver(this._handleModelEvent);
  }

  _renderStats() {
    this._statsPresenter = new StatsPresenter(this._filmsContainer, this._filmsModel);
    this._statsPresenter.init();
  }

  _renderFooterStats(films) {
    this._footerStatsComponent = new FooterStatsView(films);
    render(this._footerContainer, this._footerStatsComponent);
  }

  //=====
  // Методы очистки и перерисовки
  //=====

  _clearFilmsSection() {
    // удаляем только фильмы, кнопку и контейнеры для списка фильмов
    this._filmPresentersList
      .forEach((_id, film) => film.destroy());
    this._filmPresentersList.clear();
    remove(this._buttonShowMoreComponent);
    remove(this._filmsSectionComponent);
  }

  _clear({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    // удаляем все, что связано с данными
    const filmsCount = this._getFilms().length;
    remove(this._profileBlockComponent);
    remove(this._sortBlockComponent);
    remove(this._footerStatsComponent);
    this._clearFilmsSection();

    resetRenderedFilmsCount
      ? this._renderedFilmsCount = FILMS_PER_STEP
      : this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _clearPopupPresenter() {
    this._popupPresenter = null;
    this._filmsSectionComponent.setFilmCardClickHandler(this._handleFilmsList);
    this._commentsModel.removeObserver(this._handleModelEvent);
  }

  _rerenderPopup(film) {
    if (this._popupPresenter !== null) {
      this._popupPresenter.init(film);
    }
  }

  _rerenderFilms(updatedFilm) {
    this._filmsModel.updateFilm(false, updatedFilm);
    this._clearFilmsSection();

    this._rerenderPopup(updatedFilm);
    this._renderFilmsContainer();
    this._renderFilmsList(this._getFilms());
  }

  //=====
  // Обработчики
  //=====

  // обработчик кнопки "Show More"
  _handleButtonShowMore() {
    this._getFilms()
      .slice(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_PER_STEP) // берем кусок массива от уже показанных, до + шаг
      .forEach((film) => this._renderFilm(this._filmsListContainer, film));
    this._renderedFilmsCount += FILMS_PER_STEP; // прибавляем к счетчику показанные фильмы
    if (this._renderedFilmsCount >= this._getFilms().length) {
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
    const film = this._getFilms().find(({filmInfo}) => filmCardId === filmInfo.id);
    // рендерим попап
    this._renderPopup(this._filmsContainer, film, this._clearPopupPresenter);
  }

  // обработчик кнопок сортировки
  _handleSortButtons(sortType) {
    this._currentSortType = sortType;
    this._clear({resetRenderedFilmsCount: true});
    this._render();
  }

  // обработчик действий на карточке фильма и попапе
  // вызывает обновление данных
  _handleViewAction(updateType, updatedFilm) {
    this._filmsModel.updateData(updatedFilm)
      .then((film) => this._filmsModel.updateFilm(updateType, film));
  }

  // обработчик изменений модели
  // вызывает перерисовку компонентов по типу обновления
  _handleModelEvent(
    updateType,
    data,
    {
      statsFlag = false,
      isError = false,
      deletedCommentId = null,
    } = {}) {
    if (statsFlag) {
      this._clear();
      this._renderStats();
      return;
    }

    if (isError || isError) {
      this._popupPresenter.shake(deletedCommentId);
      return;
    }

    switch (updateType) {
      case UpdateType.PATCH:
        this._rerenderFilms(data);
        break;
      case UpdateType.MINOR:
        this._clear();
        this._render(data);
        break;
      case UpdateType.MAJOR:
        this._clear({resetRenderedFilmsCount: true, resetSortType: true});
        this._render(data);
        break;
      case UpdateType.INIT:
        this._isLoading = false,
        remove(this._loadingBlockComponent);
        this._render(data);
    }
  }
}
