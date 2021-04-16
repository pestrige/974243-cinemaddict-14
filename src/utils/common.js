// Генерируем рандомное целое число
export const getRandomNumber = (a = 0, b = 0) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Генерируем нецелое случайное число
export const generateFloat = (a, b, digits = 1) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  const exponent = Math.pow(10, digits);
  const random = min + Math.random() * (max - min);

  return (Math.trunc(random * exponent) / exponent).toFixed(digits); //toFixed для отображения нулей
};

// Получаем рандомный элемент массива
export const getRandomArrayElement = (array) => {
  const randomId = getRandomNumber(0, array.length - 1);
  return array[randomId];
};
