import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Accueil' },
  { path: '/devis/nouveau', label: 'Nouveau devis' },
  { path: '/devis', label: 'Mes devis' },
];

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="header-logo-icon">📋</span>
          <span className="header-logo-text">Portail & Inspections</span>
        </Link>

        <nav className="header-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`header-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <style>{`
        .header {
          background-color: var(--color-primary);
          color: var(--color-white);
          box-shadow: var(--shadow-md);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-inner {
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-white);
          text-decoration: none;
        }

        .header-logo:hover {
          text-decoration: none;
          opacity: 0.9;
        }

        .header-logo-icon {
          font-size: 1.5rem;
        }

        .header-logo-text {
          font-size: 1.125rem;
          font-weight: 700;
        }

        .header-nav {
          display: flex;
          gap: 1rem;
        }

        .header-nav-link {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-sm);
          transition: all 0.2s;
        }

        .header-nav-link:hover {
          color: var(--color-white);
          background-color: rgba(255, 255, 255, 0.1);
          text-decoration: none;
        }

        .header-nav-link.active {
          color: var(--color-white);
          background-color: rgba(255, 255, 255, 0.2);
        }

        @media (max-width: 639px) {
          .header-logo-text {
            font-size: 0.875rem;
          }

          .header-nav-link {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
          }

          .header-inner {
            padding: 0.5rem 0.75rem;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
