import AbstractView from './abstract.js';

const createLoadingBlock = () => {
  return `<section class="films">
  <section class="films-list">
    <h2 class="films-list__title">Loading...</h2>
  </section>
</section>`;
};

export default class Loading extends AbstractView {
  constructor() {
    super();
  }
  getTemplate() {
    return createLoadingBlock();
  }
}
