import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createStarterCharacters, createYouCharacter } from '../data/characters';
import {
  loadCharacters,
  saveCharacters,
  loadActivePersonaId,
  saveActivePersonaId,
} from '../store/characterStore';

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

  const updateCharacterVisual = useCallback((characterId, patch) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === characterId ? { ...c, visual: { ...c.visual, ...patch } } : c))
    );
  }, []);

  const value = useMemo(
    () => ({
      characters,
      activeCharacter,
      activePersonaId,
      setActivePersonaId,
      downloadBackup,
      importFromFile,
      updateCharacterVisual,
    }),
    [
      characters,
      activeCharacter,
      activePersonaId,
      downloadBackup,
      importFromFile,
      updateCharacterVisual,
    ]
  );

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within a PersonaProvider');
  return ctx;
}
