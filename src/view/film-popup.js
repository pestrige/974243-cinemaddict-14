import SmartView from './abstract-smart.js';
import { humanizeDate, humanizeFullDate, humanizeDuration } from '../utils/dates.js';
import he from 'he';

export const Emojies = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

// в функцию создания попапа передаем
// объект с данными по фильму, массив комментариев и состояние
const createFilmPopup = ({filmInfo, userDetails}, fullComments, state, error) => {
  const {
    title,
    alternativeTitle,
    rating,
    ageRating,
    poster,
    director,
    writers,
    actors,
    description,
    genres,
    release,
    duration,
  } = filmInfo;
  const {
    isWatchlisted,
    isWatched,
    isFavorite,
  } = userDetails;
  const {
    emojiType,
    textComment,
    isSaving = false,
    isDeleting = false,
    deletingCommentID = null,
  } = state;
  const { isLoadError, errorMsg } = error;

  // создаем список жанров из массива
  const createGenresList = (genres) => {
    const genresList = genres.reduce((genresList, genre) => {
      return `${genresList}<span class="film-details__genre">${genre}</span>`;
    }, '');
    return genresList;
  };

  // ставим аттрибут checked если есть такой ключ у фильма
  const setChecked = (isKey) => isKey ? 'checked' : '';

  // создаем комментарии
  const createCommentCount = () => {
    return isLoadError
      ? `Comments not found. <br>Error ${errorMsg}, reload page please`
      : `Comments <span class="film-details__comments-count">${fullComments.length}</span>`;
  };
  const createComments = () => {
    return fullComments.map(({id, author, comment, date, emotion}) => {
      return `<li class="film-details__comment" data-id="${id}">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${humanizeFullDate(date)}</span>
          <button ${isSaving || isDeleting ? 'disabled' : ''} class="film-details__comment-delete" type="button">${isDeleting && deletingCommentID === id ? 'Deleting...' : 'Delete'}</button>
        </p>
      </div>
    </li>`;
    }).join('');
  };

  // вставляем картинку Emoji
  const createEmojiImage = (emojiType) => {
    return emojiType
      ? `<img src="images/emoji/${emojiType}.png" width="55" height="55" alt="emoji-smile">`
      : '';
  };

  // создаем список Emoji
  const createEmojiList = (emojiType) => {
    const emojies = Object.values(Emojies);
    return emojies.map((emoji) => {
      const isChecked = emoji === emojiType ? 'checked' : '';
      return `
<input ${isSaving ? 'disabled' : ''} class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isChecked}>
<label class="film-details__emoji-label" for="emoji-${emoji}">
  <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
</label>`;
    }).join('').trim();
  };

  // создаем попап
  return `<section class="film-details">
  <div class="film-details__overlay"></div>
    <form ${isSaving ? 'disabled' : ''} class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">
            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors.join(', ')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${humanizeDate(release.date)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${humanizeDuration(duration)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
                <td class="film-details__cell">${createGenresList(genres)}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input ${setChecked(isWatchlisted)} type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist" data-type="watchlist">Add to watchlist</label>

          <input ${setChecked(isWatched)} type="checkbox" class="film-details__control-input visually-hidden" id="history" name="history">
          <label for="history" class="film-details__control-label film-details__control-label--watched" data-type="history">Already watched</label>

          <input ${setChecked(isFavorite)} type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite" data-type="favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">${createCommentCount()}</h3>

          <ul class="film-details__comments-list">${createComments()}</ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${createEmojiImage(emojiType)}</div>

            <label class="film-details__comment-label">
              <textarea ${isSaving ? 'disabled' : ''} class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${textComment ? he.encode(textComment) : ''}</textarea>
            </label>

            <div class="film-details__emoji-list">${createEmojiList(emojiType)}</div>
          </div>
        </section>
      </div>
    </form>

</section>`;
};

export default class FilmPopup extends SmartView {
  constructor(film, comments, error) {
    super();
    this._element = null;
    this._film = film;
    this._comments = comments;
    this._error = error;
    this._deleteButtonClass = 'film-details__comment-delete';
    this._commentContainerClass = 'film-details__comment';
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._controlButtonsClickHandler = this._controlButtonsClickHandler.bind(this);
    this._emojiListClickHandler = this._emojiListClickHandler.bind(this);
    this._commentsListClickHandler = this._commentsListClickHandler.bind(this);
    this._commentsFormKeydownHandler = this._commentsFormKeydownHandler.bind(this);
    this._setEmojiListClickHandler();
  }

  getTemplate() {
    return createFilmPopup(this._film, this._comments, this._state, this._error);
  }

  restoreHandlers() {
    this._setEmojiListClickHandler();
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setControlButtonsClickHandler(this._callback.buttonsClick);
    this.setCommentsListClickHandler(this._callback.deleteButtonClick);
    this.setCommentsFormKeydownHandler(this._callback.commentsFormKeydown);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _controlButtonsClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonsClick(evt);
  }

  _emojiListClickHandler(evt) {
    if (this._state.isSaving) {
      return;
    }
    const findInputValue = (target) => {
      const label = target.closest('.film-details__emoji-label');
      return label ? label.previousElementSibling.value : false;
    };
    const inputValue  = findInputValue(evt.target);

    if (!inputValue) {
      return;
    }
    const commentText = evt.target
      .closest('.film-details__new-comment')
      .querySelector('.film-details__comment-input')
      .value;
    evt.preventDefault();
    this.updateState({emojiType: inputValue, textComment: commentText});
  }

  _commentsListClickHandler(evt) {
    const isButton = evt.target.classList.contains(this._deleteButtonClass);
    if (!isButton) {
      return;
    }
    evt.preventDefault();
    const deletedCommentId = evt.target.closest(`.${this._commentContainerClass}`).dataset.id;
    this._callback.deleteButtonClick(deletedCommentId, this._film);
  }

  _commentsFormKeydownHandler(evt) {
    const isSubmit = evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey);
    if (!isSubmit) {
      return;
    }

    const textComment = evt.target.value.trim();
    if (!textComment) {
      return;
    }
    if (!this._state.emojiType) {
      this._state.emojiType = Emojies.smile;
    }
    this._state.textComment = textComment;
    this._callback.commentsFormKeydown(this._state.textComment, this._state.emojiType, this._film);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closeButtonClickHandler);
  }

  removeCloseButtonClickHandler() {
    this.getElement()
      .querySelector('.film-details__close-btn')
      .removeEventListener('click', this._closeButtonClickHandler);
  }

  setControlButtonsClickHandler(callback) {
    this._callback.buttonsClick = callback;
    this.getElement()
      .querySelector('.film-details__controls')
      .addEventListener('click', this._controlButtonsClickHandler);
  }

  removeControlButtonsClickHandler() {
    this.getElement()
      .querySelector('.film-details__controls')
      .removeEventListener('click', this._controlButtonsClickHandler);
  }

  setCommentsListClickHandler(callback) {
    this._callback.deleteButtonClick = callback;
    this.getElement()
      .querySelector('.film-details__comments-list')
      .addEventListener('click', this._commentsListClickHandler);
  }

  removeCommentsListClickHandler() {
    this.getElement()
      .querySelector('.film-details__comments-list')
      .removeEventListener('click', this._commentsListClickHandler);
  }

  setCommentsFormKeydownHandler(callback) {
    this._callback.commentsFormKeydown = callback;
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('keydown', this._commentsFormKeydownHandler);
  }

  removeCommentsFormKeydownHandler() {
    this.getElement()
      .querySelector('.film-details__comment-input')
      .removeEventListener('keydown', this._commentsFormKeydownHandler);
  }

  _setEmojiListClickHandler() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiListClickHandler);
  }
}
