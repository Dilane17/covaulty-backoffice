# Endpoints du Module Alert

Ce module permet de gérer les alertes générées par le système (ex: écarts de caisse `CASH_DIFFERENCE`, inactivité agent `AGENT_INACTIVE`).

---

### `POST /alerts` (Interne)
*Note : Les alertes sont généralement créées en interne par les autres services, mais un endpoint existe pour des créations manuelles.*
- **Payload** :
  ```json
  {
    "type": "CASH_DIFFERENCE",
    "severity": "CRITICAL",
    "message": "Écart de 5000 sur le versement REM_123",
    "agentId": "usr_123"
  }
  ```
- **Action Automatique** : Si `severity` est `CRITICAL`, un email d'urgence est envoyé aux admins via BullMQ.

---

### `GET /alerts`
Liste les alertes de l'institution.
- **Paramètres Optionnels** : `status` (OPEN, IN_PROGRESS, RESOLVED, IGNORED)
- **Retour Succès** : Tableau d'objets `Alert` incluant les détails de l'agent.

---

### `GET /alerts/:id`
Récupère les détails d'une alerte spécifique.
- **Retour Succès** : Objet `Alert`.
- **Erreurs Possibles** : `ALERT_001` (Alerte introuvable).

---

### `PATCH /alerts/:id/resolve` (SuperAdmin / Admin / Manager)
Marque l'alerte comme résolue.
- **Retour Succès** : Objet `Alert` avec `status` à `RESOLVED` et `resolvedById` assigné.
- **Erreurs Possibles** : `ALERT_001` (Alerte introuvable).
