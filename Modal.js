const DIFFICULTY_LABELS = ['Easy', 'Medium', 'Hard'];

export class Modal {
  constructor() {
    this._build();
    this._bindEvents();
  }

  // Build DOM 
  _build() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay';
    this.overlay.setAttribute('role', 'dialog');
    this.overlay.setAttribute('aria-modal', 'true');
    this.overlay.setAttribute('aria-labelledby', 'modal-title');
    this.overlay.setAttribute('tabindex', '-1');

    this.overlay.innerHTML = `
      <div class="modal">
        <button class="modal__close" aria-label="Close recipe">✕</button>

        <div class="modal__img-wrap">
          <img class="modal__img" id="modal-img" src="" alt="" />
          <div class="modal__img-overlay"></div>
          <span class="modal__badge" id="modal-badge"></span>
        </div>

        <div class="modal__body">
          <div class="modal__category" id="modal-category"></div>
          <h2 class="modal__title" id="modal-title"></h2>

          <div class="modal__meta" id="modal-meta"></div>

          <div class="modal__section">
            <h4 class="modal__section-title">Ingredients</h4>
            <ul class="modal__ingredients" id="modal-ingredients"></ul>
          </div>

          <div class="modal__section">
            <h4 class="modal__section-title">Instructions</h4>
            <p class="modal__instructions" id="modal-instructions"></p>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.overlay);
  }

  // Events
  _bindEvents() {
    // Close button
    this.overlay.querySelector('.modal__close').addEventListener('click', () => this.close());

    // Click on backdrop
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this.close();
    });

    // Escape key
    this._onKeyDown = e => { if (e.key === 'Escape') this.close(); };
    document.addEventListener('keydown', this._onKeyDown);
  }

  // Public API 
  /**
   * @param {Object} recipe
   */
  open(recipe) {
    const r = recipe;

    this.overlay.querySelector('#modal-img').src = r.img;
    this.overlay.querySelector('#modal-img').alt = r.title;
    this.overlay.querySelector('#modal-badge').textContent = r.badge;
    this.overlay.querySelector('#modal-category').textContent = r.category;
    this.overlay.querySelector('#modal-title').textContent = r.title;

    this.overlay.querySelector('#modal-meta').innerHTML = `
      <span class="modal__meta-item">⏱ ${r.time}</span>
      <span class="modal__meta-item">👥 ${r.servings} servings</span>
      <span class="modal__meta-item">📌 ${DIFFICULTY_LABELS[r.difficulty - 1]}</span>
    `;

    this.overlay.querySelector('#modal-ingredients').innerHTML =
      r.ingredients.map(i => `<li>${i}</li>`).join('');

    this.overlay.querySelector('#modal-instructions').textContent = r.instructions;

    this.overlay.classList.add('modal-overlay--open');
    document.body.style.overflow = 'hidden';

    // Focus management
    requestAnimationFrame(() => {
      this.overlay.querySelector('.modal__close').focus();
    });
  }

  close() {
    this.overlay.classList.remove('modal-overlay--open');
    document.body.style.overflow = '';
  }

  destroy() {
    document.removeEventListener('keydown', this._onKeyDown);
    this.overlay.remove();
  }
}
