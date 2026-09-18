import { usePersonaTheme } from '../theme/ThemeContext';
import './PersonaSwitcher.css';

// Placeholder switcher over the 3 dummy color schemes (Phase 0).
// Phase 1 replaces this with the real Persona Switcher over actual characters.
export default function PersonaSwitcher() {
  const { themes, activeTheme, setActiveThemeId } = usePersonaTheme();

  return (
    <div className="persona-switcher">
      {themes.map((theme) => {
        const isActive = theme.id === activeTheme.id;
        return (
          <button
            key={theme.id}
            className={`persona-switcher__item ${isActive ? 'is-active' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
            }}
            onClick={() => setActiveThemeId(theme.id)}
            aria-pressed={isActive}
          >
            <span className="persona-switcher__label">{theme.name}</span>
          </button>
        );
      })}
    </div>
  );
}
