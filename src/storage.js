// ============================================================
// storage.js — IndexedDB wrapper for offline-first persistence
// ============================================================

const DB_NAME = 'focusflow';
const DB_VERSION = 1;

let db = null;

export function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('tasks')) {
        const ts = d.createObjectStore('tasks', { keyPath: 'id' });
        ts.createIndex('category', 'category', { unique: false });
      }
      if (!d.objectStoreNames.contains('subtasks')) {
        const ss = d.createObjectStore('subtasks', { keyPath: 'id' });
        ss.createIndex('taskId', 'taskId', { unique: false });
        ss.createIndex('status', 'status', { unique: false });
      }
      if (!d.objectStoreNames.contains('appState')) {
        d.createObjectStore('appState', { keyPath: 'key' });
      }
    };
    req.onsuccess = (e) => { db = e.target.result; resolve(db); };
    req.onerror = (e) => reject(e.target.error);
  });
}

function tx(storeName, mode = 'readonly') {
  const t = db.transaction(storeName, mode);
  return t.objectStore(storeName);
}

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ---------- Tasks ----------
export async function addTask(task) {
  await openDB();
  return reqToPromise(tx('tasks', 'readwrite').put(task));
}

export async function getTask(id) {
  await openDB();
  return reqToPromise(tx('tasks').get(id));
}

export async function getAllTasks() {
  await openDB();
  return reqToPromise(tx('tasks').getAll());
}

export async function deleteTask(id) {
  await openDB();
  // Also delete related subtasks
  const subtasks = await getSubtasksByTask(id);
  const store = tx('subtasks', 'readwrite');
  for (const s of subtasks) store.delete(s.id);
  return reqToPromise(tx('tasks', 'readwrite').delete(id));
}

export async function updateTask(task) {
  return addTask(task); // put = upsert
}

// ---------- Subtasks ----------
export async function addSubtask(subtask) {
  await openDB();
  return reqToPromise(tx('subtasks', 'readwrite').put(subtask));
}

export async function getSubtask(id) {
  await openDB();
  return reqToPromise(tx('subtasks').get(id));
}

export async function getAllSubtasks() {
  await openDB();
  return reqToPromise(tx('subtasks').getAll());
}

export async function getSubtasksByTask(taskId) {
  await openDB();
  const index = tx('subtasks').index('taskId');
  return reqToPromise(index.getAll(taskId));
}

export async function updateSubtask(subtask) {
  return addSubtask(subtask);
}

export async function deleteSubtask(id) {
  await openDB();
  return reqToPromise(tx('subtasks', 'readwrite').delete(id));
}

export async function clearCompletedSubtasks(taskId) {
  const subs = await getSubtasksByTask(taskId);
  const store = tx('subtasks', 'readwrite');
  for (const s of subs) {
    if (s.status === 'done') store.delete(s.id);
  }
}

// ---------- App State ----------
export async function getState(key) {
  await openDB();
  const result = await reqToPromise(tx('appState').get(key));
  return result ? result.value : null;
}

export async function setState(key, value) {
  await openDB();
  return reqToPromise(tx('appState', 'readwrite').put({ key, value }));
}
