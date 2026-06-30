import React, { useState } from 'react';

const emptyItem = { description: '', quantity: 1, unit_price: '' };

function QuoteForm({ onSubmit, initialData, loading }) {
  const [form, setForm] = useState({
    client: initialData?.client || {
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      address: '',
    },
    quote: initialData?.quote || {
      title: '',
      description: '',
      valid_until: '',
      items: [{ ...emptyItem }],
    },
  });

  const [errors, setErrors] = useState({});

  function handleClientChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      client: { ...prev.client, [name]: value },
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function handleQuoteChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      quote: { ...prev.quote, [name]: value },
    }));
  }

  function handleItemChange(index, field, value) {
    const items = [...form.quote.items];
    items[index] = { ...items[index], [field]: value };
    setForm(prev => ({
      ...prev,
      quote: { ...prev.quote, items },
    }));
  }

  function addItem() {
    setForm(prev => ({
      ...prev,
      quote: { ...prev.quote, items: [...prev.quote.items, { ...emptyItem }] },
    }));
  }

  function removeItem(index) {
    if (form.quote.items.length <= 1) return;
    setForm(prev => ({
      ...prev,
      quote: { ...prev.quote, items: prev.quote.items.filter((_, i) => i !== index) },
    }));
  }

  function validate() {
    const newErrors = {};

    if (!form.client.company_name.trim()) newErrors.company_name = 'Nom de l\'entreprise requis';
    if (!form.client.contact_name.trim()) newErrors.contact_name = 'Nom du contact requis';
    if (!form.client.email.trim()) newErrors.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client.email)) newErrors.email = 'Email invalide';

    if (!form.quote.title.trim()) newErrors.title = 'Titre du devis requis';

    form.quote.items.forEach((item, i) => {
      if (!item.description.trim()) newErrors[`item_${i}_desc`] = 'Description requise';
      if (!item.quantity || parseInt(item.quantity) < 1) newErrors[`item_${i}_qty`] = 'Quantité >= 1';
      if (item.unit_price === '' || parseFloat(item.unit_price) < 0) newErrors[`item_${i}_price`] = 'Prix valide requis';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  }

  const total = form.quote.items.reduce((sum, item) => {
    return sum + (parseInt(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
  }, 0);

  return (
    <form onSubmit={handleSubmit} className="quote-form">
      <div className="form-section">
        <h2 className="form-section-title">Informations client</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company_name">Entreprise *</label>
            <input
              id="company_name"
              name="company_name"
              value={form.client.company_name}
              onChange={handleClientChange}
              placeholder="Nom de l'entreprise"
            />
            {errors.company_name && <p className="form-error">{errors.company_name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="contact_name">Contact *</label>
            <input
              id="contact_name"
              name="contact_name"
              value={form.client.contact_name}
              onChange={handleClientChange}
              placeholder="Nom du contact"
            />
            {errors.contact_name && <p className="form-error">{errors.contact_name}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.client.email}
              onChange={handleClientChange}
              placeholder="email@exemple.com"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.client.phone}
              onChange={handleClientChange}
              placeholder="+33 6 XX XX XX XX"
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="address">Adresse</label>
          <textarea
            id="address"
            name="address"
            value={form.client.address}
            onChange={handleClientChange}
            placeholder="Adresse complète"
            rows={2}
          />
        </div>
      </div>

      <div className="form-section">
        <h2 className="form-section-title">Détails du devis</h2>
        <div className="form-group">
          <label htmlFor="title">Titre du devis *</label>
          <input
            id="title"
            name="title"
            value={form.quote.title}
            onChange={handleQuoteChange}
            placeholder="Ex: Inspection technique des installations"
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.quote.description}
            onChange={handleQuoteChange}
            placeholder="Description détaillée de la prestation"
            rows={3}
          />
        </div>
        <div className="form-group">
          <label htmlFor="valid_until">Valable jusqu'au</label>
          <input
            id="valid_until"
            name="valid_until"
            type="date"
            value={form.quote.valid_until}
            onChange={handleQuoteChange}
          />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-header">
          <h2 className="form-section-title">Lignes du devis</h2>
          <button type="button" onClick={addItem} className="btn btn-secondary btn-sm">
            + Ajouter une ligne
          </button>
        </div>

        {form.quote.items.map((item, index) => (
          <div key={index} className="item-row">
            <div className="item-row-main">
              <div className="form-group">
                <label>Description *</label>
                <input
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="Description de la prestation"
                />
                {errors[`item_${index}_desc`] && <p className="form-error">{errors[`item_${index}_desc`]}</p>}
              </div>
              <div className="item-row-numbers">
                <div className="form-group">
                  <label>Quantité</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                  {errors[`item_${index}_qty`] && <p className="form-error">{errors[`item_${index}_qty`]}</p>}
                </div>
                <div className="form-group">
                  <label>Prix unitaire (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                    placeholder="0.00"
                  />
                  {errors[`item_${index}_price`] && <p className="form-error">{errors[`item_${index}_price`]}</p>}
                </div>
                <div className="item-row-total">
                  <label>Total</label>
                  <span className="item-total-value">
                    {((parseInt(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
            {form.quote.items.length > 1 && (
              <button type="button" onClick={() => removeItem(index)} className="btn-remove">
                ✕
              </button>
            )}
          </div>
        ))}

        <div className="form-total">
          <span className="form-total-label">Total estimé</span>
          <span className="form-total-value">{total.toFixed(2)} €</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? 'Création en cours...' : 'Créer le devis'}
        </button>
      </div>

      <style>{`
        .quote-form {
          max-width: 800px;
        }

        .form-section {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-section-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--color-gray-800);
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--color-primary-light);
        }

        .form-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0;
        }

        .form-section-header .form-section-title {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }

        .item-row {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          padding: 1rem;
          margin-bottom: 0.75rem;
          background-color: var(--color-gray-50);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-gray-200);
        }

        .item-row-main {
          flex: 1;
        }

        .item-row-numbers {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .item-row-total label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-gray-500);
          margin-bottom: 0.375rem;
        }

        .item-total-value {
          display: block;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--color-primary);
          background: var(--color-primary-light);
          border-radius: var(--radius-md);
          text-align: right;
        }

        .btn-remove {
          background: none;
          border: none;
          color: var(--color-danger);
          font-size: 1.25rem;
          padding: 0.25rem;
          cursor: pointer;
          margin-top: 1.5rem;
          opacity: 0.6;
        }

        .btn-remove:hover {
          opacity: 1;
        }

        .btn-sm {
          font-size: 0.75rem;
          padding: 0.375rem 0.75rem;
        }

        .btn-lg {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
        }

        .form-total {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 1rem;
          padding: 1rem 0 0;
          border-top: 2px solid var(--color-gray-200);
          margin-top: 0.5rem;
        }

        .form-total-label {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-gray-600);
        }

        .form-total-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }

        @media (max-width: 639px) {
          .item-row-numbers {
            grid-template-columns: 1fr 1fr;
          }

          .item-row-total {
            grid-column: span 2;
          }

          .form-section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .form-total {
            flex-direction: column;
            align-items: flex-end;
          }
        }
      `}</style>
    </form>
  );
}

export default QuoteForm;
