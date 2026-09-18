import { useImageUrl } from '../store/imageStore';
import './WidgetImageSlot.css';

// Decorative art slot. Renders a real image from the active persona's widget
// gallery when one is assigned (Phase 2); otherwise falls back to a
// placeholder so the layout still holds its shape before any images exist.
export default function WidgetImageSlot({ size = 'md', imageId = null, className = '' }) {
  const url = useImageUrl(imageId);

  return (
    <div
      className={`widget-slot widget-slot--${size} ${url ? 'has-image' : ''} ${className}`.trim()}
      aria-hidden="true"
    >
      {url ? (
        <img src={url} alt="" className="widget-slot__image" />
      ) : (
        <span className="widget-slot__icon">🖼️</span>
      )}
    </div>
  );
}
