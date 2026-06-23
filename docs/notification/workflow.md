# Workflow du Module Notification

Le module Notification gère toutes les communications sortantes du système Covaulty (Emails, SMS, Push Notifications). Il repose sur un système asynchrone pour ne pas ralentir les requêtes API.

> [!NOTE]
> Ce module est **purement asynchrone et interne**. Il consomme les files d'attente BullMQ et n'expose **aucun endpoint REST public**.

## 1. Architecture (BullMQ + Resend)
- **Queues :** Les événements (ex: `OTP_GENERATED`, `LOAN_APPROVED`, `ALERT_CRITICAL`) sont poussés dans une file d'attente Redis via BullMQ.
- **Workers :** Des workers consomment la file d'attente et utilisent le fournisseur externe (Resend pour les emails, Twilio/Infobip pour les SMS, Firebase Cloud Messaging pour le Push).

## 2. Cas d'Usage Principaux
- **Authentification :** Envoi des codes OTP (2FA) par email ou SMS (`AUTH_002` gère l'expiration).
- **Client (Terrain) :** Envoi d'un SMS de confirmation au client lors d'un dépôt (Collection) si son numéro est renseigné.
- **Prêts (Loans) :** Notification au client lorsque son prêt est `APPROVED` ou `DISBURSED`.
- **Alertes :** Notification Email/Push aux admins lors d'un écart de caisse majeur (`CASH_DIFFERENCE`).

## 3. Modèles (Templates) et Identité Visuelle
- Un générateur de template personnalisé HTML (`email.template.ts`) est utilisé pour formater les e-mails sortants.
- Les e-mails respectent la charte graphique de Covaulty (Couleurs `#B3001B` et `#F6DCD2`, intégration de la devise *"Chaque franc. Tracé. Sécurisé."*).
- Le tenant (`institutionId`) est injecté dans le contexte pour que l'email puisse également inclure le nom de l'institution de microfinance concernée.
