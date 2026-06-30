import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-info">
          <p className="footer-company">RASSEMBLEMENT DES INGÉNIEURS FRANCOPHONE SAS - RIF</p>
          <p className="footer-address">MEI - 2 B Rue Alfred Nobel, 77420 Champs-sur-Marne</p>
        </div>
        <div className="footer-contact">
          <p>Email: contact@grouperif.com</p>
          <p>Tél: (+33) 651948873</p>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} RIF. Challenge Flash – Dev Web & Mobile.</p>
      </div>

      <style>{`
        .footer {
          background-color: var(--color-gray-800);
          color: var(--color-gray-400);
          padding: 1.5rem 1rem;
          margin-top: auto;
        }

        .footer-inner {
          max-width: var(--max-width);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-info p,
        .footer-contact p {
          font-size: 0.75rem;
        }

        .footer-company {
          font-weight: 600;
          color: var(--color-gray-300);
        }

        .footer-copy {
          font-size: 0.6875rem;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--color-gray-700);
        }

        @media (min-width: 768px) {
          .footer-inner {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .footer-copy {
            margin-top: 0;
            padding-top: 0;
            border-top: none;
            text-align: right;
          }
        }
      `}</style>
    </footer>
  );
}

export default Footer;
