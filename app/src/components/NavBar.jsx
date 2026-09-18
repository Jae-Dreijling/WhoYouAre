import { NavLink } from 'react-router-dom';
import './NavBar.css';

const LINKS = [
  { to: '/', label: 'Home', icon: '🏠', end: true },
  { to: '/library', label: 'Library', icon: '🗂️' },
  { to: '/profile', label: 'Profile', icon: '⭐' },
];

export default function NavBar() {
  return (
    <nav className="navbar">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) => `navbar__item ${isActive ? 'is-active' : ''}`}
        >
          <span className="navbar__icon">{link.icon}</span>
          <span className="navbar__label">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
