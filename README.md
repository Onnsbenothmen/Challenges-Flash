# Portail & Inspections — Challenge Flash

Application web de gestion de devis avec génération PDF pour le **Rassemblement des Ingénieurs Francophone (RIF)**.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + React Router 6 + Axios |
| Backend | Node.js + Express 4 + Helmet + CORS |
| Base de données | SQLite (via better-sqlite3) |
| Génération PDF | PDFKit |
| Validation | express-validator |
| Tests | Jest + Supertest |

## Prérequis

- Node.js >= 18
- npm >= 9

## Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Onnsbenothmen/Challenges-Flash.git
cd Challenges-Flash

# 2. Installer le backend
cd backend
npm install

# 3. Configurer le backend
# Éditer backend/.env si nécessaire (valeurs par défaut suffisent)
# PORT=5000
# CORS_ORIGIN=http://localhost:3000

# 4. Installer le frontend
cd ../frontend
npm install

# 5. Configurer le frontend
# Éditer frontend/.env si nécessaire
# REACT_APP_API_URL=http://localhost:5000/api
```

## Lancement

### Terminal 1 — Backend (API)

```bash
cd backend
npm run dev    # avec nodemon (rechargement auto)
# ou
npm start      # sans rechargement
```

L'API démarre sur http://localhost:5000  
La base de données SQLite et les données de démonstration sont créées automatiquement au premier lancement.

### Terminal 2 — Frontend (interface utilisateur)

```bash
cd frontend
npm start
```

L'interface est accessible sur http://localhost:3000

## Fonctionnalités

- **Création de devis** — Formulaire dynamique avec lignes ajoutables/supprimables
- **Calcul automatique** — Total mis à jour en temps réel
- **Liste des devis** — Filtrage par statut (brouillon, envoyé, approuvé, rejeté)
- **Détail du devis** — Visualisation complète avec informations client
- **Génération PDF** — Export professionnel format A4 via PDFKit
- **Mobile First** — Interface responsive conçue pour mobile et desktop

## API REST

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/quotes` | Créer un devis |
| GET | `/api/quotes` | Liste des devis (filtres : `?status=`, `?client_id=`) |
| GET | `/api/quotes/:id` | Détail d'un devis |
| PUT | `/api/quotes/:id` | Mettre à jour un devis |
| DELETE | `/api/quotes/:id` | Supprimer un devis |
| GET | `/api/pdf/quote/:id` | Télécharger le PDF d'un devis |
| GET | `/api/health` | Vérifier l'état du serveur |

## Tests

```bash
cd backend
npm test
```

## Structure du projet

```
flash_challenge/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration de la base de données
│   │   ├── controllers/   # Logique métier (devis, PDF)
│   │   ├── middleware/     # Validation, gestion d'erreurs
│   │   ├── models/        # Client, Quote, QuoteItem
│   │   ├── routes/        # Définitions des routes API
│   │   ├── services/      # Services (notifications, etc.)
│   │   ├── __tests__/     # Tests Jest
│   │   └── index.js       # Point d'entrée Express
│   ├── data/              # Base SQLite (créée au démarrage)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # Header, Footer, QuoteForm
│   │   ├── pages/         # HomePage, NewQuotePage, QuotesPage, QuoteDetailPage
│   │   ├── services/      # Client Axios (appels API)
│   │   └── styles/        # Design System (variables CSS)
│   └── package.json
├── database/              # Schéma et seed SQL (référence)
├── docs/                  # Documentation, diagrammes, prototype
├── screenshots/           # Captures d'écran
└── README.md
```

## Design System

Le projet utilise des **variables CSS natives** (--color-primary, --shadow-md, --radius-lg, etc.) sans dépendance externe. Défini dans `frontend/src/styles/global.css`.

## Auteurs

Challenge Flash – Dev Web & Mobile — RIF (Rassemblement des Ingénieurs Francophone)
