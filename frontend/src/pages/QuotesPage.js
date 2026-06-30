import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getQuotes } from '../services/api';

const statusLabels = {
  draft: 'Brouillon',
  sent: 'Envoyé',
  approved: 'Approuvé',
  rejected: 'Rejeté',
};

function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState(null);

  async function loadQuotes() {
    setLoading(true);
    setError(null);
    try {
      const data = await getQuotes(filter ? { status: filter } : {});
      setQuotes(data);
    } catch (err) {
      setError('Erreur lors du chargement des devis');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuotes();
  }, [filter]);

  return (
    <div>
      <div className="quotes-header">
        <h1 className="page-title">Mes devis</h1>
        <Link to="/devis/nouveau" className="btn btn-primary">
          + Nouveau devis
        </Link>
      </div>

      <div className="quotes-filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="sent">Envoyé</option>
          <option value="approved">Approuvé</option>
          <option value="rejected">Rejeté</option>
        </select>
      </div>

      {loading && <div className="spinner" />}

      {error && <div className="alert alert-error">{error}</div>}

      {!loading && !error && quotes.length === 0 && (
        <div className="empty-state">
          <p>Aucun devis trouvé</p>
          <Link to="/devis/nouveau" className="btn btn-primary">Créer un devis</Link>
        </div>
      )}

      {!loading && quotes.length > 0 && (
        <div className="quotes-list">
          {quotes.map((quote) => (
            <Link to={`/devis/${quote.id}`} key={quote.id} className="quote-card">
              <div className="quote-card-main">
                <h3 className="quote-card-title">{quote.title}</h3>
                <p className="quote-card-client">{quote.company_name}</p>
                <p className="quote-card-date">
                  Créé le {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="quote-card-side">
                <span className={`badge badge-${quote.status}`}>
                  {statusLabels[quote.status] || quote.status}
                </span>
                <span className="quote-card-amount">
                  {parseFloat(quote.total_amount).toFixed(2)} €
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-gray-800);
          margin-bottom: 0.25rem;
        }

        .quotes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .quotes-filters {
          margin-bottom: 1rem;
        }

        .filter-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          background: var(--color-white);
        }

        .quotes-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .quote-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: var(--color-white);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s, transform 0.2s;
          border: 1px solid var(--color-gray-200);
        }

        .quote-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
          text-decoration: none;
        }

        .quote-card-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-gray-800);
          margin-bottom: 0.125rem;
        }

        .quote-card-client {
          font-size: 0.8125rem;
          color: var(--color-gray-500);
        }

        .quote-card-date {
          font-size: 0.75rem;
          color: var(--color-gray-400);
          margin-top: 0.25rem;
        }

        .quote-card-side {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .quote-card-amount {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--color-gray-500);
        }

        .empty-state p {
          margin-bottom: 1rem;
        }

        .alert {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .alert-error {
          background-color: #fee2e2;
          color: var(--color-danger);
          border: 1px solid #fecaca;
        }
      `}</style>
    </div>
  );
}

export default QuotesPage;
