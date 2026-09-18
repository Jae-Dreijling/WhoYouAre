import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAppUpdate } from '../pwa/useAppUpdate';
import './Settings.css';

export default function Settings() {
  const { supported, needRefresh, checking, lastChecked, checkForUpdate, applyUpdate } =
    useAppUpdate();

  return (
    <div className="settings">
      <header>
        <Link to="/profile" className="settings__back">
          ← Back to profile
        </Link>
        <p className="settings__eyebrow">Settings</p>
        <h1>App updates</h1>
      </header>

      <Card className="settings__section">
        {!supported ? (
          <p>This browser doesn&apos;t support installable-app updates.</p>
        ) : needRefresh ? (
          <>
            <h3>A new version is ready</h3>
            <p>Update now to get the latest version — your characters and photos stay exactly as they are.</p>
            <Button variant="primary" onClick={applyUpdate}>
              Update now
            </Button>
          </>
        ) : (
          <>
            <h3>You&apos;re on the latest version</h3>
            <p>
              {checking
                ? 'Checking…'
                : lastChecked
                  ? `Last checked ${lastChecked.toLocaleTimeString()}`
                  : 'Updating never touches your characters or photos — they live separately on this device.'}
            </p>
            <Button variant="secondary" onClick={checkForUpdate} disabled={checking}>
              {checking ? 'Checking…' : 'Check for updates'}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
