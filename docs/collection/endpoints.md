# Endpoints du Module Collection

---

### `POST /collection/transactions`
Enregistre une nouvelle collecte sur le terrain.
- **Payload** :
  ```json
  {
    "clientId": "cli_123",
    "localRef": "REF-001",
    "type": "DEPOSIT",
    "amount": 2000,
    "latitude": 6.3654,
    "longitude": 2.4158,
    "note": "Dépôt journalier"
  }
  ```
- **Retour Succès** :
  ```json
  {
    "id": "txn_890",
    "amount": "2000",
    "type": "DEPOSIT",
    "receiptPayload": {
      "institutionName": "Institution Covaulty",
      "clientName": "Dummy Client",
      "agentName": "Agent Name",
      "amount": "2000",
      "type": "DEPOSIT",
      "localRef": "REF-001",
      "date": "2026-06-15T08:35:00.000Z",
      "qrCodeData": "https://verify.covaulty.com/receipts/txn_890?sig=xxx",
      "signature": "xxx"
    }
  }
  ```
- **Erreurs Possibles** : 
  - `CLIENT_001` (Client introuvable)
  - `COLLECT_001` (Collecte impossible hors plage horaire)
  - `COLLECT_003` (Solde insuffisant pour le retrait sur le terrain)
  - `SAVINGS_006` (Aucun compte épargne actif trouvé pour ce client)

---

### `GET /collection/transactions`
Liste l'historique des transactions.
- **Requête** : `?clientId=...&agentId=...&type=...`
- **Retour** : Tableau d'objets `CollectionTransaction`.

---

### `GET /collection/transactions/:id`
Récupère les détails d'un reçu (signature, montant, agent).

---

## Gestion des Plages Horaires (Schedules)

### `POST /collection/schedules` (Admin / Manager)
Crée une plage horaire autorisée pour les collectes sur le terrain (au niveau de l'institution).
- **Payload** :
  ```json
  {
    "dayOfWeek": 1,
    "startTime": "08:00:00",
    "endTime": "18:00:00"
  }
  ```

### `GET /collection/schedules`
Liste les plages horaires de l'institution.

### `PATCH /collection/schedules/:id` (Admin / Manager)
Modifie une plage horaire (ex: heures ou statut `isActive`).

### `DELETE /collection/schedules/:id` (Admin / Manager)
Supprime une plage horaire.
