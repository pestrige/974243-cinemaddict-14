import AbstractView from './abstract.js';
import { SORT_TYPE } from '../const.js';

const buttonClass = 'sort__button';
const buttonActiveClass = 'sort__button--active';

const createSortBlock = () => {
  return `<ul class="sort">
  <li><a href="#" class="${buttonClass} ${buttonActiveClass}" data-sort="${SORT_TYPE.default}">Sort by default</a></li>
  <li><a href="#" class="${buttonClass}" data-sort="${SORT_TYPE.date}">Sort by date</a></li>
  <li><a href="#" class="${buttonClass}" data-sort="${SORT_TYPE.rating}">Sort by rating</a></li>
</ul>`;
};

export default class SortBlock extends AbstractView {
  constructor() {
    super();
    this._sortBlockElement = this.getElement();
    this._sortButtonsHandler = this._sortButtonsHandler.bind(this);
  }

  getTemplate() {
    return createSortBlock();
  }

  _sortButtonsHandler(evt) {
    const currentButton = evt.target;
    if (!currentButton.classList.contains(buttonClass)) {
      return;
    }

    evt.preventDefault();
    if (currentButton.classList.contains(buttonActiveClass)) {
      return;
    }
    // навешиваем активный класс на кнопку
    this._sortBlockElement
      .querySelectorAll(`.${buttonClass}`)
      .forEach((button) => button.classList.remove(buttonActiveClass));
    currentButton.classList.add(buttonActiveClass);
    // запускаем коллбэк
    this._callback.sortButtonClick(currentButton.dataset.sort);
  }

  setSortButtonsClickHandler(callback) {
    this._callback.sortButtonClick = callback;
    this._sortBlockElement.addEventListener('click', this._sortButtonsHandler);
  }
}

