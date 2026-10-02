import { NavLink } from "react-router-dom";

/**
 * Site header. `links` = [{ to, label, onClick? }].
 * NavLink adds the "active" class the original CSS already styles.
 */
export default function Header({ links = [] }) {
  return (
    <header>
      <div className="logo">Community Library</div>
      <nav>
        {links.map((link) => (
          <NavLink key={link.label} to={link.to} end onClick={link.onClick}>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
