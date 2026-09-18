import { useImageUrl } from '../store/imageStore';
import { initials } from '../utils/initials';
import './Avatar.css';

// Shows a character's real profile picture when set, otherwise a colored
// initials fallback — used anywhere a persona needs a face (switcher,
// library cards, the profile header).
export default function Avatar({
  imageId,
  name,
  primaryColor = 'var(--color-primary)',
  accentColor = 'var(--color-accent)',
  size = 56,
  className = '',
}) {
  const url = useImageUrl(imageId);
  const style = { width: size, height: size, fontSize: Math.max(12, size * 0.36) };
  if (!url) {
    style.background = `linear-gradient(135deg, ${primaryColor}, ${accentColor})`;
  }

  return (
    <span className={`avatar ${className}`.trim()} style={style}>
      {url ? <img src={url} alt="" className="avatar__image" /> : initials(name) || '?'}
    </span>
  );
}
