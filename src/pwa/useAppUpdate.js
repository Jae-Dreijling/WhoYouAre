import { useCallback, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

// Wraps the app's service worker registration so a "Check for updates"
// button can trigger a real check, and applying an update just swaps the
// worker and reloads — it never touches localStorage/IndexedDB, so every
// character and photo survives an update untouched.
export function useAppUpdate() {
  const registrationRef = useRef(null);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [supported] = useState(() => 'serviceWorker' in navigator);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      registrationRef.current = registration ?? null;
    },
  });

  const checkForUpdate = useCallback(async () => {
    if (!registrationRef.current) return;
    setChecking(true);
    try {
      await registrationRef.current.update();
    } finally {
      setChecking(false);
      setLastChecked(new Date());
    }
  }, []);

  const applyUpdate = useCallback(() => {
    updateServiceWorker(true);
  }, [updateServiceWorker]);

  return { supported, needRefresh, checking, lastChecked, checkForUpdate, applyUpdate };
}
