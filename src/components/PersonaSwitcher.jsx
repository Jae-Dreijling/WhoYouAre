import { usePersona } from '../state/PersonaContext';
import Avatar from './Avatar';
import './PersonaSwitcher.css';

export default function PersonaSwitcher() {
  const { characters, activePersonaId, setActivePersonaId } = usePersona();

  return (
    <div className="persona-switcher">
      {characters.map((character) => {
        const isActive = character.id === activePersonaId;
        const { primaryColor, accentColor, profilePictureId } = character.visual;
        return (
          <button
            key={character.id}
            className={`persona-switcher__item ${isActive ? 'is-active' : ''}`}
            onClick={() => setActivePersonaId(character.id)}
            aria-pressed={isActive}
          >
            <Avatar
              imageId={profilePictureId}
              name={character.identity.name}
              primaryColor={primaryColor}
              accentColor={accentColor}
              size={60}
              className="persona-switcher__avatar"
            />
            <span className="persona-switcher__label">{character.identity.name}</span>
          </button>
        );
      })}
    </div>
  );
}
