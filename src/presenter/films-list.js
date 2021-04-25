import AbstractView from '../view/abstract.js';
import SortBlockView from '../view/sort-block.js';
import FilmsSectionView from '../view/films-section.js';
import FilmsByRatingView from '../view/films-by-rating.js';
import FilmsByCommentsView from '../view/films-by-comments.js';
import NoFilmsBlockView from '../view/no-films-block.js';
import ShowMoreButtonView from '../view/button-show-more.js';
import FilmPopupView from '../view/film-popup.js';
import FilmPresenter from '../presenter/film.js';
import { render, remove, replace } from '../utils/render.js';
import { updateItem } from '../utils/common.js';
import { FILMS_PER_STEP, SORT_BY, EXTRA_FILMS_CARDS_COUNT } from '../const.js';

export default class FilmsList {
  constructor(filmsContainer) {
    this._filmsContainer = filmsContainer;
    this._films = null;
    this._comments = null;
    this._renderedFilms = FILMS_PER_STEP;
    this._filmPresentersList = new Map(); // для сохранения всех экземпляров карточек фильмов

    this._sortBlockComponent = new SortBlockView();
    this._filmsSectionComponent = new FilmsSectionView();
    this._filmsByRatingComponent = new FilmsByRatingView();
    this._filmsByCommentsComponent = new FilmsByCommentsView();
    this._noFilmsBlockComponent = new NoFilmsBlockView();
    this._buttonShowMoreComponent = new ShowMoreButtonView();
    this._filmPopupComponent = null;

    this._handleButtonShowMore = this._handleButtonShowMore.bind(this);
    this._handleFilmsList = this._handleFilmsList.bind(this);
    this._handleClosePopupButton = this._handleClosePopupButton.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortButtons = this._handleSortButtons.bind(this);

    this._filmsListSection = this._filmsSectionComponent.getElement().querySelector('.films-list');
    this._filmsListContainer = this._filmsListSection.querySelector('.films-list__container');

  }

  init(films, comments) {
    this._films = films.slice();
    this._comments = comments;

    if (this._films.length > 0) {
      this._renderSortBlock();
      this._renderFilmsContainer();
      this._renderFilmsList(this._films);
    } else {
      this._renderFilmsContainer();
      this._renderNoFilmsBlock();
    }
    //console.log(this._filmPresentersList);
    //console.log(this._filmPresentersList.values());
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
    for (let i = 0; i < Math.min(filmsArray.length, FILMS_PER_STEP); i++) {
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

  _renderPopup(film) {
    const oldPopupComponent = this._filmPopupComponent;
    this._filmPopupComponent = new FilmPopupView(film, this._comments);
    // рендерим попап
    if (oldPopupComponent === null) {
      render(this._filmsContainer, this._filmPopupComponent);
    } else {
      // если попап открыт перерисовываем
      const scrollY = oldPopupComponent.getElement().scrollTop;
      replace(oldPopupComponent, this._filmPopupComponent);
      this._filmPopupComponent.getElement().scrollTop = scrollY;
      remove(oldPopupComponent);
    }
    // находим экземпляр презентера фильма
    let filmPresenter;
    this._filmPresentersList.forEach((id, presenter) => {
      if (id === film.filmInfo.id) {
        filmPresenter = presenter;
      }
    });
    // навешиваем нужные классы и слушатели
    document.body.classList.add('hide-overflow');
    document.addEventListener('keydown', this._handleEscKeyDown);
    this._filmsSectionComponent.removeFilmCardClickHandler();
    this._filmPopupComponent.setCloseButtonClickHandler(this._handleClosePopupButton);
    this._filmPopupComponent.setControlButtonsClick(filmPresenter.handleControlButtons);
  }

  //=====
  // Методы удаления и очистки
  //=====

  _removePopup() {
    remove(this._filmPopupComponent);
    this._filmPopupComponent = null;
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._handleEscKeyDown);
    this._filmsSectionComponent.setFilmCardClickHandler(this._handleFilmsList);
  }

  _clearFilmsList() {
    this._filmPresentersList
      .forEach((_id, film) => film.destroy());
    this._filmPresentersList.clear();
    this._renderedFilms = FILMS_PER_STEP;
    remove(this._buttonShowMoreComponent);
  }

  //=====
  // Обработчики
  //=====

  // обработчик кнопки "Show More"
  _handleButtonShowMore() {
    this._films
      .slice(this._renderedFilms, this._renderedFilms + FILMS_PER_STEP) // берем кусок массива от уже показанных, до + шаг
      .forEach((film) => this._renderFilm(this._filmsListContainer, film));
    this._renderedFilms += FILMS_PER_STEP; // прибавляем к счетчику показанные фильмы

    if (this._renderedFilms >= this._films.length) {
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
    this._renderPopup(film);
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

  // обработчик изменения данных фильма
  _handleFilmChange(updatedFilm) {
    // заменяем в массиве данных измененный фильм
    this._films = updateItem(this._films, updatedFilm);
    // ищем все экземпляры отрендеренных карточек фильмов по id
    // * иногда карточки дублируются в дополнительных блоках
    this._filmPresentersList.forEach((id, component) => {
      if (id === updatedFilm.filmInfo.id) {
        // запускаем их перерисовку
        component.init(updatedFilm);
      }
    });
    // перерисовка попапа, если есть
    if (this._filmPopupComponent !== null) {
      this._renderPopup(updatedFilm);
    }
  }

  // обработчик кнопок сортировки
  _handleSortButtons(sortType) {
    // отсортировать фильмы
    // очистить список фильмов
    // отрендендерить новый список фильмов
    console.log(sortType);
  }
}
