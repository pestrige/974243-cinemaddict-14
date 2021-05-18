const STORE_PREFIX = 'cinemaaddict-localstorage';
const STORE_VER = 'v1.0';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

export default class Store {
  constructor(storage) {
    this._storage = storage;
    this._storeKey = STORE_NAME;
  }

  getItems(dataType, id = null) {
    try {
      return JSON.parse(this._storage.getItem(`${this._storeKey}-${dataType}-${id}`)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, dataType, id) {
    this._storage.setItem(
      `${this._storeKey}-${dataType}-${id}`,
      JSON.stringify(items),
    );
  }

  setItem(key, value, dataType, id) {
    const store = this.getItems(dataType, id);

    this._storage.setItem(
      `${this._storeKey}-${dataType}-${id}`,
      JSON.stringify(
        Object.assign({}, store, {
          [key]: value,
        }),
      ),
    );
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
      this._storeKey,
      JSON.stringify(store),
    );
  }
}
