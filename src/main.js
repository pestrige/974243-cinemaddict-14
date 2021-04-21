import { render } from './utils/render.js';
import ProfileBlockView from './view/profile-block.js';
import MainNavBlockView from './view/main-nav-block.js';
import FooterStatsView from './view/footer-stats.js';
import FilmsListPresenter from './presenter/films-list.js';
import { generateFilm } from './mock/film.js';
import { gererateComment } from './mock/comment.js';
import { generateFilteredFilmsCounts } from './mock/filter.js';
import { FILMS_CARDS_COUNT, MAX_COMMENTS } from './const.js';

const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');
const footerStats = footer.querySelector('.footer__statistics');

// =====
// создаем моковые данные
// =====
const films = new Array(FILMS_CARDS_COUNT).fill().map(generateFilm);
const comments = new Array(MAX_COMMENTS).fill().map(gererateComment);
// создаем массив с количеством фильмов по фильтрам
const filters = generateFilteredFilmsCounts(films);

// =====
// рендерим основные компоненты
// =====
render(header, new ProfileBlockView());
render(main, new MainNavBlockView(filters));
render(footerStats, new FooterStatsView(films));
// инициализируем презентер списка фильмов
const filmsListPresenter = new FilmsListPresenter(main);
filmsListPresenter.init(films, comments);
