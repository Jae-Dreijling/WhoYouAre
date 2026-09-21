import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import FormField from '../components/FormField';
import TagInput from '../components/TagInput';
import { usePersona } from '../state/PersonaContext';
import { createBlankCustomCharacter } from '../data/characters';
import './PersonaForm.css';

export default function PersonaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { characters, addCharacter, updateCharacter, deleteCharacter } = usePersona();
  const isEditing = Boolean(id);
  const existing = isEditing ? characters.find((c) => c.id === id) : null;

  const [form, setForm] = useState(() => structuredClone(existing ?? createBlankCustomCharacter()));
  const [error, setError] = useState(null);

  if (isEditing && !existing) {
    return (
      <div className="persona-form">
        <p>That persona doesn&apos;t exist anymore.</p>
        <Button variant="secondary" onClick={() => navigate('/library')}>
          Back to library
        </Button>
      </div>
    );
  }

  const updateIdentity = (field, value) =>
    setForm((f) => ({ ...f, identity: { ...f.identity, [field]: value } }));
  const updateVisual = (field, value) =>
    setForm((f) => ({ ...f, visual: { ...f.visual, [field]: value } }));
  const updateValues = (field, value) =>
    setForm((f) => ({ ...f, values: { ...f.values, [field]: value } }));
  const updateFoodHealth = (field, value) =>
    setForm((f) => ({ ...f, foodHealth: { ...f.foodHealth, [field]: value } }));
  const updateSocialStyle = (field, value) =>
    setForm((f) => ({ ...f, socialStyle: { ...f.socialStyle, [field]: value } }));
  const updateDoDonts = (field, value) =>
    setForm((f) => ({ ...f, doDonts: { ...f.doDonts, [field]: value } }));
  const updateTop = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.identity.name.trim()) {
      setError('Give this persona a name first.');
      return;
    }
    if (isEditing) {
      updateCharacter(form.id, form);
    } else {
      addCharacter(form);
    }
    navigate('/profile');
  }

  async function handleDelete() {
    if (!window.confirm(`Delete ${form.identity.name}? This can't be undone.`)) return;
    const result = await deleteCharacter(form.id);
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.error);
    }
  }

  return (
    <form className="persona-form" onSubmit={handleSubmit}>
      <header>
        <p className="persona-form__eyebrow">{isEditing ? 'Edit persona' : 'New persona'}</p>
        <h1>{isEditing ? form.identity.name || 'Edit persona' : 'Create a persona'}</h1>
      </header>

      <Card className="persona-form__section">
        <h3>Identity</h3>
        <FormField
          label="Name"
          value={form.identity.name}
          onChange={(v) => updateIdentity('name', v)}
          placeholder="e.g. The Night Owl Writer"
        />
        <FormField
          label="Tagline"
          value={form.identity.tagline}
          onChange={(v) => updateIdentity('tagline', v)}
          placeholder="A one-line vibe"
        />
        <FormField
          label="Bio"
          value={form.identity.bio}
          onChange={(v) => updateIdentity('bio', v)}
          textarea
          placeholder="A couple sentences about who they are"
        />
      </Card>

      <Card className="persona-form__section">
        <h3>Color scheme</h3>
        <div className="persona-form__colors">
          <label className="persona-form__color-field">
            <span>Primary</span>
            <input
              type="color"
              value={form.visual.primaryColor}
              onChange={(e) => updateVisual('primaryColor', e.target.value)}
            />
          </label>
          <label className="persona-form__color-field">
            <span>Accent</span>
            <input
              type="color"
              value={form.visual.accentColor}
              onChange={(e) => updateVisual('accentColor', e.target.value)}
            />
          </label>
          <span
            className="persona-form__color-preview"
            style={{
              background: `linear-gradient(135deg, ${form.visual.primaryColor}, ${form.visual.accentColor})`,
            }}
          />
        </div>
        {isEditing && (
          <p className="persona-form__hint">
            Photo and widget images are managed from the profile page.
          </p>
        )}
      </Card>

      <Card className="persona-form__section">
        <h3>Values &amp; mindset</h3>
        <TagInput
          label="Mottos"
          items={form.values.mottos}
          onChange={(v) => updateValues('mottos', v)}
          placeholder="Add a motto"
        />
        <FormField
          label="Under stress"
          value={form.values.selfTalk}
          onChange={(v) => updateValues('selfTalk', v)}
          textarea
        />
      </Card>

      <Card className="persona-form__section">
        <h3>Food &amp; health</h3>
        <FormField
          label="Favorite snack"
          value={form.foodHealth.favoriteSnack}
          onChange={(v) => updateFoodHealth('favoriteSnack', v)}
        />
        <FormField
          label="Eating style"
          value={form.foodHealth.eatingStyle}
          onChange={(v) => updateFoodHealth('eatingStyle', v)}
        />
        <FormField
          label="Activity level"
          value={form.foodHealth.activityLevel}
          onChange={(v) => updateFoodHealth('activityLevel', v)}
        />
      </Card>

      <Card className="persona-form__section">
        <h3>Hobbies</h3>
        <TagInput items={form.hobbies} onChange={(v) => updateTop('hobbies', v)} placeholder="Add a hobby" />
      </Card>

      <Card className="persona-form__section">
        <h3>Social style</h3>
        <FormField
          label="Treats others"
          value={form.socialStyle.treatOthers}
          onChange={(v) => updateSocialStyle('treatOthers', v)}
        />
        <FormField
          label="Tone"
          value={form.socialStyle.tone}
          onChange={(v) => updateSocialStyle('tone', v)}
        />
        <FormField
          label="Handles conflict"
          value={form.socialStyle.conflictStyle}
          onChange={(v) => updateSocialStyle('conflictStyle', v)}
        />
        <FormField
          label="In a group"
          value={form.socialStyle.groupStyle}
          onChange={(v) => updateSocialStyle('groupStyle', v)}
        />
      </Card>

      <Card className="persona-form__section">
        <h3>Aesthetic</h3>
        <FormField
          label="Style"
          value={form.aesthetic}
          onChange={(v) => updateTop('aesthetic', v)}
          textarea
        />
      </Card>

      <Card className="persona-form__section">
        <h3>Do&apos;s &amp; don&apos;ts</h3>
        <TagInput
          label="Always"
          items={form.doDonts.dos}
          onChange={(v) => updateDoDonts('dos', v)}
          placeholder="Add something they always do"
        />
        <TagInput
          label="Never"
          items={form.doDonts.donts}
          onChange={(v) => updateDoDonts('donts', v)}
          placeholder="Add something they never do"
        />
      </Card>

      {error && <p className="persona-form__error">{error}</p>}

      <div className="persona-form__actions">
        <Button type="submit" variant="primary">
          {isEditing ? 'Save changes' : 'Create persona'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        {isEditing && !form.isProtected && (
          <Button type="button" variant="ghost" onClick={handleDelete}>
            Delete persona
          </Button>
        )}
      </div>
    </form>
  );
}
