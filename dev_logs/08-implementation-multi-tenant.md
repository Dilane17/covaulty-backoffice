# Implémentation : Résolution Multi-Tenant (Marque Blanche)

**Date** : 17 Juin 2026
**Objectif** : Identifier automatiquement l'institution cliente au démarrage de l'application et appliquer l'isolation B2B requise par l'architecture.

## 1. Store & Service d'Institution (`tenant.store.ts` & `institution.service.ts`)
- **Création du Store** : Ajout de `useTenantStore` (Zustand) pour stocker les détails de l'institution résolue (`id`, `name`, `slug`, `logoUrl`, `primaryColor`) indépendamment de la session Auth.
- **Service API** : Ajout de `institutionService` exposant la requête typée `GET /institutions/:idOrSlug`.

## 2. Chargement Initial et Stratégie DNS (`CovaultyApp.tsx`)
- **Résolution Automatique** : Au chargement de la SPA, l'application lit `window.location.hostname` pour extraire le sous-domaine (ex: `beta`).
- **Stratégie Localhost** : Si l'URL détectée est `localhost` ou `127.0.0.1`, le composant injecte le slug forcé `"localhost"` pour le développement.
- **UI Bloquante** : Un loader "Connexion à votre espace..." est affiché tant que l'API n'a pas répondu.
- **Rejet de Trafic** : Si l'institution n'existe pas (404 / `TENANT_001`), la navigation est interrompue au profit d'une pleine page "Espace Introuvable". L'écran LoginScreen n'est pas affiché.

## 3. Injection du Header d'Isolation (`api.ts`)
- Une fois le Tenant résolu, l'intercepteur Axios vient s'y brancher.
- Il injecte automatiquement le header `x-tenant-id` avec l'ID de l'institution dans absolument toutes les futures requêtes sortantes de l'application pour garantir l'isolation des données sur le Backend.

## 4. Branding Dynamique (`LoginScreen.tsx`)
- L'écran de connexion s'adapte en temps réel aux données de l'institution.
- Remplacement du nom "Covaulty" par `institution.name` sur le bouton de connexion SSO et dans le pied de page.
- Utilisation de la variable CSS locale `--primary` pour modifier les couleurs si `institution.primaryColor` existe.
- Swap du Logo par défaut avec le logo de la Microfinance (`institution.logoUrl`) si défini.
