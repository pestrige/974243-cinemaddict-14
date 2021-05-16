import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import MenuModel from './model/menu.js';
import FilmsListPresenter from './presenter/films-list.js';
import FiltersPresenter from './presenter/menu.js';
import { UpdateType, ApiUrl, DataType } from './const.js';

// Создаем экземпляры моделей
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const menuModel = new MenuModel();

// Получаем данные
filmsModel.getData(ApiUrl.MOVIES, DataType.FILMS)
  .then((films) => filmsModel.setFilms(UpdateType.INIT, films))
  .catch(() => filmsModel.setFilms(UpdateType.INIT, []));

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const filtersPresenter = new FiltersPresenter(main, menuModel, filmsModel);
const filmsListPresenter = new FilmsListPresenter(main, header, footer, filmsModel, commentsModel, menuModel);

// инициализируем презентер фильтров
filtersPresenter.init();
// инициализируем презентер списка фильмов
filmsListPresenter.init();
