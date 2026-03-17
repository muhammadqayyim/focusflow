// ============================================================
// timer.js — Focus timer overlay with add-time feature
// ============================================================

import { completeSubtask } from '../scheduler.js';
import { sendNotification, showToast } from '../components/notification.js';

let timerInterval = null;
let currentSeconds = 0;
let totalSeconds = 0;

export function renderTimer(subtaskId, minutes, title, onComplete) {
  currentSeconds = minutes * 60;
  totalSeconds = minutes * 60;

  const overlay = document.createElement('div');
  overlay.className = 'timer-overlay';
  overlay.id = 'timer-overlay';
  overlay.innerHTML = `
    <div class="timer-container">
      <div class="timer-header">
        <div class="timer-task-title">${title}</div>
      </div>

      <div class="timer-ring-wrap">
        <svg class="timer-ring" viewBox="0 0 200 200">
          <circle class="timer-ring-bg" cx="100" cy="100" r="88" />
          <circle class="timer-ring-progress" cx="100" cy="100" r="88" 
            stroke-dasharray="${2 * Math.PI * 88}" 
            stroke-dashoffset="0" 
            id="timer-progress-ring" />
        </svg>
        <div class="timer-display" id="timer-display">
          ${formatTime(currentSeconds)}
        </div>
      </div>

      <div class="timer-controls">
        <button class="btn btn-timer btn-pause" id="btn-pause">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          Pause
        </button>
        <button class="btn btn-timer btn-finish-early" id="btn-finish-early">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          I'm Done!
        </button>
      </div>

      <!-- Time's up panel (hidden initially) -->
      <div class="timeup-panel" id="timeup-panel" style="display:none;">
        <div class="timeup-icon">⏰</div>
        <h3>Time's Up!</h3>
        <p>Are you finished, or need more time?</p>
        
        <button class="btn btn-primary btn-lg btn-done-final" id="btn-done-final">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          I'm Done! ✓
        </button>

        <div class="add-time-section">
          <p class="add-time-label">Need more time?</p>
          <div class="add-time-buttons">
            <button class="btn btn-add-time" data-minutes="3">+3 min</button>
            <button class="btn btn-add-time" data-minutes="5">+5 min</button>
            <button class="btn btn-add-time" data-minutes="10">+10 min</button>
          </div>
          <div class="random-time-section">
            <label class="add-time-label">Or pick random minutes:</label>
            <div class="random-time-controls">
              <input type="range" id="random-slider" class="random-slider" min="1" max="30" value="7" />
              <span class="random-value" id="random-value">7 min</span>
            </div>
            <button class="btn btn-add-time btn-random-add" id="btn-random-add">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
              Add Random Time
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('timer-overlay-show'));

  let isPaused = false;
  const display = document.getElementById('timer-display');
  const progressRing = document.getElementById('timer-progress-ring');
  const circumference = 2 * Math.PI * 88;
  const pauseBtn = document.getElementById('btn-pause');

  function updateDisplay() {
    if (display) display.textContent = formatTime(currentSeconds);
    // Update ring
    const progress = 1 - (currentSeconds / totalSeconds);
    const offset = circumference * progress;
    if (progressRing) progressRing.style.strokeDashoffset = offset;
  }

  function tick() {
    if (isPaused) return;
    currentSeconds--;
    updateDisplay();

    if (currentSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      onTimesUp();
    }
  }

  function onTimesUp() {
    sendNotification('⏰ Time\'s Up!', `Timer for "${title}" has ended.`);
    
    // Vibrate on mobile
    if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 200]);

    // Show timeup panel
    document.querySelector('.timer-controls').style.display = 'none';
    document.getElementById('timeup-panel').style.display = 'block';
  }

  function addTime(minutes) {
    currentSeconds += minutes * 60;
    totalSeconds += minutes * 60;
    
    // Hide timeup panel, show controls
    document.getElementById('timeup-panel').style.display = 'none';
    document.querySelector('.timer-controls').style.display = 'flex';
    
    updateDisplay();
    if (!timerInterval) {
      timerInterval = setInterval(tick, 1000);
    }
    showToast('⏱️ Time Added', `+${minutes} minutes added`);
  }

  function closeTimer(completed) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    overlay.classList.remove('timer-overlay-show');
    overlay.classList.add('timer-overlay-hide');
    setTimeout(() => {
      overlay.remove();
      if (completed && onComplete) onComplete();
    }, 400);
  }

  // Start the timer
  timerInterval = setInterval(tick, 1000);

  // Event listeners
  pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.innerHTML = isPaused
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> Resume`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause`;
    pauseBtn.classList.toggle('btn-resume', isPaused);
  });

  document.getElementById('btn-finish-early').addEventListener('click', async () => {
    await completeSubtask(subtaskId);
    showToast('✅ Done!', 'Great focus session!');
    closeTimer(true);
  });

  document.getElementById('btn-done-final').addEventListener('click', async () => {
    await completeSubtask(subtaskId);
    showToast('🎉 Complete!', 'You crushed it!');
    closeTimer(true);
  });

  // Add time buttons
  overlay.querySelectorAll('.btn-add-time[data-minutes]').forEach(btn => {
    btn.addEventListener('click', () => {
      addTime(parseInt(btn.dataset.minutes));
    });
  });

  // Random time slider
  const slider = document.getElementById('random-slider');
  const randomValue = document.getElementById('random-value');
  slider.addEventListener('input', () => {
    randomValue.textContent = `${slider.value} min`;
  });

  document.getElementById('btn-random-add').addEventListener('click', () => {
    const maxMin = parseInt(slider.value);
    const randomMin = Math.max(1, Math.floor(Math.random() * maxMin) + 1);
    addTime(randomMin);
    showToast('🎲 Random Time', `Added ${randomMin} random minutes!`);
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
