import { useRef, useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { usePersona } from '../state/PersonaContext';
import './Library.css';

export default function Library() {
  const { characters, activePersonaId, setActivePersonaId, downloadBackup, importFromFile } =
    usePersona();
  const fileInputRef = useRef(null);
  const [importMessage, setImportMessage] = useState(null);

  async function handleImportChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    const result = await importFromFile(file);
    setImportMessage(result.success ? 'Backup restored.' : result.error);
  }

  return (
    <div className="library">
      <header>
        <p className="library__eyebrow">Browse</p>
        <h1>Character library</h1>
        <p>Creating and deleting your own characters arrives in Phase 3.</p>
      </header>

      <div className="library__grid">
        {characters.map((character) => {
          const isActive = character.id === activePersonaId;
          const { primaryColor, accentColor, profilePictureId } = character.visual;
          return (
            <Card
              key={character.id}
              as="button"
              className={`library__card ${isActive ? 'is-active' : ''}`}
              onClick={() => setActivePersonaId(character.id)}
            >
              <Avatar
                imageId={profilePictureId}
                name={character.identity.name}
                primaryColor={primaryColor}
                accentColor={accentColor}
                size={52}
              />
              <h3>{character.identity.name}</h3>
              <p>{character.identity.tagline}</p>
            </Card>
          );
        })}
      </div>

      <Card className="library__backup">
        <h3>Backup your characters</h3>
        <p>
          Everything lives only on this device right now — export a backup before clearing
          browser data, or to move your characters somewhere else.
        </p>
        <div className="library__backup-actions">
          <Button variant="secondary" onClick={downloadBackup}>
            Export backup
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Import backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            hidden
            onChange={handleImportChange}
          />
        </div>
        {importMessage && <p className="library__backup-message">{importMessage}</p>}
      </Card>
    </div>
  );
}
