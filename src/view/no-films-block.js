import AbstractView from './abstract.js';

const createNoFilmsBlock = () => {
  return '<h2 class="films-list__title">There are no movies in our database</h2>';
};

export default class ShowMoreButton extends AbstractView {
  getTemplate() {
    return createNoFilmsBlock();
  }
}
