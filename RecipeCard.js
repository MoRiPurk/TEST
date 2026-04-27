// ─────────────────────────────────────────────
//  components/RecipeCard.js
//  Single recipe card — image, badge, meta,
//  difficulty dots, and "View Recipe" CTA.
// ─────────────────────────────────────────────

const DIFFICULTY_LABELS = ['Easy', 'Medium', 'Hard'];

export class RecipeCard {
  /**
   * @param {Object}   recipe          – recipe data object
   * @param {Function} onViewRecipe    – callback(recipe) when CTA clicked
   */
  constructor(recipe, onViewRecipe) {
    this.recipe = recipe;
    this.onViewRecipe = onViewRecipe;
    this.el = this._build();
  }

  _build() {
    const r = this.recipe;
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', r.title);

    card.innerHTML = `
      <div class="recipe-card__img-wrap">
        <img
          class="recipe-card__img"
          src="${r.img}"
          alt="${r.title}"
          loading="lazy"
        />
        <span class="recipe-card__badge">${r.badge}</span>
        <span class="recipe-card__time-chip">
          ${IconClock()} ${r.time}
        </span>
      </div>

      <div class="recipe-card__body">
        <div class="recipe-card__category">${r.category}</div>
        <h3 class="recipe-card__title">${r.title}</h3>

        <div class="recipe-card__meta">
          <span class="recipe-card__meta-item">
            ${IconPeople()} ${r.servings} servings
          </span>
          <span class="recipe-card__meta-item">
            ${IconFlame()} ${DIFFICULTY_LABELS[r.difficulty - 1]}
          </span>
        </div>

        <div class="recipe-card__footer">
          <button class="recipe-card__btn" aria-label="View ${r.title} recipe">
            View Recipe
          </button>
          <div class="recipe-card__difficulty" aria-label="Difficulty: ${r.difficulty} out of 3">
            ${[1, 2, 3]
              .map(d => `<span class="recipe-card__dot${d <= r.difficulty ? ' recipe-card__dot--active' : ''}"></span>`)
              .join('')}
          </div>
        </div>
      </div>
    `;

    card.querySelector('.recipe-card__btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.onViewRecipe(this.recipe);
    });

    return card;
  }

  /** Returns the root DOM element */
  getElement() {
    return this.el;
  }
}

// ── Inline SVG helpers ───────────────────────
function IconClock() {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
}
function IconPeople() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
}
function IconFlame() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;
}
