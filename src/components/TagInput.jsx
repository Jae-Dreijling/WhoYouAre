import { useState } from 'react';
import './TagInput.css';

// Editable list of short strings (mottos, hobbies, do's/don'ts) — type and
// press Enter or tap Add, tap a chip's × to remove it.
export default function TagInput({ label, items, onChange, placeholder = 'Add and press Enter' }) {
  const [draft, setDraft] = useState('');

  function addItem() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setDraft('');
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index));
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addItem();
    }
  }

  return (
    <div className="tag-input">
      {label && <span className="tag-input__label">{label}</span>}
      {items.length > 0 && (
        <div className="tag-input__list">
          {items.map((item, index) => (
            <span key={`${item}-${index}`} className="tag-input__chip">
              {item}
              <button type="button" onClick={() => removeItem(index)} aria-label={`Remove ${item}`}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="tag-input__row">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button type="button" className="tag-input__add" onClick={addItem}>
          Add
        </button>
      </div>
    </div>
  );
}
