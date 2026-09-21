import './FormField.css';

export default function FormField({ label, value, onChange, textarea = false, placeholder }) {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      <Tag
        type={textarea ? undefined : 'text'}
        rows={textarea ? 3 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
