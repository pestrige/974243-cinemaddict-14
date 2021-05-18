import Api from './api.js';
import { isOnline } from '../../utils/common.js';
import { ApiUrl, DataType } from '../../const.js';

const getSyncedFilms = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.film);
};

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
      console.log('run online');
      return this.getData(dataUrl, dataType)
        .then((data) => {
          // В зависимости от типа данных обрабатываем их и передаем в хранилище
          const adaptedToServer = dataType === DataType.FILMS ? [...data].map(this._adaptToServer) : data;
          const items = createStoreStructure(adaptedToServer);
          console.log(items, 'online after createStoreStructure');
          this._store.setItems(items, dataType, id);
          return {data, isCached: true};
        });
    }

    // если офлайн, возвращаем данные из хранилища
    const storeData = Object.values(this._store.getItems(dataType, id));
    //console.log(storeData, 'storeData in offline');
    const adaptedStoreData = dataType === DataType.FILMS
      ? [...storeData].map((item) => this._adaptToClient(item))
      : storeData;
    //флаг, если нет закешированных данных (нужно для комментариев)
    const isCached = storeData.length > 0;
    console.log(adaptedStoreData, 'adaptedStoreData in offline')
    return Promise.resolve({data: adaptedStoreData, isCached});
  }

  updateDataToCache(data, dataType, id) {
    if (isOnline()) {
      return this.updateData(data)
        .then((updatedTask) => {
          this._store.setItem(updatedTask.id, this._adaptToServer(updatedTask), dataType, id);
          return updatedTask;
        });
    }

    this._store.setItem(data.id, this._adaptToServer(Object.assign({}, data)), dataType, id);

    return Promise.resolve(data);
  }

  addDataToCache(data) {
    if (isOnline()) {
      return this.addData(data)
        .then((newData) => {
          this._store.setItem(newData.id, this._adaptToServer(newData));
          return newData;
        });
    }

    return Promise.reject(new Error('Add task failed'));
  }

  syncToCache() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdFilms = getSyncedFilms(response.created);
          const updatedFilms = getSyncedFilms(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdFilms, ...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
