# Diagramme de Classes - Portail & Inspections

```
┌──────────────────────┐         ┌──────────────────────────┐
│        Client        │         │         Quote            │
├──────────────────────┤         ├──────────────────────────┤
│ - id: SERIAL (PK)    │1       N│ - id: SERIAL (PK)        │
│ - company_name: VARCHAR│◄───────│ - client_id: INTEGER(FK) │
│ - contact_name: VARCHAR│        │ - title: VARCHAR         │
│ - email: VARCHAR      │         │ - description: TEXT      │
│ - phone: VARCHAR      │         │ - status: VARCHAR        │
│ - address: TEXT       │         │ - total_amount: DECIMAL  │
│ - created_at: TIMESTAMP│        │ - valid_until: DATE      │
│ - updated_at: TIMESTAMP│        │ - notes: TEXT            │
└──────────────────────┘         │ - created_at: TIMESTAMP   │
                                  │ - updated_at: TIMESTAMP   │
                                  └───────────┬──────────────┘
                                              │1
                                              │
                                              │N
                                  ┌───────────┴──────────────┐
                                  │      QuoteItem            │
                                  ├──────────────────────────┤
                                  │ - id: SERIAL (PK)         │
                                  │ - quote_id: INTEGER (FK)  │
                                  │ - description: VARCHAR    │
                                  │ - quantity: INTEGER       │
                                  │ - unit_price: DECIMAL     │
                                  │ - total_price: DECIMAL    │
                                  │   (GENERATED ALWAYS AS    │
                                  │    quantity * unit_price) │
                                  └──────────────────────────┘
```

## Relations

| Relation | Type | Description |
|----------|------|-------------|
| Client 1 ── N Quote | Un client peut avoir plusieurs devis |
| Quote 1 ── N QuoteItem | Un devis contient plusieurs lignes |

## Contraintes

- `Quote.status` : 'draft' | 'sent' | 'approved' | 'rejected'
- `QuoteItem.total_price` : colonne générée automatiquement
- Suppression d'un devis → cascade sur ses lignes (ON DELETE CASCADE)
- Index sur `quotes.client_id`, `quotes.status`, `quote_items.quote_id`
