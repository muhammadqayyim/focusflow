// ============================================================
// notification.js — Web Notification API + in-app toast
// ============================================================

let permissionGranted = false;

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') {
    permissionGranted = true;
    return true;
  }
  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    permissionGranted = perm === 'granted';
    return permissionGranted;
  }
  return false;
}

export function sendNotification(title, body) {
  if (permissionGranted && document.hidden) {
    new Notification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      vibrate: [200, 100, 200]
    });
  }
  // Always show in-app toast
  showToast(title, body);
}

export function showToast(title, body, duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-title">${title}</div>
    ${body ? `<div class="toast-body">${body}</div>` : ''}
  `;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('toast-show'));

  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

export function showGlobalLoading(title = 'Working...', message = 'Please wait while I process that.') {
  let overlay = document.getElementById('global-loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'global-loading-overlay';
    overlay.className = 'global-loading-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="loading-content">
      <div class="spinner spin-slow" style="width: 50px; height: 50px; border-width: 4px; border-radius: 50%; border: 4px solid var(--border); border-top-color: var(--primary); animation: spin 1s linear infinite; margin: 0 auto;"></div>
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;

  requestAnimationFrame(() => overlay.classList.add('show'));
}

export function hideGlobalLoading() {
  const overlay = document.getElementById('global-loading-overlay');
  if (overlay) {
    overlay.classList.remove('show');
    setTimeout(() => {
      if (!overlay.classList.contains('show')) {
        // Double check no other process showed it in the meantime
        overlay.innerHTML = '';
      }
    }, 300);
  }
}
