import './WidgetImageSlot.css';

// Placeholder for the widget-image gallery (real images arrive in Phase 2).
// Proves the layout can host decorative art at the sides of / between sections.
export default function WidgetImageSlot({ size = 'md', className = '' }) {
  return (
    <div className={`widget-slot widget-slot--${size} ${className}`.trim()} aria-hidden="true">
      <span className="widget-slot__icon">🖼️</span>
    </div>
  );
}
