import AbstractView from './abstract.js';
import { SortType } from '../const.js';

const buttonClass = 'sort__button';
const buttonActiveClass = 'sort__button--active';

const createSortBlock = (currentSortType) => {
  return `<ul class="sort">
  <li><a href="#" class="${buttonClass} ${currentSortType === SortType.DEFAULT ? buttonActiveClass : ''}" data-sort="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="${buttonClass} ${currentSortType === SortType.DATE ? buttonActiveClass : ''}" data-sort="${SortType.DATE}">Sort by date</a></li>
  <li><a href="#" class="${buttonClass} ${currentSortType === SortType.RATING ? buttonActiveClass : ''}" data-sort="${SortType.RATING}">Sort by rating</a></li>
</ul>`;
};

export default class SortBlock extends AbstractView {
  constructor(currentSortType) {
    super();
    this._currentSortType = currentSortType;
    this._element = this.getElement();
    this._sortButtonsHandler = this._sortButtonsHandler.bind(this);
  }

  getTemplate() {
    return createSortBlock(this._currentSortType);
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

    this._callback.sortButtonClick(currentButton.dataset.sort);
  }

  setSortButtonsClickHandler(callback) {
    this._callback.sortButtonClick = callback;
    this._element.addEventListener('click', this._sortButtonsHandler);
  }
}

