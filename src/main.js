import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import MenuModel from './model/menu.js';
import FilmsListPresenter from './presenter/films-list.js';
import FiltersPresenter from './presenter/menu.js';
import { UPDATE_TYPE, API_URL } from './const.js';

// Создаем экземпляры моделей
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const menuModel = new MenuModel();

// Получаем данные
filmsModel.getData(API_URL.movies)
  .then((movies) => filmsModel.adaptToClient(movies))
  //.then((adaptedFilms) => {console.log(adaptedFilms); return adaptedFilms;})
  .then((adaptedFilms) => filmsModel.setFilms(UPDATE_TYPE.init, adaptedFilms))
  .catch(() => filmsModel.setFilms(UPDATE_TYPE.init, []));

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const filtersPresenter = new FiltersPresenter(main, menuModel, filmsModel);
const filmsListPresenter = new FilmsListPresenter(main, header, footer, filmsModel, commentsModel, menuModel);

// инициализируем презентер фильтров
filtersPresenter.init();
// инициализируем презентер списка фильмов
filmsListPresenter.init();
