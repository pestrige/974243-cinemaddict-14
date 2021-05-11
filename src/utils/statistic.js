import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getSortedGenres } from '../utils/common.js';

export const renderChart = (statisticCtx, state) => {
  const BAR_HEIGHT = 50;
  const { filmsForPeriod } = state;
  const sortedGenres = getSortedGenres(filmsForPeriod);
  // создаем массивы для имен и количества жанров
  const genreNames = new Array();
  const genreCounts = new Array();
  sortedGenres.forEach(([name, count]) => {
    genreNames.push(name);
    genreCounts.push(count);
  });

  // рассчитываем высоту canvas от количества элементов диаграммы
  statisticCtx.height = BAR_HEIGHT * sortedGenres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genreNames,
      datasets: [{
        data: genreCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};
