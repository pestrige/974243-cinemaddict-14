import { DataType } from '../../const';

const STORE_PREFIX = 'cinemaaddict-localstorage';
const STORE_VER = 'v1.0';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export default class Store {
  constructor(storage) {
    this._storage = storage;
    this._storeKey = STORE_NAME;
  }

  getItems(dataType = DataType.FILMS, id = null) {
    const cacheName = this._getCacheName(dataType, id);
    try {
      return JSON.parse(this._storage.getItem(cacheName)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, dataType, id) {
    const cacheName = this._getCacheName(dataType, id);
    this._storage.setItem(
      cacheName,
      JSON.stringify(items),
    );
  }

  setItem(key, value, dataType, id) {
    const store = this.getItems(dataType, id);
    const cacheName = this._getCacheName(dataType, id);

    this._storage.setItem(
      cacheName,
      JSON.stringify(
        Object.assign({}, store, {
          [key]: value,
        }),
      ),
    );
  }

  _getCacheName(dataType, id) {
    return dataType === DataType.FILMS
      ? `${this._storeKey}-${dataType}`
      : `${this._storeKey}-${dataType}-${id}`;
  }
}
