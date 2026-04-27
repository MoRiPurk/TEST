// ─────────────────────────────────────────────
//  components/Header.js
//  Renders the "RECOMMENDED / Recipes" heading
// ─────────────────────────────────────────────

export class Header {
  /**
   * @param {HTMLElement} container  – where to mount
   */
  constructor(container) {
    this.container = container;
    this.render();
  }

  render() {
    const el = document.createElement('div');
    el.className = 'section-header';
    el.innerHTML = `
      <span class="section-header__eyebrow">Recommended</span>
      <h1 class="section-header__title">Recipes</h1>
    `;
    this.container.appendChild(el);
  }
}
