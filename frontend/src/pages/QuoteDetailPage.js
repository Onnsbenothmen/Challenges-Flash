import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getQuoteById, deleteQuote, getPDFUrl } from '../services/api';

const statusLabels = {
  draft: 'Brouillon',
  sent: 'Envoyé',
  approved: 'Approuvé',
  rejected: 'Rejeté',
};

function QuoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getQuoteById(id);
        setQuote(data);
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Devis non trouvé');
        } else {
          setError('Erreur lors du chargement du devis');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Supprimer ce devis définitivement ?')) return;
    setDeleting(true);
    try {
      await deleteQuote(id);
      navigate('/devis', { replace: true });
    } catch (err) {
      setError('Erreur lors de la suppression');
      setDeleting(false);
    }
  }

  if (loading) return <div className="spinner" />;

  if (error) {
    return (
      <div className="error-page">
        <p>{error}</p>
        <Link to="/devis" className="btn btn-primary">Retour aux devis</Link>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div>
      <div className="detail-header">
        <Link to="/devis" className="back-link">← Retour aux devis</Link>
        <div className="detail-header-actions">
          <a href={getPDFUrl(quote.id)} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Télécharger PDF
          </a>
          <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
            {deleting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-card-header">
          <div>
            <h1 className="detail-title">{quote.title}</h1>
            <p className="detail-ref">N° DEV-{String(quote.id).padStart(4, '0')}</p>
          </div>
          <span className={`badge badge-${quote.status}`}>
            {statusLabels[quote.status] || quote.status}
          </span>
        </div>

        <div className="detail-grid">
          <div className="detail-section">
            <h2>Client</h2>
            <p><strong>{quote.company_name}</strong></p>
            <p>Contact : {quote.contact_name}</p>
            <p>Email : {quote.email}</p>
            {quote.phone && <p>Tél : {quote.phone}</p>}
            {quote.address && <p>Adresse : {quote.address}</p>}
          </div>

          <div className="detail-section">
            <h2>Informations</h2>
            <p>Créé le : {new Date(quote.created_at).toLocaleDateString('fr-FR')}</p>
            {quote.valid_until && (
              <p>Valable jusqu'au : {new Date(quote.valid_until).toLocaleDateString('fr-FR')}</p>
            )}
            {quote.description && (
              <div>
                <p style={{ marginTop: '0.5rem', fontWeight: 600 }}>Description :</p>
                <p style={{ color: 'var(--color-gray-500)' }}>{quote.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="detail-items">
          <h2>Lignes du devis</h2>
          <table className="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="col-qty">Quantité</th>
                <th className="col-price">Prix unitaire</th>
                <th className="col-total">Total</th>
              </tr>
            </thead>
            <tbody>
              {(quote.items || []).map((item) => (
                <tr key={item.id}>
                  <td>{item.description}</td>
                  <td className="col-qty">{item.quantity}</td>
                  <td className="col-price">{parseFloat(item.unit_price).toFixed(2)} €</td>
                  <td className="col-total">{parseFloat(item.total_price).toFixed(2)} €</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="detail-total">
            <span>Total</span>
            <span className="detail-total-amount">{parseFloat(quote.total_amount).toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <style>{`
        .detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .back-link {
          font-size: 0.875rem;
          color: var(--color-gray-500);
        }

        .detail-header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .detail-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 1.5rem;
        }

        .detail-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-gray-200);
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .detail-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-gray-800);
        }

        .detail-ref {
          font-size: 0.8125rem;
          color: var(--color-gray-400);
          margin-top: 0.125rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 640px) {
          .detail-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .detail-section h2 {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-gray-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .detail-section p {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .detail-items h2 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-gray-700);
          margin-bottom: 1rem;
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .items-table th {
          text-align: left;
          padding: 0.625rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-gray-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background-color: var(--color-gray-50);
          border-bottom: 2px solid var(--color-gray-200);
        }

        .items-table td {
          padding: 0.625rem 0.75rem;
          border-bottom: 1px solid var(--color-gray-100);
        }

        .col-qty,
        .col-price,
        .col-total {
          text-align: right;
          width: 100px;
        }

        .detail-total {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0.75rem 0;
          margin-top: 0.5rem;
          border-top: 2px solid var(--color-gray-200);
          font-size: 1rem;
          font-weight: 600;
        }

        .detail-total-amount {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .error-page {
          text-align: center;
          padding: 3rem 1rem;
        }

        .error-page p {
          margin-bottom: 1rem;
          color: var(--color-gray-500);
        }

        @media (max-width: 639px) {
          .items-table {
            font-size: 0.75rem;
          }

          .items-table th,
          .items-table td {
            padding: 0.5rem;
          }

          .col-qty,
          .col-price,
          .col-total {
            width: 60px;
          }
        }
      `}</style>
    </div>
  );
}

export default QuoteDetailPage;
