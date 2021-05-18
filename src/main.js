import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import MenuModel from './model/menu.js';
import BoardPresenter from './presenter/board.js';
import MenuPresenter from './presenter/menu.js';
import Store from './model/api/store.js';
import Provider from './model/api/provider.js';

import { UpdateType, ApiUrl, DataType } from './const.js';
//import { isOnline } from './utils/common.js';

// Создаем экземпляры моделей
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const menuModel = new MenuModel();

// Создаем хранилище
//const store = new Store(STORE_NAME, window.localStorage);
const provider = new Provider();
const store = provider.getStore(new Store(window.localStorage));

// Получаем данные
filmsModel.getDataToCache(ApiUrl.MOVIES, store, {dataType: DataType.FILMS})
  .then(({data}) => {
    //console.log(data, 'in filmsModel.getDataToCache');
    filmsModel.setItems(UpdateType.INIT, data);
  })
  .catch(() => filmsModel.setItems(UpdateType.INIT, []));

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const menuPresenter = new MenuPresenter(main, menuModel, filmsModel);
const boardPresenter = new BoardPresenter(main, header, footer, filmsModel, commentsModel, menuModel, store);

// инициализируем презентер фильтров
menuPresenter.init();
// инициализируем презентер списка фильмов
boardPresenter.init();

// подключаем service worker, если его поддерживает браузер
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  provider.syncToCache();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
