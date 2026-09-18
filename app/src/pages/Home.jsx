import Card from '../components/Card';
import WidgetImageSlot from '../components/WidgetImageSlot';
import PersonaSwitcher from '../components/PersonaSwitcher';
import Button from '../components/Button';
import { usePersona } from '../state/PersonaContext';
import './Home.css';

export default function Home() {
  const { activeCharacter } = usePersona();
  const { name, tagline, bio } = activeCharacter.identity;

  return (
    <div className="home">
      <header className="home__header">
        <p className="home__eyebrow">Feeling like...</p>
        <h1>Who are you today?</h1>
      </header>

      <PersonaSwitcher />

      <section className="home__hero">
        <WidgetImageSlot size="md" className="home__hero-widget" />
        <Card className="home__hero-card">
          <p className="home__eyebrow">Current persona</p>
          <h2>{name}</h2>
          <p className="home__tagline">{tagline}</p>
          {bio && <p>{bio}</p>}
          <Button variant="primary">See suggestions</Button>
        </Card>
        <WidgetImageSlot size="md" className="home__hero-widget" />
      </section>

      <WidgetImageSlot size="lg" />

      <section className="home__row">
        <Card>
          <p className="home__eyebrow">Right now</p>
          <h3>Contextual suggestions</h3>
          <p>Arrives in Phase 4.</p>
        </Card>
        <Card>
          <p className="home__eyebrow">Your day</p>
          <h3>Journal</h3>
          <p>A later, optional phase.</p>
        </Card>
      </section>
    </div>
  );
}
