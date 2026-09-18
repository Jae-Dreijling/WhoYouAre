import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { usePersona } from '../state/PersonaContext';
import { putImage, deleteImage, resizeImage, useImageUrl } from '../store/imageStore';
import './Profile.css';

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div className="profile__field">
      <p className="profile__field-label">{label}</p>
      <p className="profile__field-value">{value}</p>
    </div>
  );
}

function TagList({ label, items, tone = 'neutral' }) {
  if (!items?.length) return null;
  return (
    <div className="profile__field">
      <p className="profile__field-label">{label}</p>
      <ul className={`profile__tag-list profile__tag-list--${tone}`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function WidgetThumb({ imageId, onDelete }) {
  const url = useImageUrl(imageId);
  if (!url) return null;
  return (
    <div className="profile__gallery-thumb">
      <img src={url} alt="" />
      <button
        type="button"
        className="profile__gallery-remove"
        onClick={onDelete}
        aria-label="Remove image"
      >
        ×
      </button>
    </div>
  );
}

export default function Profile() {
  const { activeCharacter, updateCharacterVisual } = usePersona();
  const { name, tagline, bio } = activeCharacter.identity;
  const { primaryColor, accentColor, profilePictureId, widgetImageIds } = activeCharacter.visual;
  const { mottos, selfTalk } = activeCharacter.values;
  const { favoriteSnack, eatingStyle, activityLevel } = activeCharacter.foodHealth;
  const { treatOthers, tone, conflictStyle, groupStyle } = activeCharacter.socialStyle;
  const { dos, donts } = activeCharacter.doDonts;

  const pictureInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function handlePictureChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      const blob = await resizeImage(file, { maxSize: 480, square: true });
      const newId = await putImage(blob);
      const oldId = profilePictureId;
      updateCharacterVisual(activeCharacter.id, { profilePictureId: newId });
      if (oldId) await deleteImage(oldId);
    } finally {
      setBusy(false);
    }
  }

  async function handleGalleryChange(event) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!files.length) return;
    setBusy(true);
    try {
      const newIds = [];
      for (const file of files) {
        const blob = await resizeImage(file, { maxSize: 640 });
        newIds.push(await putImage(blob));
      }
      updateCharacterVisual(activeCharacter.id, {
        widgetImageIds: [...widgetImageIds, ...newIds],
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleRemoveWidgetImage(imageId) {
    await deleteImage(imageId);
    updateCharacterVisual(activeCharacter.id, {
      widgetImageIds: widgetImageIds.filter((id) => id !== imageId),
    });
  }

  return (
    <div className="profile">
      <header className="profile__header">
        <div>
          <p className="profile__eyebrow">Persona profile</p>
          <h1>{name}</h1>
          <p className="profile__tagline">{tagline}</p>
        </div>
        <Link to="/settings" className="profile__settings-link" aria-label="Settings">
          ⚙️
        </Link>
      </header>

      <Card className="profile__picture-card">
        <Avatar
          imageId={profilePictureId}
          name={name}
          primaryColor={primaryColor}
          accentColor={accentColor}
          size={96}
        />
        <div>
          <Button
            variant="secondary"
            onClick={() => pictureInputRef.current?.click()}
            disabled={busy}
          >
            {profilePictureId ? 'Change photo' : 'Add photo'}
          </Button>
          <input
            ref={pictureInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handlePictureChange}
          />
        </div>
      </Card>

      {bio && (
        <Card>
          <p>{bio}</p>
        </Card>
      )}

      <Card className="profile__section">
        <h3>Widget images</h3>
        <p>Decorative photos used around the app while this persona is active.</p>
        <div className="profile__gallery">
          {widgetImageIds.map((id) => (
            <WidgetThumb key={id} imageId={id} onDelete={() => handleRemoveWidgetImage(id)} />
          ))}
          <button
            type="button"
            className="profile__gallery-add"
            onClick={() => galleryInputRef.current?.click()}
            disabled={busy}
          >
            + Add
          </button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleGalleryChange}
          />
        </div>
      </Card>

      <Card className="profile__section">
        <h3>Values &amp; mindset</h3>
        <TagList label="Mottos" items={mottos} />
        <Field label="Under stress" value={selfTalk} />
      </Card>

      <Card className="profile__section">
        <h3>Food &amp; health</h3>
        <Field label="Favorite snack" value={favoriteSnack} />
        <Field label="Eating style" value={eatingStyle} />
        <Field label="Activity level" value={activityLevel} />
      </Card>

      <Card className="profile__section">
        <h3>Hobbies</h3>
        <TagList items={activeCharacter.hobbies} />
      </Card>

      <Card className="profile__section">
        <h3>Social style</h3>
        <Field label="Treats others" value={treatOthers} />
        <Field label="Tone" value={tone} />
        <Field label="Handles conflict" value={conflictStyle} />
        <Field label="In a group" value={groupStyle} />
      </Card>

      {activeCharacter.aesthetic && (
        <Card className="profile__section">
          <h3>Aesthetic</h3>
          <p>{activeCharacter.aesthetic}</p>
        </Card>
      )}

      <Card className="profile__section">
        <h3>Do&apos;s &amp; don&apos;ts</h3>
        <TagList label="Always" items={dos} tone="positive" />
        <TagList label="Never" items={donts} tone="negative" />
      </Card>

      {!bio && !mottos.length && !favoriteSnack && !activeCharacter.hobbies.length && (
        <Card className="profile__placeholder">
          <h3>This persona is still blank</h3>
          <p>Full editing arrives in Phase 3 — for now, a photo is all you can customize.</p>
        </Card>
      )}
    </div>
  );
}
