import AbstractView from './abstract.js';

const createButtonShowMore = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ButtonShowMore extends AbstractView {
  constructor() {
    super();
    this._buttonClickHandler = this._buttonClickHandler.bind(this);
  }
  getTemplate() {
    return createButtonShowMore();
  }

  _buttonClickHandler(evt) {
    evt.preventDefault;
    this._callback.buttonClick();
  }

  setClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.getElement().addEventListener('click', this._buttonClickHandler);
  }
}
