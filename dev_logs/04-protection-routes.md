# Implémentation : Protection des routes (Route Guards)

**Date** : 16 Juin 2026
**Objectif** : Empêcher l'accès aux écrans protégés si l'utilisateur n'est pas connecté, et rediriger automatiquement un utilisateur connecté vers la bonne page selon son rôle.

## Analyse Initiale

- La navigation est gérée centralement par `CovaultyApp.tsx` (qui agit comme un routeur basé sur le hash).
- L'état d'authentification (`isAuthenticated`, `user`) est stocké et accessible globalement via Zustand dans `src/store/auth.store.ts`.
- Précédemment, la redirection après la connexion était gérée localement par `LoginScreen.tsx` dans une fonction `redirectAfterLogin`. Si un utilisateur tapait manuellement l'URL `#dashboard` sans être connecté, il atterrissait tout de même sur l'écran (non protégé).

## Ce qui a été fait :

1. **Centralisation de la logique (Route Guard)** :
   - Ajout d'un hook `useEffect` dans `src/components/CovaultyApp.tsx` dédié spécifiquement à la surveillance de la navigation et de l'authentification (`route`, `isAuthenticated`, `user`).
   
2. **Règles appliquées** :
   - **Règle 1 (Non authentifié)** : Si `isAuthenticated` est faux et que la route n'est pas `"login"`, on force `window.location.hash = "#login"`.
   - **Règle 2 (Authentifié et sur Login)** : Si un utilisateur est connecté et tente d'aller sur `#login`, on l'intercepte et on le redirige selon son rôle :
     - `SUPER_ADMIN`, `ADMIN`, `MANAGER` ➔ `#dashboard`
     - `AGENT` ➔ `#collectes`

3. **Nettoyage du code** :
   - Suppression de la fonction `redirectAfterLogin` dans `LoginScreen.tsx` car elle devenait redondante.
   - Désormais, lorsque `LoginScreen` appelle la fonction `setAuth()` du store Zustand, cela déclenche une mise à jour d'état qui est immédiatement interceptée par `CovaultyApp.tsx`. Ce dernier s'occupe de router dynamiquement l'utilisateur sans aucune duplication de code.
