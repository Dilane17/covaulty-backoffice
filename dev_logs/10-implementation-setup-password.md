# Implémentation : Setup Password (Activation de Compte)

**Date** : 17 Juin 2026
**Objectif** : Créer l'interface et la logique permettant à un nouvel administrateur d'institution de définir son mot de passe initial après avoir cliqué sur le lien d'invitation reçu par e-mail.

## 1. Mise à jour de la Couche Service (`auth.types.ts` & `auth.service.ts`)
- **Type `SetupPasswordPayload`** : Ajout du typage strict pour la requête (`token`, `email`, `password`).
- **Service API** : Création de la méthode `authService.setupPassword()` pointant vers `POST /auth/setup-password`.

## 2. Refactorisation du Routeur (`CovaultyApp.tsx`)
- **Parsing des Query Parameters sur le Hash** : Le routeur interne (basé sur `window.location.hash`) a été mis à jour pour séparer la route pure de ses paramètres (ex: extraction de `token=123` depuis `#setup-password?token=123&email=...`).
- **Route Guard** : La route `setup-password` a été ajoutée aux exceptions du garde-barrière (comme la route `login`) pour être accessible sans être authentifié.

## 3. Écran `SetupPasswordScreen.tsx`
- **Interface** : Création d'un formulaire sécurisé demandant le mot de passe et sa confirmation, avec des règles de validation basiques côté client (correspondance, longueur minimale).
- **Branding** : L'écran utilise le store du Tenant pour afficher dynamiquement le nom et le logo de l'institution concernée, rassurant ainsi l'utilisateur sur la provenance de son invitation.
- **Feedback** : Gestion propre des erreurs Axios et affichage d'un écran de succès incitant l'utilisateur à se connecter.
