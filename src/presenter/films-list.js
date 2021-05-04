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
import { sortByDate, sortByRating, filter } from '../utils/common.js';
import { FILMS_PER_STEP, SORT_BY, SORT_TYPE, EXTRA_FILMS_CARDS_COUNT, UPDATE_TYPE } from '../const.js';

export default class FilmsList {
  constructor(filmsContainer, filmsModel, filtersModel) {
    this._filmsContainer = filmsContainer;
    this._filmsModel = filmsModel;
    this._filtersModel = filtersModel;
    this._comments = null;
    this._renderedFilmsCount = FILMS_PER_STEP;
    this._currentSortType = SORT_TYPE.default;
    this._filmPresentersList = new Map(); // для сохранения всех экземпляров карточек фильмов

    this._sortBlockComponent = null;
    this._filmsSectionComponent = null;
    this._filmsListSection = null;
    this._filmsListContainer = null;
    this._filmsByRatingComponent = new FilmsByRatingView();
    this._filmsByCommentsComponent = new FilmsByCommentsView();
    this._noFilmsBlockComponent = new NoFilmsBlockView();
    this._buttonShowMoreComponent = null;
    this._popupPresenter = null;

    this._handleButtonShowMore = this._handleButtonShowMore.bind(this);
    this._handleFilmsList = this._handleFilmsList.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortButtons = this._handleSortButtons.bind(this);
    this._clearPopupPresenter = this._clearPopupPresenter.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init(comments) {
    this._comments = comments;
    this._renderFilmsBoard();
  }

  // Получаем массив отсортированных фильмов из модели
  _getFilms() {
    const films = this._filmsModel.getFilms().slice();
    const filterType = this._filtersModel.getFilter();
    const filteredFilms = filter[filterType](films);
    switch (this._currentSortType) {
      case SORT_TYPE.date:
        filteredFilms.sort(sortByDate);
        break;
      case SORT_TYPE.rating:
        filteredFilms.sort(sortByRating);
        break;
    }
    return filteredFilms;
  }

  //=====
  // Методы рендера
  //=====

  // основной метод отрисовки фильтров, сортировки и фильмов
  _renderFilmsBoard(update = null) {
    if (this._getFilms().length > 0) {
      this._renderSortBlock();
      this._renderFilmsContainer();
      this._renderFilmsList(this._getFilms());
    } else {
      this._renderFilmsContainer();
      this._renderNoFilmsBlock();
    }
    if (this._popupPresenter !== null) {
      this._popupPresenter.init(update, this._comments);
    }
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

  _renderFilms(filmsArray) {
    // рендерим первые N фильмов
    for (let i = 0; i < Math.min(filmsArray.length, this._renderedFilmsCount); i++) {
      this._renderFilm(this._filmsListContainer, filmsArray[i]);
    }
    // рендерим кнопку показа фильмов, если есть еще фильмы
    if (this._renderedFilmsCount < filmsArray.length) {
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
    this._popupPresenter = new PopupPresenter(container, this._handleViewAction, callback);
    this._popupPresenter.init(film, this._comments);
    this._filmsSectionComponent.removeFilmCardClickHandler();
  }

  //=====
  // Методы очистки и перерисовки
  //=====

  _clearFilmsBoard({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;
    this._filmPresentersList
      .forEach((_id, film) => film.destroy());
    this._filmPresentersList.clear();
    remove(this._buttonShowMoreComponent);
    remove(this._sortBlockComponent);
    remove(this._filmsSectionComponent);

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILMS_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SORT_TYPE.default;
    }
  }

  _clearPopupPresenter() {
    this._popupPresenter = null;
    this._filmsSectionComponent.setFilmCardClickHandler(this._handleFilmsList);
  }

  _rerenderChangedFilm(updatedFilm) {
    // ищем все экземпляры отрендеренных карточек фильмов по id
    // так как иногда карточки дублируются в дополнительных блоках
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
    this._clearFilmsBoard({resetRenderedFilmsCount: true});
    this._renderFilmsBoard();
  }

  // обработчик действий на карточке фильма
  // вызывает обновление модели
  _handleViewAction(updateType, updatedFilm) {
    this._filmsModel.updateFilm(updateType, updatedFilm);
  }

  // обработчик изменений модели
  // вызывает перерисовку компонентов по типу обновления
  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UPDATE_TYPE.patch:
        this._rerenderChangedFilm(data);
        break;
      case UPDATE_TYPE.minor:
        this._clearFilmsBoard();
        this._renderFilmsBoard(data);
        break;
      case UPDATE_TYPE.major:
        this._clearFilmsBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderFilmsBoard(data);
        break;
    }
  }
}
