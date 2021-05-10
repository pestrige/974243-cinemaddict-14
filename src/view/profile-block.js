import AbstractView from './abstract.js';
import { getRang } from '../utils/common.js';

const createProfileBlock = (filmsCount) => {
  return `<section class="header__profile profile">
  ${filmsCount
    ? `<p class="profile__rating">${getRang(filmsCount)}</p>
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">`
    : ''}
</section>`;
};

export default class ProfileBlock extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
    this._watchedFilmsCount = this._films.length;
  }
  getTemplate() {
    return createProfileBlock(this._watchedFilmsCount);
  }
}
