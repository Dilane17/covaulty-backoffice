# Implémentation : Architecture d'Authentification

**Date** : 16 Juin 2026
**Objectif** : Mettre en place la base technique pour l'intégration de l'authentification avec l'API Covaulty.

## Ce qui a été fait :

1. **Dépendances** : 
   - Installation de `axios` pour la gestion des requêtes HTTP.
   - Installation de `zustand` pour la gestion d'état global (stockage du token).

2. **Types (`src/types/auth.types.ts`)** : 
   - Création des interfaces TypeScript strictes (`AuthUser`, `LoginPayload`, `LoginResponse`, `OtpPayload`, etc.) en conformité avec la documentation de l'API fournie. Zéro utilisation du type `any`.

3. **Store Zustand (`src/store/auth.store.ts`)** : 
   - Création du store `useAuthStore` pour stocker l'`accessToken`, les informations de l'utilisateur (`user`) et le statut de connexion (`isAuthenticated`).
   - Ajout des méthodes d'action `setAuth` et `clearAuth`.

4. **Client API Centralisé (`src/services/api.ts`)** : 
   - Création d'une instance Axios pointant sur la `baseURL` : `https://api.covaulty.com`.
   - **Intercepteur de requêtes** : Va chercher l'`accessToken` dans Zustand et l'injecte automatiquement dans l'en-tête `Authorization` de chaque requête sortante.
   - **Intercepteur de réponses (Refresh Token)** : Surveille les erreurs `401 Unauthorized`. Si une telle erreur se produit, l'intercepteur appelle silencieusement la route `/auth/refresh` (en utilisant le cookie HttpOnly du `refreshToken`). S'il obtient un nouveau token, il met à jour le store et relance la requête initiale qui avait échoué. Si le rafraîchissement échoue, l'utilisateur est déconnecté et redirigé vers l'écran de connexion (`#login`).

5. **Service Métier (`src/services/auth.service.ts`)** : 
   - Exportation de l'objet `authService` contenant les fonctions qui effectuent les requêtes (ex: `login`, `verifyOtp`, `enable2FA`, `verify2FA`, `setupActionPin`). Toutes sont fortement typées selon les endpoints.

## Précisions sur le Workflow

### Gestion du `x-action-pin`
Contrairement au Token JWT (qui est automatisé), l'en-tête `x-action-pin` **n'est pas injecté globalement** par l'intercepteur Axios. 
*Pourquoi ?* Pour des raisons de sécurité, le PIN d'action ne doit pas être stocké en permanence dans le state. Il sera demandé à l'utilisateur via une modale juste avant une opération critique, puis passé explicitement dans les options de cette requête spécifique :
`api.post('/transfer', data, { headers: { 'x-action-pin': pinInput } })`

### Redirection basée sur les Rôles
La redirection post-login n'est pas encore implémentée mais sera gérée dynamiquement au niveau du composant de connexion (ou du routeur principal). 
- Les rôles `SUPER_ADMIN`, `ADMIN` et `MANAGER` seront redirigés vers `#dashboard`.
- Le rôle `AGENT` sera redirigé vers sa vue métier principale (ex: `#collectes` ou `#clients`, à définir selon le besoin).

## Prochaines étapes
- Intégrer `authService.login` dans le composant `LoginScreen.tsx`.
- Gérer conditionnellement l'affichage des étapes de validation (OTP ou 2FA) selon les retours de l'API.
