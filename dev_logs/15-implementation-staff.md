# Implémentation : Gestion du Staff (Core Backoffice)

**Date** : 17 Juin 2026
**Objectif** : Brancher l'écran "Staff" (Agents & Managers) sur le endpoint `/users` pour remplacer le flux statique d'agents par la véritable liste des collaborateurs.

## 1. Adaptation du Modèle
- L'ancienne maquette affichait un format `Agent` spécifique à un affichage de collecteur (Dépôts jour, Collecté jour, Objectif, Etoiles).
- Le nouveau flux utilise le vrai typage global `User` (`firstName`, `lastName`, `email`, `role`, `agentCode`).
- Le composant de la carte a été refactorisé pour afficher ces informations réelles de manière cohérente et esthétique. L'Avatar extrait les initiales de l'utilisateur.

## 2. Modale de Formulaire (`AgentFormModal.tsx`)
- Refonte de la modale d'ajout/modification pour coller au standard `CreateUserPayload`.
- Ajout des champs : Prénom, Nom, Email, Rôle (Select), et Agence (Select).
- La modale exécute en arrière-plan `agencyService.getAll()` lors de son montage pour proposer la liste dynamique de toutes les agences dans le `select` d'affiliation.
- Branchement direct à `userService.create(payload)`.

## 3. Sécurité
- Les éventuelles erreurs HTTP renvoyées lors de la création d'un agent (ex: adresse email déjà prise) sont proprement capturées et affichées en clair en rouge dans la modale, empêchant Next.js de crasher.

## Statut
- Fonctionnel, UI responsive conservée.
