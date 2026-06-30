# Présentation Soutenance - Portail & Inspections

## Structure (5 minutes)

---

### Slide 1 - Présentation (30s)
- **Équipe** : [Noms]
- **Sujet** : Axe Portail & Inspections
- **Problème** : Gestion des demandes de devis et génération de rapports d'inspection

---

### Slide 2 - Analyse & Conception (1 min)
- **Modèle de données** : 3 tables (Client, Quote, QuoteItem)
- **Relations** : Client 1→N Quote, Quote 1→N QuoteItem
- **Choix** : PostgreSQL (robustesse, intégrité référentielle, UUID, index)

---

### Slide 3 - UX/UI Design (1 min)
- **Mobile First** : Interface conçue d'abord pour mobile, adaptée desktop
- **Design System** : Variables CSS (couleurs, spacing, typographie, ombres)
- **Parcours** : Accueil → Formulaire → Liste → Détail → PDF
- **Accessibilité** : Contrastes suffisants, labels explicites, tailles adaptatives

---

### Slide 4 - Architecture Technique (1 min)
- **Frontend** : React + React Router + Axios
- **Backend** : Node.js + Express + Helmet + CORS
- **Base de données** : PostgreSQL (schéma versionné)
- **PDF** : PDFKit (génération côté serveur)
- **Sécurité** : Validation entrées (express-validator), Helmet, .env, requêtes paramétrées

---

### Slide 5 - Démo Live (1 min)
1. Création d'un devis avec lignes dynamiques
2. Validation des champs
3. Consultation dans la liste
4. Détail du devis
5. Téléchargement du PDF
6. (Optionnel) Changement de statut

---

### Slide 6 - Axes d'amélioration (30s)
- **Tests unitaires automatisés** (Bonus +10 pts)
- **Génération IA** de données de test
- **Dashboard analytics** des devis
- **Notifications email** automatiques
- **CI/CD** Déploiement continu

---

## Justifications clés

| Choix | Alternative | Justification |
|-------|-------------|---------------|
| React | Vue, Angular | Écosystème riche, composants réutilisables, communauté large |
| Node.js/Express | Django, Spring | JavaScript full-stack, léger, performant pour API REST |
| PostgreSQL | MongoDB | Données relationnelles, intégrité, transactions, requêtes complexes |
| PDFKit | jsPDF, Puppeteer | Léger, côté serveur, contrôle total du rendu |
| CSS variables | Sass, Tailwind | Zéro dépendance, maintenable, natif |
