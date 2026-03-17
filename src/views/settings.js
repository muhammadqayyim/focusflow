// ============================================================
// settings.js — View for Gemini API Key configuration
// ============================================================

import { getState, setState } from '../storage.js';
import { showToast } from '../components/notification.js';

export function renderSettings() {
  const app = document.getElementById('app-content');
  app.innerHTML = `
    <div class="settings-view">
      <div class="view-header">
        <h2>Settings</h2>
        <p class="view-subtitle">Configure your intelligent assistant</p>
      </div>

      <div class="settings-card card-enter">
        <div class="settings-icon">🤖</div>
        <h3>Gemini AI Setup</h3>
        <p class="settings-desc">FocusFlow uses Google's free Gemini API to intelligently break down your tasks into actionable, specific steps.</p>
        
        <form id="api-key-form">
          <div class="form-group">
            <label for="api-key">Gemini API Key</label>
            <input 
              type="password" 
              id="api-key" 
              class="form-input" 
              placeholder="Paste your API key here..."
              autocomplete="off"
            />
            <p class="help-text">
              Don't have one? Get it for free at <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a>.
              Your key is stored <b>only on this device</b> and never sent anywhere else.
            </p>
          </div>
          
          <button type="submit" class="btn btn-primary btn-lg btn-submit">
            Save Key
          </button>
        </form>
      </div>
      
      <div class="settings-card card-enter" style="animation-delay: 0.1s; margin-top: 20px;">
        <h3>About FocusFlow</h3>
        <p class="settings-desc">Designed to beat procrastination by turning overwhelming tasks into tiny, focused steps.</p>
        <p class="settings-desc" style="margin-top: 10px; font-size: 12px; opacity: 0.7;">Version 1.1.0 • Built with Vite & PWA</p>
      </div>
    </div>
  `;

  const form = document.getElementById('api-key-form');
  const input = document.getElementById('api-key');

  // Load existing key
  getState('geminiApiKey').then(key => {
    if (key) input.value = key;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if (!val) {
      await setState('geminiApiKey', null);
      showToast('⚠️ Cleared', 'API Key removed');
      return;
    }
    
    await setState('geminiApiKey', val);
    showToast('✅ Saved!', 'Your API Key is securely stored.');
  });

  return { cleanup: () => {} };
}
