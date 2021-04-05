import { getRandomNumber } from '../util.js';

const FILM_TITLES = [
  'Made For Each Other',
  'Popeye Meets Sinbad',
  'Sagebrush Trail',
  'Santa Claus Conquers The Martians',
  'The Dance Of Life',
  'The Great Flamarion',
  'The Man With The Golden Arm',
];
const POSTERS = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];
const DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
];
const GENRES = [
  'Comedy',
  'Musical',
  'Action',
  'Adventures',
  'Horror',
];
const MAX_COMMENTS = 5;

const generateFilmId = () => getRandomNumber(0, FILM_TITLES.length - 1);

const generateDescription = () => {
  const descriptionLength = getRandomNumber(1, DESCRIPTION.length - 1);
  return DESCRIPTION.slice(0, descriptionLength).join(' ');
};

const generateGenres = () => {
  const maxGenres = getRandomNumber(1, GENRES.length - 1);
  return GENRES.slice(0, maxGenres);
};

const generateEmptyComments = () => {
  return new Array(getRandomNumber(0, MAX_COMMENTS)).fill('');
};

// generate mock film-card data
const generateFilm = () => {
  const filmId = generateFilmId();

  return {
    filmInfo: {
      id: filmId,
      title: FILM_TITLES[filmId],
      rating: 8.3,
      ageRating: 18,
      poster: POSTERS[filmId],
      description: generateDescription(),
      genre: generateGenres(),
      release: '1929',
      duration: 77,
      director: 'Tom Ford',
    },
    userDetails: {
      isWatchlisted: Boolean(getRandomNumber(0, 1)),
      isWatched: Boolean(getRandomNumber(0, 1)),
      isFavorite: Boolean(getRandomNumber(0, 1)),
      date: '2019-05-11T00:00:00.000Z',
    },
    comments: generateEmptyComments(),
  };
};

export { generateFilm };
