// ─────────────────────────────────────────────
//  main.js  —  Entry point
//  Bootstraps the App when the DOM is ready.
// ─────────────────────────────────────────────

import { App } from './App.js';

document.addEventListener('DOMContentLoaded', () => {
  window.__app = new App('#app');
});
