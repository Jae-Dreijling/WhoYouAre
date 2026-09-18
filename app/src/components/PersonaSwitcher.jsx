import { usePersona } from '../state/PersonaContext';
import './PersonaSwitcher.css';

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export default function PersonaSwitcher() {
  const { characters, activePersonaId, setActivePersonaId } = usePersona();

  return (
    <div className="persona-switcher">
      {characters.map((character) => {
        const isActive = character.id === activePersonaId;
        const { primaryColor, accentColor } = character.visual;
        return (
          <button
            key={character.id}
            className={`persona-switcher__item ${isActive ? 'is-active' : ''}`}
            onClick={() => setActivePersonaId(character.id)}
            aria-pressed={isActive}
          >
            <span
              className="persona-switcher__avatar"
              style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
            >
              {initials(character.identity.name) || '?'}
            </span>
            <span className="persona-switcher__label">{character.identity.name}</span>
          </button>
        );
      })}
    </div>
  );
}
