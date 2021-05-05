import { getRandomNumber, generateFloat } from '../utils/common.js';
import { getRandomDate } from '../utils/dates.js';
import { MAX_SHOWN_COMMENTS, MAX_COMMENTS } from '../const.js';

const FILM_TITLES = [
  'Made For Each Other',
  'Popeye Meets Sinbad',
  'Sagebrush Trail',
  'Santa Claus Conquers The Martians',
  'The Dance Of Life',
  'The Great Flamarion',
  'The Man With The Golden Arm',
];

const ALTER_FILM_TITLES = [
  'Alternative Made For Each Other',
  'Alternative Popeye Meets Sinbad',
  'Alternative Sagebrush Trail',
  'Alternative Santa Claus Conquers The Martians',
  'Alternative The Dance Of Life',
  'Alternative The Great Flamarion',
  'Alternative The Man With The Golden Arm',
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
  'Cartoon',
  'Film-Noir',
  'Mystery',
  'Drama',
];
const DURATION_RANGE = {
  min: 60,
  max: 120,
};

const generateFilmId = () => Math.random().toString();

const generateRating = () => generateFloat(1, 10);

const generateDescription = () => {
  const descriptionLength = getRandomNumber(1, DESCRIPTION.length - 1);
  return DESCRIPTION.slice(0, descriptionLength).join(' ');
};

const generateGenres = () => {
  const maxGenres = getRandomNumber(1, GENRES.length - 1);
  return GENRES
    .sort(() => Math.random() - 0.5) // Перемешиваем массив
    .slice(0, maxGenres);
};

const generateCommentsId = () => {
  return new Array(getRandomNumber(0, MAX_SHOWN_COMMENTS))
    .fill('')
    .map(() => getRandomNumber(0, MAX_COMMENTS - 1));
};

// Генерируем моковые данные фильма
const generateFilm = () => {
  const filmTitleId = getRandomNumber(0, FILM_TITLES.length - 1);
  const duration = getRandomNumber(DURATION_RANGE.min, DURATION_RANGE.max);

  return {
    filmInfo: {
      id: generateFilmId(),
      title: FILM_TITLES[filmTitleId],
      alternativeTitle: ALTER_FILM_TITLES[filmTitleId],
      rating: generateRating(),
      ageRating: 18,
      poster: POSTERS[filmTitleId],
      description: generateDescription(),
      genres: generateGenres(),
      release: {
        date: getRandomDate(),
        country: 'Finland',
      },
      duration,
      director: 'Tom Ford',
      writers: ['Takeshi Kitano', 'Quentin Tarantino', 'Christopher Nolan'],
      actors: ['Morgan Freeman', 'Leonardo DiCaprio', 'Robert De Niro', 'Brad Pitt'],
    },
    userDetails: {
      isWatchlisted: Boolean(getRandomNumber(0, 1)),
      isWatched: Boolean(getRandomNumber(0, 1)),
      isFavorite: Boolean(getRandomNumber(0, 1)),
      date: '2019-05-11T00:00:00.000Z',
    },
    comments: generateCommentsId(),
  };
};

export { generateFilm };
