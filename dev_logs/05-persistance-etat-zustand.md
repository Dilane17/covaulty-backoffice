# Implémentation : Persistance de la Session (Zustand)

**Date** : 16 Juin 2026
**Objectif** : Conserver la session de l'utilisateur active même après un rafraîchissement de la page (F5), en utilisant le middleware `persist` de Zustand tout en évitant les problèmes de réhydratation (Hydration Mismatch).

## Le Problème (Risque identifié)
Sans persistance, le store Zustand se vide au rechargement de la page (`isAuthenticated: false`). Le Route Guard voyant cela, il redirige instantanément l'utilisateur vers `#login` avant même de pouvoir utiliser le Refresh Token.
Même avec le `persist` de Zustand, il y a un **risque de redirection prématurée** : au tout premier cycle de rendu React, Zustand n'a pas encore fini de lire le `localStorage`. Son état est alors `false` pendant quelques millisecondes, ce qui déclencherait également la redirection de sécurité.

## Ce qui a été fait :

1. **Intégration du Middleware `persist` (`auth.store.ts`)** :
   - Importation et enveloppement du store avec `persist`.
   - L'état entier de l'authentification (`accessToken`, `user`, `isAuthenticated`) est désormais enregistré automatiquement sous la clé `covaulty-auth-storage` dans le `localStorage`.

2. **Création d'un état d'hydratation (`_hasHydrated`)** :
   - Ajout d'un booléen `_hasHydrated` dans le store.
   - Utilisation du callback natif `onRehydrateStorage` de Zustand : une fois que Zustand a fini de lire le `localStorage` et de l'injecter dans le store en mémoire, il bascule la variable `_hasHydrated` à `true`.

3. **Protection contre la Redirection Prématurée (`CovaultyApp.tsx`)** :
   - Mise à jour du `useEffect` (Route Guard) pour qu'il surveille la variable `_hasHydrated`.
   - Ajout de la clause de sécurité : `if (!_hasHydrated) return;`.
   - Conséquence : Le système de sécurité attend passivement et de manière invisible que la mémoire soit restaurée avant d'agir. S'il s'avère après restauration que l'utilisateur n'est vraiment pas connecté, la redirection s'opère normalement.

## Résultats :
L'expérience utilisateur est désormais parfaite. Un "F5" ramène exactement sur l'écran précédent, sans flash d'écran de connexion et sans redirection non désirée. Le système de rafraîchissement silencieux de jeton Axios prendra le relais sans accroc si le jeton est expiré entre temps.
