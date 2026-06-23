# Correctif : Accès SuperAdmin et Contexte Global

**Date** : 17 Juin 2026
**Objectif** : Empêcher le système de résolution Tenant de bloquer l'accès à l'application sur le domaine racine (ex: localhost ou app.covaulty.com).

## 1. Assouplissement du blocage 404 (`CovaultyApp.tsx`)
- **Problème** : Si le backend renvoyait une erreur 404 sur `GET /institutions/:slug` (ex: pour le slug `localhost` qui n'existe pas en tant qu'institution), l'application affichait l'écran "Espace Introuvable" de manière bloquante, enfermant même le Super Admin dehors.
- **Solution** : 
  - Le `catch` de `resolveTenant` a été modifié. Au lieu d'appeler `setError()`, il appelle désormais `setInstitution(null, slug)`.
  - L'application démarre donc en "Contexte Global", permettant au `LoginScreen` de s'afficher avec le branding Covaulty par défaut.

## 2. Flexibilité du Store (`tenant.store.ts`)
- **Ajustement** : La signature de `setInstitution` a été modifiée pour accepter `Institution | null`, reflétant le fait que l'application peut légitimement tourner "sans" microfinance spécifique lorsqu'elle est opérée par un Super Admin sur l'URL racine.
