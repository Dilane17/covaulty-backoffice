# Implémentation : Correctifs d'Audit et Sécurisation

**Date** : 16 Juin 2026
**Objectif** : Appliquer les recommandations critiques et fortement recommandées issues de l'audit de sécurité et de robustesse de l'architecture d'authentification.

## 1. File d'attente (Queue) du Refresh Token (`src/services/api.ts`)
- **Problème** : Une "race condition" se produisait si plusieurs requêtes réseau recevaient une erreur 401 simultanément. L'intercepteur déclenchait plusieurs rafraîchissements en parallèle, ce qui provoquait la déconnexion inattendue de l'utilisateur par le serveur.
- **Solution implémentée** : 
  - Ajout du booléen global `isRefreshing` et du tableau de promesses `failedQueue`.
  - Si une erreur 401 arrive et que `isRefreshing` est `true`, la requête n'appelle plus `/auth/refresh`. À la place, elle crée une Promesse mise "en pause" dans `failedQueue`.
  - Dès que le refresh initial réussit, une nouvelle fonction `processQueue` résout toutes les promesses en attente en leur injectant le nouveau token. Toutes les requêtes repartent instantanément et l'application n'a appelé le backend qu'une seule fois.

## 2. Déconnexion Manuelle (`src/components/layout/Sidebar.tsx`)
- **Problème** : Le bouton de déconnexion n'avait aucun effet et le backend ne propose pas (encore) d'endpoint `/auth/logout`.
- **Solution implémentée** : 
  - Ajout d'une fonction `handleLogout` connectée au bouton `onClick` de la Sidebar.
  - La fonction vide intégralement le cache en mémoire et dans le `localStorage` via la méthode `clearAuth()` de Zustand.
  - Elle force ensuite la redirection immédiate vers `#login` via `window.location.hash`.

## 3. Typage TypeScript Strict (`src/components/screens/LoginScreen.tsx`)
- **Problème** : Les blocs `catch (err: any)` enfreignaient la contrainte du projet exigeant un typage pur sans utilisation de `any`.
- **Solution implémentée** : 
  - Remplacement global par `catch (err: unknown)`.
  - Importation d'`axios` et utilisation du Type Guard `if (axios.isAxiosError(err))` pour s'assurer que l'objet d'erreur possède bien une structure de réponse HTTP (`err.response.data.message`) avant de tenter de l'afficher.
