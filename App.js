import { Header }     from './Header.js';
import { Carousel }   from './Carousel.js';
import { Modal }      from './Modal.js';
import { recipes }    from './recipes.js';

export class App {
  /**
   * @param {string} rootSelector
   */
  constructor(rootSelector = '#app') {
    this.root = document.querySelector(rootSelector);
    if (!this.root) throw new Error(`Mount point "${rootSelector}" not found`);

    this._init();
  }

  _init() {
    this.modal = new Modal();

    const handleViewRecipe = (recipe) => this.modal.open(recipe);

    new Header(this.root);

    const carouselMount = document.createElement('div');
    carouselMount.className = 'carousel-mount';
    this.root.appendChild(carouselMount);

    this.carousel = new Carousel(carouselMount, recipes, handleViewRecipe);
  }

  destroy() {
    this.carousel.destroy();
    this.modal.destroy();
  }
}
