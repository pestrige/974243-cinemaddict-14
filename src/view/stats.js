import SmartView from './abstract-smart.js';
import { humanizeDuration, isDateInRange, getDateFrom } from '../utils/dates.js';
import { getRang, getSortedGenres } from '../utils/common.js';
import { renderChart } from '../utils/statistic.js';
import { DATE_PERIOD } from '../const.js';


// вычисляем данные для статистики
const setStats = (films) => {
  const watchedFilmsCount = films.length;
  if (watchedFilmsCount === 0) {
    return {
      watchedFilmsCount: 0,
      totalDuration: false,
      topGenre: false,
    };
  }

  const totalDuration = films.reduce((duration, {filmInfo}) => duration + filmInfo.duration, 0);
  const topGenre = getSortedGenres(films)[0][0];
  return {
    watchedFilmsCount,
    totalDuration: humanizeDuration(totalDuration, {asObject: true}),
    topGenre,
  };
};

// вспомогательные функции
const formatNumber = (number) => {
  if (number < 10) {
    number = '0' + number.toString();
  }
  return number;
};
const humanizePeriod = (period) => {
  return (period[0].toUpperCase() + period.slice(1)).replace(/-/g , ' ');
};

// создаем HTML-разметку блока
const createStatsBlock = (state, films) => {
  const { period, filmsForPeriod} = state;
  const filmsCount = films.length;
  const {watchedFilmsCount, totalDuration, topGenre} = setStats(filmsForPeriod);
  const setChecked = (value) => period === value ? 'checked' : '';

  const createTotalDurationElement = () => {
    return totalDuration
      ? `${formatNumber(totalDuration.hours)}<span class="statistic__item-description">h</span> ${formatNumber(totalDuration.minutes)} <span class="statistic__item-description">m</span>`
      : 'No movies';
  };

  const createStatsFiltersElement = () => {
    let statsFiltersElement = '';
    Object.values(DATE_PERIOD).forEach((period) => {
      return statsFiltersElement = statsFiltersElement + `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${period}" value="${period}" ${setChecked(period)}>
      <label for="statistic-${period}" class="statistic__filters-label">${humanizePeriod(period)}</label>`;
    });
    return statsFiltersElement;
  };

  return `<section class="statistic">
  ${filmsCount
    ? `<p class="statistic__rank">
  Your rank
  <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  <span class="statistic__rank-label">${getRang(filmsCount)}</span>
</p>`
    : ''}

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>
    ${createStatsFiltersElement()}
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${createTotalDurationElement()}</p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre ? topGenre : 'No movies'}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class Stats extends SmartView {
  constructor(films) {
    super();
    this._films = films;
    this._state = { period: DATE_PERIOD.all, filmsForPeriod: this._films.slice()};
    this._dateFiltersClickHandler = this._dateFiltersClickHandler.bind(this);
    this._setDateFiltersClickHandler();
    this._setChart();
  }

  getTemplate() {
    return createStatsBlock(this._state, this._films);
  }

  restoreHandlers() {
    this._setDateFiltersClickHandler();
    this._setChart();
  }

  _setChart() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    renderChart(statisticCtx, this._state);
  }

  _getFilmsForPeriod(period, films) {
    const filmsForPeriod = new Array();
    if (period === DATE_PERIOD.all) {
      return films.slice();
    }
    const dateFrom = getDateFrom(period);
    films.forEach((film) => {
      const filmWatchedDate = film.userDetails.date;
      if (isDateInRange(filmWatchedDate, dateFrom)) {
        filmsForPeriod.push(film);
      }
    });
    return filmsForPeriod;
  }

  _dateFiltersClickHandler(evt) {
    const target = evt.target;
    const isInput = (target) => target.classList.contains('statistic__filters-input');
    if (!isInput(target)) {
      return;
    }
    this.updateState({
      period: target.value,
      filmsForPeriod: this._getFilmsForPeriod(target.value, this._films),
    });
  }

  _setDateFiltersClickHandler() {
    this.getElement().querySelector('.statistic__filters')
      .addEventListener('click', this._dateFiltersClickHandler);
  }
}
