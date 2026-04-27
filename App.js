// ─────────────────────────────────────────────
//  App.js  —  Root application orchestrator
//  Wires together: Header → Carousel → Modal
// ─────────────────────────────────────────────

import { Header }     from './Header.js';
import { Carousel }   from './Carousel.js';
import { Modal }      from './Modal.js';
import { recipes }    from './recipes.js';

export class App {
  /**
   * @param {string} rootSelector  – CSS selector for mount point
   */
  constructor(rootSelector = '#app') {
    this.root = document.querySelector(rootSelector);
    if (!this.root) throw new Error(`Mount point "${rootSelector}" not found`);

    this._init();
  }

  _init() {
    // 1. Modal (appended to body, must exist before cards reference it)
    this.modal = new Modal();

    // Shared callback passed down to each RecipeCard
    const handleViewRecipe = (recipe) => this.modal.open(recipe);

    // 2. Header
    new Header(this.root);

    // 3. Carousel (contains RecipeCards internally)
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
