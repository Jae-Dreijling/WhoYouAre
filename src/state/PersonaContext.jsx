import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createStarterCharacters, createYouCharacter } from '../data/characters';
import {
  loadCharacters,
  saveCharacters,
  loadActivePersonaId,
  saveActivePersonaId,
} from '../store/characterStore';
import { deleteImage } from '../store/imageStore';

const PersonaContext = createContext(null);

export function PersonaProvider({ children }) {
  const [characters, setCharacters] = useState(() => loadCharacters() ?? createStarterCharacters());

  const [activePersonaId, setActivePersonaId] = useState(() => {
    const stored = loadActivePersonaId();
    return stored && characters.some((c) => c.id === stored) ? stored : 'you';
  });

  useEffect(() => {
    saveCharacters(characters);
  }, [characters]);

  useEffect(() => {
    saveActivePersonaId(activePersonaId);
  }, [activePersonaId]);

  const activeCharacter = useMemo(
    () => characters.find((c) => c.id === activePersonaId) ?? characters[0],
    [characters, activePersonaId]
  );

  useEffect(() => {
    if (!activeCharacter) return;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', activeCharacter.visual.primaryColor);
    root.style.setProperty('--color-accent', activeCharacter.visual.accentColor);
  }, [activeCharacter]);

  const downloadBackup = useCallback(() => {
    const payload = JSON.stringify({ characters, activePersonaId }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'whoyouare-backup.json';
    link.click();
    URL.revokeObjectURL(url);
  }, [characters, activePersonaId]);

  const importFromFile = useCallback(async (file) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed.characters)) {
        return { success: false, error: 'File is missing a characters list.' };
      }
      let imported = parsed.characters;
      if (!imported.some((c) => c.id === 'you')) {
        imported = [createYouCharacter(), ...imported];
      }
      const activeId =
        typeof parsed.activePersonaId === 'string' &&
        imported.some((c) => c.id === parsed.activePersonaId)
          ? parsed.activePersonaId
          : 'you';

      setCharacters(imported);
      setActivePersonaId(activeId);
      return { success: true };
    } catch {
      return { success: false, error: "That file couldn't be read as a WhoYouAre backup." };
    }
  }, []);

  // Shallow-merges each provided top-level slice (identity, visual, values, ...)
  // into the existing character, so callers only pass the fields they touched.
  const updateCharacter = useCallback((characterId, patch) => {
    setCharacters((prev) =>
      prev.map((c) => {
        if (c.id !== characterId) return c;
        const next = { ...c };
        for (const key of Object.keys(patch)) {
          const value = patch[key];
          const isMergeableObject =
            value && typeof value === 'object' && !Array.isArray(value);
          next[key] = isMergeableObject ? { ...c[key], ...value } : value;
        }
        return next;
      })
    );
  }, []);

  const addCharacter = useCallback((character) => {
    setCharacters((prev) => [...prev, character]);
    setActivePersonaId(character.id);
  }, []);

  const deleteCharacter = useCallback(
    async (characterId) => {
      const target = characters.find((c) => c.id === characterId);
      if (!target) return { success: false, error: 'Persona not found.' };
      if (target.isProtected) return { success: false, error: "This persona can't be deleted." };
      if (characters.length <= 1) {
        return { success: false, error: 'At least one persona has to exist.' };
      }

      if (target.visual.profilePictureId) await deleteImage(target.visual.profilePictureId);
      for (const imageId of target.visual.widgetImageIds) await deleteImage(imageId);

      setCharacters((prev) => prev.filter((c) => c.id !== characterId));
      setActivePersonaId((prev) => (prev === characterId ? 'you' : prev));
      return { success: true };
    },
    [characters]
  );

  const value = useMemo(
    () => ({
      characters,
      activeCharacter,
      activePersonaId,
      setActivePersonaId,
      downloadBackup,
      importFromFile,
      updateCharacter,
      addCharacter,
      deleteCharacter,
    }),
    [
      characters,
      activeCharacter,
      activePersonaId,
      downloadBackup,
      importFromFile,
      updateCharacter,
      addCharacter,
      deleteCharacter,
    ]
  );

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within a PersonaProvider');
  return ctx;
}
