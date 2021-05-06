import { render } from './utils/render.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FiltersModel from './model/filter.js';
import ProfileBlockView from './view/profile-block.js';
import FooterStatsView from './view/footer-stats.js';
import FilmsListPresenter from './presenter/films-list.js';
import FiltersPresenter from './presenter/filter.js';
import { generateFilm } from './mock/film.js';
import { generateComment } from './mock/comment.js';
import { FILMS_CARDS_COUNT, MAX_COMMENTS } from './const.js';

// =====
// создаем моковые данные
// =====
const films = new Array(FILMS_CARDS_COUNT).fill().map(generateFilm);
const comments = new Array(MAX_COMMENTS).fill().map(() => generateComment());

// Создаем экземпляры моделей
const filmsModel = new FilmsModel();
filmsModel.setFilms(films);
const commentsModel = new CommentsModel();
const filtersModel = new FiltersModel();
commentsModel.setComments(comments);

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStats = footer.querySelector('.footer__statistics');
const filtersPresenter = new FiltersPresenter(main, filtersModel, filmsModel);
const filmsListPresenter = new FilmsListPresenter(main, filmsModel, commentsModel, filtersModel);

// =====
// рендерим основные компоненты
// =====
render(header, new ProfileBlockView());
render(footerStats, new FooterStatsView(films));
// инициализируем презентер фильтров
filtersPresenter.init();
// инициализируем презентер списка фильмов
filmsListPresenter.init(comments);
