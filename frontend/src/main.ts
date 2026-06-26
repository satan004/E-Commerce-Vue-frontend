import './assets/style/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './routes';
import pinia from './store';

const app = createApp(App);

// Global error handler so anything that throws is visible in the console
// and shown on the page instead of silently leaving an empty slot.
app.config.errorHandler = (err, _instance, info) => {
  // eslint-disable-next-line no-console
  console.error('[Vue Error]', info, err);
  const root = document.getElementById('app');
  if (root && !root.querySelector('.mm-fatal-error')) {
    const div = document.createElement('div');
    div.className = 'mm-fatal-error';
    div.style.cssText =
      'position:fixed;top:0;left:0;right:0;background:#ff3b30;color:#fff;padding:16px;z-index:99999;font-family:monospace;font-size:13px;white-space:pre-wrap;';
    div.textContent = 'App error: ' + (err instanceof Error ? err.message : String(err));
    root.appendChild(div);
  }
};

window.addEventListener('error', (e) => {
  // eslint-disable-next-line no-console
  console.error('[Window Error]', e.message, e.error);
});
window.addEventListener('unhandledrejection', (e) => {
  // eslint-disable-next-line no-console
  console.error('[Unhandled Promise]', e.reason);
});

app.use(pinia);
app.use(router);
app.mount('#app');