import AbstractView from './abstract.js';

const createFilmsByRatingSection = () => {
  return `<section class="films-list films-list--extra films-list--top-rated">
    <h2 class="films-list__title">Top rated</h2>
    <div class="films-list__container"></div>
</section>`;
};

export default class FilmsByRating extends AbstractView {
  getTemplate() {
    return createFilmsByRatingSection();
  }
}
