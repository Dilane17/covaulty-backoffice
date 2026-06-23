# Implémentation : Gestion des Agences (Core Backoffice)

**Date** : 17 Juin 2026
**Objectif** : Brancher l'écran "Agences" du Core Backoffice sur la véritable API de production et permettre la création de nouveaux points de présence.

## 1. Remplacement des fausses données
- Suppression de l'import des données statiques (`agencesData`).
- Utilisation de `agencyService.getAll()` au montage du composant `AgencesScreen`.
- Le résumé global (le bandeau noir en haut) récupère désormais dynamiquement le nom de l'institution via le Zustand `useTenantStore` et le nombre total d'agences réelles de l'institution.

## 2. Modale de Création (`AgenceFormModal.tsx`)
- Création d'une nouvelle modale de création d'agence avec les champs requis par le backend (Nom, Adresse, Téléphone, Email).
- Branchement à `agencyService.create()`.
- Re-téléchargement instantané de la liste des agences après un succès de création.

## 3. Adaptation UI
- Comme l'API réelle ne fournit pas certaines métriques en temps réel (comme le nombre d'agents par agence, ou l'objectif global), des tirets (`-`) ont été mis en place temporairement pour ces champs, en gardant l'esthétique parfaite de la carte.
- Le solde de la trésorerie (`walletBalance`) remonte depuis la base de données et est proprement formaté en Francs CFA.
