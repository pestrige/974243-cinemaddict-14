import { render } from './utils/render.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import MenuModel from './model/menu.js';
import FooterStatsView from './view/footer-stats.js';
import FilmsListPresenter from './presenter/films-list.js';
import FiltersPresenter from './presenter/menu.js';
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
const commentsModel = new CommentsModel();
const menuModel = new MenuModel();
filmsModel.setFilms(films);
commentsModel.setComments(comments);

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStats = footer.querySelector('.footer__statistics');
const filtersPresenter = new FiltersPresenter(main, menuModel, filmsModel);
const filmsListPresenter = new FilmsListPresenter(main, header, filmsModel, commentsModel, menuModel);

// =====
// рендерим основные компоненты
// =====
render(footerStats, new FooterStatsView(filmsModel.getFilms()));
// инициализируем презентер фильтров
filtersPresenter.init();
// инициализируем презентер списка фильмов
filmsListPresenter.init();
