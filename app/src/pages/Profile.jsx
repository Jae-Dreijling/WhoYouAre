import Card from '../components/Card';
import { usePersonaTheme } from '../theme/ThemeContext';
import './Profile.css';

export default function Profile() {
  const { activeTheme } = usePersonaTheme();

  return (
    <div className="profile">
      <header>
        <p className="profile__eyebrow">Persona profile</p>
        <h1>{activeTheme.name}</h1>
      </header>

      <Card className="profile__placeholder">
        <h3>Full profile coming in Phase 2</h3>
        <p>
          Identity, values, food &amp; health, hobbies, social style, and do&apos;s/don&apos;ts
          will all show up here once real character data lands.
        </p>
      </Card>
    </div>
  );
}
