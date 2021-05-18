import Api from './api.js';
import { isOnline } from '../../utils/common.js';
import { DataType } from '../../const.js';

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider extends Api {
  constructor() {
    super();
  }

  getStore(store) {
    this._store = store;
    return this._store;
  }

  getDataToCache(dataUrl, store, {dataType = DataType.COMMENTS, id = null}) {
    this._store = store;
    if (isOnline()) {
      return this.getData(dataUrl, dataType)
        .then((data) => {
          // В зависимости от типа данных обрабатываем их и передаем в хранилище
          const adaptedToServer = dataType === DataType.FILMS ? [...data].map(this._adaptToServer) : data;
          const items = createStoreStructure(adaptedToServer);
          this._store.setItems(items, dataType, id);
          return {data, isCached: true};
        });
    }

    // если офлайн, возвращаем данные из хранилища
    const storeData = Object.values(this._store.getItems(dataType, id));
    const adaptedStoreData = dataType === DataType.FILMS
      ? [...storeData].map((item) => this._adaptToClient(item))
      : storeData;
    //флаг, если нет закешированных данных (нужно для комментариев)
    const isCached = storeData.length > 0;
    return Promise.resolve({data: adaptedStoreData, isCached});
  }

  updateDataToCache(data) {
    if (isOnline()) {
      return this.updateData(data)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.filmInfo.id, this._adaptToServer(updatedFilm), DataType.FILMS);
          return updatedFilm;
        });
    }

    this._store.setItem(data.filmInfo.id, this._adaptToServer(Object.assign({}, data)), DataType.FILMS);

    return Promise.resolve(data);
  }

  syncToCache() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());
      return this.sync(storeFilms)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const updatedFilms = response.updated;

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([ ...updatedFilms]);
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
