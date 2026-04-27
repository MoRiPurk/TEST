// ─────────────────────────────────────────────
//  components/Carousel.js
//  Responsive, draggable/swipeable card slider
//  with prev/next arrows and dot indicators.
// ─────────────────────────────────────────────

import { RecipeCard } from './RecipeCard.js';

export class Carousel {
  /**
   * @param {HTMLElement} container
   * @param {Object[]}    recipes
   * @param {Function}    onViewRecipe  – forwarded to each RecipeCard
   */
  constructor(container, recipes, onViewRecipe) {
    this.container = container;
    this.recipes = recipes;
    this.onViewRecipe = onViewRecipe;

    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.dragDelta = 0;

    this._build();
    this._bindEvents();
    this._update();
  }

  // ── Build DOM skeleton ───────────────────────
  _build() {
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel';

    // Prev button
    this.prevBtn = document.createElement('button');
    this.prevBtn.className = 'carousel__nav carousel__nav--prev';
    this.prevBtn.setAttribute('aria-label', 'Previous');
    this.prevBtn.innerHTML = ArrowLeft();

    // Next button
    this.nextBtn = document.createElement('button');
    this.nextBtn.className = 'carousel__nav carousel__nav--next';
    this.nextBtn.setAttribute('aria-label', 'Next');
    this.nextBtn.innerHTML = ArrowRight();

    // Track outer (clips overflow)
    const outer = document.createElement('div');
    outer.className = 'carousel__outer';

    this.track = document.createElement('div');
    this.track.className = 'carousel__track';
    this.track.setAttribute('role', 'list');

    // Inject cards
    this.recipes.forEach(recipe => {
      const card = new RecipeCard(recipe, this.onViewRecipe);
      const li = document.createElement('div');
      li.className = 'carousel__item';
      li.setAttribute('role', 'listitem');
      li.appendChild(card.getElement());
      this.track.appendChild(li);
    });

    outer.appendChild(this.track);

    // Dots
    this.dotsEl = document.createElement('div');
    this.dotsEl.className = 'carousel__dots';
    this.dotsEl.setAttribute('role', 'tablist');
    this._buildDots();

    wrapper.appendChild(this.prevBtn);
    wrapper.appendChild(this.nextBtn);
    wrapper.appendChild(outer);
    wrapper.appendChild(this.dotsEl);

    this.wrapper = wrapper;
    this.container.appendChild(wrapper);
  }

  _buildDots() {
    this.dotsEl.innerHTML = '';
    const total = Math.ceil(this.recipes.length / this._perView());
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.dataset.slide = i;
      this.dotsEl.appendChild(dot);
    }
  }

  // ── Events ───────────────────────────────────
  _bindEvents() {
    this.prevBtn.addEventListener('click', () => this._step(-1));
    this.nextBtn.addEventListener('click', () => this._step(1));

    this.dotsEl.addEventListener('click', e => {
      const dot = e.target.closest('.carousel__dot');
      if (dot) this._goToSlide(parseInt(dot.dataset.slide));
    });

    // Mouse drag
    this.track.addEventListener('mousedown', e => this._dragStart(e.clientX));
    this.track.addEventListener('mousemove', e => { if (this.isDragging) this._dragMove(e.clientX); });
    this.track.addEventListener('mouseup', () => this._dragEnd());
    this.track.addEventListener('mouseleave', () => this._dragEnd());

    // Touch swipe
    this.track.addEventListener('touchstart', e => this._dragStart(e.touches[0].clientX), { passive: true });
    this.track.addEventListener('touchmove', e => { if (this.isDragging) this._dragMove(e.touches[0].clientX); }, { passive: true });
    this.track.addEventListener('touchend', () => this._dragEnd());

    // Keyboard
    this.wrapper.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') this._step(-1);
      if (e.key === 'ArrowRight') this._step(1);
    });

    // Resize
    this._resizeObserver = new ResizeObserver(() => {
      this.currentIndex = 0;
      this._buildDots();
      this._update();
    });
    this._resizeObserver.observe(this.container);
  }

  // ── Drag helpers ─────────────────────────────
  _dragStart(x) {
    this.isDragging = true;
    this.startX = x;
    this.dragDelta = 0;
    this.track.classList.add('carousel__track--grabbing');
  }

  _dragMove(x) {
    this.dragDelta = x - this.startX;
    const base = this.currentIndex * this._itemWidth();
    this.track.style.transition = 'none';
    this.track.style.transform = `translateX(${-(base - this.dragDelta)}px)`;
  }

  _dragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.track.classList.remove('carousel__track--grabbing');
    this.track.style.transition = '';

    const threshold = 60;
    if (this.dragDelta < -threshold) this._step(1);
    else if (this.dragDelta > threshold) this._step(-1);
    else this._apply(); // snap back

    this.dragDelta = 0;
  }

  // ── Navigation ───────────────────────────────
  _step(dir) {
    this.currentIndex += dir * this._perView();
    this._clamp();
    this._update();
  }

  _goToSlide(slideIndex) {
    this.currentIndex = slideIndex * this._perView();
    this._clamp();
    this._update();
  }

  _clamp() {
    const max = this.recipes.length - this._perView();
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, max));
  }

  _apply() {
    this.track.style.transform = `translateX(${-this.currentIndex * this._itemWidth()}px)`;
  }

  _update() {
    this._apply();
    this._syncDots();
    this._syncNavButtons();
  }

  // ── Sync UI state ────────────────────────────
  _syncDots() {
    const slideIndex = Math.floor(this.currentIndex / this._perView());
    this.dotsEl.querySelectorAll('.carousel__dot').forEach((dot, i) => {
      dot.classList.toggle('carousel__dot--active', i === slideIndex);
      dot.setAttribute('aria-selected', i === slideIndex);
    });
  }

  _syncNavButtons() {
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= this.recipes.length - this._perView();
  }

  // ── Helpers ──────────────────────────────────
  _perView() {
    const w = this.container.offsetWidth;
    if (w <= 560) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  _itemWidth() {
    const item = this.track.querySelector('.carousel__item');
    return item ? item.offsetWidth + 20 : 0; // 20 = gap
  }

  destroy() {
    this._resizeObserver.disconnect();
  }
}

// ── SVG arrow helpers ────────────────────────
function ArrowLeft() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>`;
}
function ArrowRight() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
}
