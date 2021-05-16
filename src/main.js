import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import MenuModel from './model/menu.js';
import BoardPresenter from './presenter/board.js';
import MenuPresenter from './presenter/menu.js';
import { UpdateType, ApiUrl, DataType } from './const.js';

// Создаем экземпляры моделей
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const menuModel = new MenuModel();

// Получаем данные
filmsModel.getData(ApiUrl.MOVIES, DataType.FILMS)
  .then((films) => filmsModel.set(UpdateType.INIT, films))
  .catch(() => filmsModel.set(UpdateType.INIT, []));

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const menuPresenter = new MenuPresenter(main, menuModel, filmsModel);
const boardPresenter = new BoardPresenter(main, header, footer, filmsModel, commentsModel, menuModel);

// инициализируем презентер фильтров
menuPresenter.init();
// инициализируем презентер списка фильмов
boardPresenter.init();
