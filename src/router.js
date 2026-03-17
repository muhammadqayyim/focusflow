// ============================================================
// router.js — Simple hash-based router
// ============================================================

const routes = {};
let currentView = null;

export function registerRoute(hash, renderFn) {
  routes[hash] = renderFn;
}

export function navigate(hash) {
  window.location.hash = hash;
}

export function initRouter(defaultHash = '#dashboard') {
  const handleRoute = () => {
    const hash = window.location.hash || defaultHash;
    const renderFn = routes[hash];
    if (renderFn) {
      if (currentView && currentView.cleanup) currentView.cleanup();
      currentView = renderFn();
    }
  };

  window.addEventListener('hashchange', handleRoute);
  // Initial route
  if (!window.location.hash) window.location.hash = defaultHash;
  else handleRoute();
}

export function getCurrentHash() {
  return window.location.hash || '#dashboard';
}
