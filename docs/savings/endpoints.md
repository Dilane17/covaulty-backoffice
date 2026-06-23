# Endpoints du Module Épargne (Savings)

---

### `POST /savings-plans` (Admin)
Crée un nouveau plan d'épargne.
- **Payload** :
  ```json
  {
    "name": "Épargne Tontine",
    "interestRate": 2.5,
    "minimumDeposit": 1000,
    "lockInMonths": 12
  }
  ```

### `GET /savings-plans`
Liste les plans d'épargne disponibles dans l'institution.

---

### `POST /savings-accounts`
Ouvre un compte épargne pour un client.
- **Payload** :
  ```json
  {
    "clientId": "cli_123",
    "planId": "plan_456"
  }
  ```

### `GET /savings-accounts`
Liste les comptes épargne (filtrable par `clientId`).
- **Retour** :
  Tableau d'objets `SavingsAccount` avec leur `balance`.

---

### `POST /savings-accounts/:id/withdraw` (Guichet)
Effectue un retrait sur le compte épargne au guichet de l'agence.
- **Payload** :
  ```json
  {
    "amount": 50000,
    "note": "Retrait pour frais de scolarité"
  }
  ```
- **Erreurs Possibles** :
  - `SAVINGS_002` : Compte épargne introuvable.
  - `SAVINGS_003` : Solde insuffisant.
  - `SAVINGS_004` : Période de blocage non écoulée.
