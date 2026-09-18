import Card from '../components/Card';
import WidgetImageSlot from '../components/WidgetImageSlot';
import { usePersonaTheme } from '../theme/ThemeContext';
import './Library.css';

export default function Library() {
  const { themes } = usePersonaTheme();

  return (
    <div className="library">
      <header>
        <p className="library__eyebrow">Browse</p>
        <h1>Character library</h1>
        <p>Real characters, custom creation, and search arrive in Phase 3.</p>
      </header>

      <div className="library__grid">
        {themes.map((theme) => (
          <Card key={theme.id} className="library__card">
            <WidgetImageSlot size="sm" />
            <span
              className="library__swatch"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
              }}
            />
            <h3>{theme.name}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
}
