// Structured character data lives in localStorage (Phase 1). Profile pictures
// and widget images move to IndexedDB in Phase 2, once there's an upload UI
// to exercise it — no point wiring an image store nothing can fill yet.

const CHARACTERS_KEY = 'whoyouare.characters.v1';
const ACTIVE_ID_KEY = 'whoyouare.activePersonaId.v1';

export function loadCharacters() {
  try {
    const raw = localStorage.getItem(CHARACTERS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveCharacters(characters) {
  try {
    localStorage.setItem(CHARACTERS_KEY, JSON.stringify(characters));
  } catch {
    // Storage full or unavailable (private browsing) — state still works
    // in-memory for the session, it just won't survive a reload.
  }
}

export function loadActivePersonaId() {
  try {
    return localStorage.getItem(ACTIVE_ID_KEY);
  } catch {
    return null;
  }
}

export function saveActivePersonaId(id) {
  try {
    localStorage.setItem(ACTIVE_ID_KEY, id);
  } catch {
    // see saveCharacters
  }
}
