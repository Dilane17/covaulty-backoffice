# Workflow du Module Alert

Le module Alert est un système centralisé pour remonter les anomalies métiers (écarts de caisse, fraudes potentielles, plafonds atteints) aux administrateurs.

## 1. Génération d'une Alerte
- Les alertes ne sont généralement pas créées via une requête REST directe depuis le front-end, mais générées **en interne** par d'autres modules.
- *Exemples :* 
  - Lors du comptage d'un versement (`Remittance`), s'il y a un écart, le `RemittanceService` crée une alerte de type `CASH_DIFFERENCE` avec une sévérité `CRITICAL`.
  - Si un agent reste inactif plus de 45 minutes sans mouvement (détecté par Cron Job), une alerte `AGENT_INACTIVE` de sévérité `WARNING` est émise.
- Sévérités possibles : `INFO`, `WARNING`, `CRITICAL`.

## 2. Notification de l'Alerte
- La création de l'alerte déclenche un job dans BullMQ.
- Le module `Notification` consomme ce job pour envoyer un SMS ou un Email aux managers/admins concernés.

## 3. Traitement de l'Alerte
- Les admins listent les alertes actives (`GET /alerts?status=OPEN`).
- Ils peuvent assigner une alerte à un collaborateur.
- Une fois le problème résolu (par exemple, le litige du versement est tranché via `PATCH /remittances/:id/resolve`), l'alerte passe automatiquement au statut `RESOLVED`.
