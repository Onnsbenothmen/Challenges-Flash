import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuoteForm from '../components/QuoteForm';
import { createQuote } from '../services/api';

function NewQuotePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(data) {
    setLoading(true);
    setError(null);
    try {
      const result = await createQuote(data);
      navigate(`/devis/${result.id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Erreur lors de la création du devis');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="page-title">Nouvelle demande de devis</h1>
      <p className="page-subtitle">Remplissez le formulaire ci-dessous pour créer un devis</p>

      {error && <div className="alert alert-error">{error}</div>}

      <QuoteForm onSubmit={handleSubmit} loading={loading} />

      <style>{`
        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-gray-800);
          margin-bottom: 0.25rem;
        }

        .page-subtitle {
          font-size: 0.875rem;
          color: var(--color-gray-500);
          margin-bottom: 1.5rem;
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

export default NewQuotePage;
