// src/utils/device.js
// A persistent anonymous "device id" per phone/browser (to stop fake reviews),
// plus tracking of which parts this device has contacted or already rated.

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // if localStorage is unavailable (private browsing etc), the app should still work
  }
}

export function getDeviceId() {
  let id = safeGet("psh_device_id");
  if (!id) {
    id = crypto.randomUUID();
    safeSet("psh_device_id", id);
  }
  return id;
}

function getSet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}
function saveSet(key, set) {
  safeSet(key, JSON.stringify([...set]));
}

export function hasContacted(partId) {
  return getSet("psh_contacted_parts").has(partId);
}
export function markContacted(partId) {
  const s = getSet("psh_contacted_parts");
  s.add(partId);
  saveSet("psh_contacted_parts", s);
}

export function hasRated(partId) {
  return getSet("psh_rated_parts").has(partId);
}
export function markRated(partId) {
  const s = getSet("psh_rated_parts");
  s.add(partId);
  saveSet("psh_rated_parts", s);
}
