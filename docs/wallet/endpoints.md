# Endpoints du Module Wallet (Comptabilité Interne)

---

### `GET /wallets/agency/:id`
Récupère le solde actuel et l'historique de l'Agence (Le Coffre).
- **Retour Succès** :
  ```json
  {
    "agencyId": "agc_123",
    "balance": 5000000,
    "transactions": [ ... ]
  }
  ```
- **Erreurs Possibles** :
  - `WALLET_003` : Agence introuvable ou n'appartient pas au tenant.

---

### `POST /wallets/agency/:id/fund`
Injection de liquidités externes dans le coffre de l'agence (Ex: Dépôt bancaire, refinancement).
- **Headers Requis** : `x-action-pin` (Code d'action de l'Admin).
- **Payload** :
  ```json
  {
    "amount": 2000000,
    "notes": "Injection depuis le compte bancaire BOA"
  }
  ```
- **Retour Succès** : `{ "agencyId": "...", "newBalance": 7000000 }`
- **Erreurs Possibles** :
  - `PIN_001` / `PIN_002` : Problème d'Action PIN.
  - `WALLET_002` : Montant invalide (inférieur ou égal à 0).
  - `WALLET_003` : Agence introuvable.

---

### `GET /wallets/agent/:id`
Récupère le solde (encaisse physique) actuel de l'Agent.
- **Retour Succès** :
  ```json
  {
    "agentId": "usr_456",
    "cashBalance": 150000,
    "transactions": [ ... ]
  }
  ```
- **Erreurs Possibles** : `USER_001` (Agent introuvable).
