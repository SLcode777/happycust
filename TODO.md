# HappyCust - TODO List

## ⚒️ Fixes

- [ ] Traduction complète du Dashbaord Admin
- [ ] Lien vers la landing d'happyCust dans le "powered by HappyCust"
- [ ] 

## 🚀 Fonctionnalités Futures

### 📋 Roadmap Publique
- [ ] Créer une page publique `/[locale]/roadmap/[projectId]` pour afficher :
  - [ ] Liste des feature requests avec upvotes (ordonnées par nombre de votes)
  - [ ] Statut de chaque feature (New, Under Consideration, Planned, In Progress, Completed)
  - [ ] Filtres par statut
  - [ ] Barre de recherche
- [ ] Créer une page publique `/[locale]/bugs/[projectId]` pour afficher :
  - [ ] Liste des bugs non résolus (status: NEW, IN_PROGRESS)
  - [ ] Informations : description, date de création, priorité
  - [ ] Possibilité de filtrer par priorité
- [ ] Permettre au propriétaire de choisir si ces pages sont publiques ou privées (toggle dans les settings du projet)
- [ ] Ajouter un paramètre `showRoadmapLink` dans le widget pour afficher un lien vers la roadmap publique

### 🎨 Personnalisation du Widget
- [ ] **Thème Automatique** : Détecter et s'adapter au thème de l'app parente
  - [ ] Lire les variables CSS de l'app parente (`--background`, `--foreground`, `--primary`, etc.)
  - [ ] Appliquer ces couleurs au widget pour qu'il s'intègre naturellement
- [ ] **Personnalisation Manuelle** dans le dashboard admin :
  - [ ] Couleur primaire (boutons, liens)
  - [ ] Couleur de fond
  - [ ] Couleur du texte
  - [ ] Border radius (coins arrondis)
  - [ ] Font family
  - [ ] Position du bouton flottant (bottom-right, bottom-left, top-right, top-left)
- [ ] **Preview en temps réel** : Afficher un aperçu du widget dans le dashboard pendant la personnalisation
- [ ] Sauvegarder les préférences de style dans la base de données (ajouter champs au modèle `Project`)
- [ ] API endpoint pour récupérer les préférences de style : `/api/widget/theme?projectId=...`
- [ ] Appliquer dynamiquement les styles dans le widget selon les préférences du projet

### 📊 Analytics & Insights
- [ ] Dashboard avec graphiques d'évolution des feedbacks/reviews/issues
- [ ] Export CSV des données
- [ ] Notifications email pour les admins (nouveaux bugs critiques, etc.)

### 🔧 Améliorations Techniques
- [ ] Tests unitaires et E2E
- [ ] Documentation API complète
- [ ] SDK JavaScript pour faciliter l'intégration
- [ ] Webhooks pour notifications externes

## ✅ Complété
- [x] Widget multi-fonctions (Feedback, Reviews, Issues, Features)
- [x] Upload d'images pour les bug reports (UploadThing)
- [x] Admin dashboard avec authentification
- [x] Système de votes pour les feature requests
- [x] API publique pour afficher les reviews
- [x] Widget embeddable avec iframe
- [x] i18n (EN/FR)
- [x] RGPD compliance (consentement marketing)
- [x] Modération des features (status NEW)
- [x] ReviewsWidget avec 3 layouts (grid, carousel, list)
- [x] Isolation des données par utilisateur
- [x] Build production ready
