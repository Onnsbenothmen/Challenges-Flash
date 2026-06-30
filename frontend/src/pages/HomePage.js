import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home">
      <div className="hero">
        <h1 className="hero-title">Portail & Inspections</h1>
        <p className="hero-subtitle">
          Gérez vos demandes de devis et générez des rapports d'inspection au format PDF
        </p>
        <div className="hero-actions">
          <Link to="/devis/nouveau" className="btn btn-primary btn-lg">
            Nouvelle demande de devis
          </Link>
          <Link to="/devis" className="btn btn-secondary btn-lg">
            Voir mes devis
          </Link>
        </div>
      </div>

      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Formulaire dynamique</h3>
          <p>Saisie intuitive des informations client et des lignes de devis avec ajout dynamique</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📄</div>
          <h3>Génération PDF</h3>
          <p>Export automatique des devis au format PDF professionnel prêt à envoyer</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📱</div>
          <h3>Mobile First</h3>
          <p>Interface conçue pour une utilisation optimale sur tous les écrans</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔒</div>
          <h3>Données sécurisées</h3>
          <p>Validation des entrées et stockage sécurisé des informations</p>
        </div>
      </div>

      <style>{`
        .home {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .hero {
          text-align: center;
          padding: 3rem 1rem;
          background: linear-gradient(135deg, var(--color-primary) 0%, #2563eb 100%);
          border-radius: var(--radius-lg);
          color: var(--color-white);
        }

        .hero-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
        }

        .hero-subtitle {
          font-size: 1.05rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          align-items: center;
        }

        .hero-actions .btn-secondary {
          background-color: rgba(255, 255, 255, 0.2);
          color: var(--color-white);
        }

        .hero-actions .btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        @media (min-width: 640px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-actions {
            flex-direction: row;
            justify-content: center;
          }
        }

        .features {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .features {
            grid-template-columns: 1fr 1fr;
          }
        }

        .feature-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 1.5rem;
          text-align: center;
          transition: transform 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-2px);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 0.75rem;
        }

        .feature-card h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-gray-800);
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          font-size: 0.875rem;
          color: var(--color-gray-500);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}

export default HomePage;
