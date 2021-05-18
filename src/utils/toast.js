const SHOW_TIME = 5000;

export const showToast = (message) => {
  const toastItem = document.createElement('div');
  toastItem.innerHTML = `<div class='toast-item__text'>${message}</div>`;
  toastItem.classList.add('toast-item');
  document.body.appendChild(toastItem);

  setTimeout(() => {
    toastItem.remove();
  }, SHOW_TIME);
};
