/**
 * Register service worker.
 */
function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
          .then((reg) => {
            console.log('Service worker registered.', reg);
          });
    });
  }
}

export default { register };