# Implémentation : Module d'Administration SaaS (Institutions)

**Date** : 17 Juin 2026
**Objectif** : Fournir l'interface de pilotage B2B pour les utilisateurs "Super Admin" de Covaulty afin de lister et d'intégrer (onboarder) de nouvelles institutions (Microfinances).

## 1. Modale d'Onboarding (`InviteInstitutionModal.tsx`)
- **Fonctionnalité** : Formulaire de création rapide demandant le nom de la microfinance et l'email de l'administrateur principal.
- **Intégration** : Appel à la route `/institutions/invite` via `institutionService`.
- **Validation** : Traitement des erreurs (ex: sous-domaine en conflit ou erreur réseau) avec affichage élégant à l'intérieur de la modale. Désactivation du bouton de soumission pendant le chargement.

## 2. Écran d'Administration (`InstitutionsScreen.tsx`)
- **Route Exclusive** : L'écran n'est accessible et visible que par le `SUPER_ADMIN` (filtré via le RBAC Sidebar).
- **Listing** : Affichage d'un tableau récapitulatif des microfinances clientes (ID, Nom, Initiales stylisées, Sous-domaine Covaulty complet).
- **Cycle de Vie** : La liste est re-téléchargée (`fetchInstitutions`) à la fermeture (en cas de succès) de la modale d'invitation, garantissant une UI toujours à jour.

## 3. Routeur
- Ajout de la route `"institutions"` dans le Hash Router (`CovaultyApp.tsx`) et dans la constante globale `VALID_ROUTES`.
