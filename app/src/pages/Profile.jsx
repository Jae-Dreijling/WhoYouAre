import Card from '../components/Card';
import { usePersona } from '../state/PersonaContext';
import './Profile.css';

export default function Profile() {
  const { activeCharacter } = usePersona();
  const { name, tagline, bio } = activeCharacter.identity;

  return (
    <div className="profile">
      <header>
        <p className="profile__eyebrow">Persona profile</p>
        <h1>{name}</h1>
        <p className="profile__tagline">{tagline}</p>
      </header>

      {bio && (
        <Card>
          <p>{bio}</p>
        </Card>
      )}

      <Card className="profile__placeholder">
        <h3>Full profile view coming in Phase 2</h3>
        <p>
          Values, food &amp; health, hobbies, social style, and do&apos;s/don&apos;ts already
          exist in this character&apos;s data — they&apos;ll get a proper display here next.
        </p>
      </Card>
    </div>
  );
}
