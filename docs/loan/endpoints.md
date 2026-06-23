# Endpoints du Module Prêt (Loans)

---

### `POST /loans`
Crée une nouvelle demande de prêt pour un client.
- **Payload** :
  ```json
  {
    "clientId": "cli_123",
    "principal": 500000,
    "interestRate": 5.5,
    "durationMonths": 12,
    "purpose": "Achat de marchandises"
  }
  ```
- **Retour Succès** :
  Objet `Loan` avec statut `PENDING`.

---

### `GET /loans`
Liste les prêts (filtrable par clientId, statut).
- **Retour Succès** :
  Tableau d'objets `Loan`.

---

### `GET /loans/:id`
Récupère les détails d'un prêt.

---

### `PATCH /loans/:id/approve` (SuperAdmin / Admin / Manager)
Approuve une demande de prêt et génère l'échéancier de remboursement (`LoanSchedule`).
- **Retour Succès** :
  Objet `Loan` avec statut `APPROVED` et `approvedAt` renseigné.

---

### `PATCH /loans/:id/disburse` (SuperAdmin / Admin)
Décaisse les fonds du prêt au client.
- **Retour Succès** :
  Objet `Loan` avec statut `DISBURSED` et `disbursedAt` renseigné. Met à jour le Wallet de l'Agent/Institution.

---

### `GET /loans/:id/schedule`
Récupère l'échéancier d'un prêt spécifique.
- **Retour Succès** :
  Tableau d'objets `LoanSchedule`.

---

### `POST /loans/:id/repayments`
Enregistre un paiement/remboursement pour ce prêt.
- **Payload** :
  ```json
  {
    "amount": 45000,
    "note": "Remboursement mois 1"
  }
  ```
- **Retour Succès** :
  Objet `LoanRepayment`. Met à jour le statut des échéances dans le `LoanSchedule`. Si le montant total est atteint, le prêt passe en `CLOSED`.
