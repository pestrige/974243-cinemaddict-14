import {getRandomArrayElement, getRandomDate } from '../util.js';

const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const COMMENT_TEXTS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
];
const COMMENT_AUTHORS = [
  'Ilya Reilly',
  'Bagdan Smirnov',
  'Halifa Zamir',
  'Max Brown',
  'Ted Kaczynski',
];

export const gererateComment = () => {
  return {
    id: Math.random(),
    author: getRandomArrayElement(COMMENT_AUTHORS),
    comment: getRandomArrayElement(COMMENT_TEXTS),
    date: getRandomDate(),
    emotion: getRandomArrayElement(EMOTIONS),
  };
};
