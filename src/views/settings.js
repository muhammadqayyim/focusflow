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
          
          <div class="settings-actions">
            <button type="submit" class="btn btn-primary btn-lg btn-submit">
              Save Key
            </button>
            <button type="button" id="btn-test-api" class="btn btn-outline btn-lg">
              Test Connection
            </button>
          </div>
          <div id="api-test-results" class="test-results" style="display:none;"></div>
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

  const testBtn = document.getElementById('btn-test-api');
  const resultsDiv = document.getElementById('api-test-results');

  testBtn.addEventListener('click', async () => {
    const key = input.value.trim();
    if (!key) return showToast('⚠️ Error', 'Please enter an API Key first.');

    testBtn.disabled = true;
    testBtn.innerHTML = 'Testing...';
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = '<p class="loading-text">Fetching authorized models...</p>';

    try {
      // Use v1beta for model listing as it usually shows everything
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const models = data.models || [];
      
      if (models.length === 0) {
        resultsDiv.innerHTML = '<p class="error-text">No models found for this key.</p>';
        return;
      }

      // Find relevant models (flash, pro, etc)
      const relevant = models.filter(m => m.name.includes('gemini'));
      
      resultsDiv.innerHTML = `
        <p class="success-text">✅ Connection Successful!</p>
        <p class="results-hint">Found these Gemini models on your key:</p>
        <ul class="model-list">
          ${relevant.map(m => `<li><code>${m.name.replace('models/', '')}</code></li>`).join('')}
        </ul>
        <p class="results-hint">If "gemini-1.5-flash" isn't listed, please enable it in Google AI Studio.</p>
      `;
      showToast('✅ Connected', `Found ${relevant.length} Gemini models!`);
    } catch (e) {
      console.error(e);
      resultsDiv.innerHTML = `<p class="error-text">❌ Connection Failed: ${e.message}</p>`;
      showToast('❌ Failed', 'API Key check failed');
    } finally {
      testBtn.disabled = false;
      testBtn.innerHTML = 'Test Connection';
    }
  });

  return { cleanup: () => {} };
}
