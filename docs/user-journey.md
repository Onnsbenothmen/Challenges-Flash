# User Journey - Portail & Inspections

## Parcours Utilisateur Complet

```
                    DÉCOUVERTE                    SAISIE                     VALIDATION                  AUTOMATISATION
                  ───────────                  ────────                    ──────────                  ───────────────

   🔍 L'utilisateur      📝 Remplit le         👀 Visualise le           📄 Télécharge
   arrive sur la         formulaire avec :      devis créé avec           le PDF généré
   page d'accueil                               toutes les infos          automatiquement
                       • Entreprise
   👉 Voit les         • Contact               📋 Vérifie les
   fonctionnalités     • Email                  lignes et le             📧 Envoie le
   proposées           • Téléphone              montant total            PDF par email
                       • Adresse                                         au client
   🖱️ Clique sur
   "Nouveau devis"     • Titre du devis         🔄 Peut changer
                       • Description            le statut :
                       • Lignes avec              • Brouillon
                         description,             • Envoyé
                         quantité, prix           • Approuvé
                                                  • Rejeté
                       ✅ Validation
                       des champs               🗑️ Peut supprimer
                                                si nécessaire
```

## Schéma de navigation

```
Accueil (/)
  │
  ├── Nouveau devis (/devis/nouveau)
  │     └── Création → redirection vers Détail devis
  │
  └── Mes devis (/devis)
        └── Détail devis (/devis/:id)
              ├── Télécharger PDF
              └── Supprimer
```

## Écrans (Mobile First)

### 1. Accueil
- Hero section avec présentation
- 4 cartes fonctionnalités
- CTA "Nouvelle demande" + "Voir mes devis"

### 2. Nouveau devis
- Section client (entreprise, contact, email, téléphone, adresse)
- Section devis (titre, description, validité)
- Lignes dynamiques (ajout/suppression avec calcul automatique)
- Total estimé en temps réel
- Bouton de soumission

### 3. Liste des devis
- Filtre par statut (tous/brouillon/envoyé/approuvé/rejeté)
- Cartes cliquables avec titre, client, date, montant
- Lien vers création

### 4. Détail devis
- En-tête avec titre et statut
- Infos client et dates
- Tableau des lignes
- Total
- Boutons : Télécharger PDF, Supprimer
