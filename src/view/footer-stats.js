import AbstractView from './abstract.js';

const createFooterStats = (filmsCount) => {
  return `<section class="footer__statistics">
  <p>${filmsCount} movies inside</p>
</section>`;
};

export default class FooterStats extends AbstractView {
  constructor(films) {
    super();
    this._filmsCount = films.length;
  }

  getTemplate() {
    return createFooterStats(this._filmsCount);
  }
}
