# Endpoints du Module Client

---

### `POST /clients`
Création d'un nouveau client (KYC).
- **Payload** :
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+22990000000",
    "address": "Cotonou",
    "idCardNumber": "123456789"
  }
  ```
- **Retour Succès** : Le profil client créé, avec son `clientCode` généré automatiquement.
- **Erreurs Possibles** :
  - `VALID_001` : Téléphone invalide.
  - `SYS_001` : Erreur de génération du code.

---

### `GET /clients/:id`
Récupération du profil complet d'un client.
- **Retour Succès** :
  ```json
  {
    "id": "cli_123",
    "firstName": "John",
    "creditScore": 650,
    "savingsAccounts": [ ... ],
    "loans": [ ... ]
  }
  ```
- **Erreurs Possibles** : `CLIENT_001` (Client introuvable).

---

### `POST /clients/:id/adjust-balance` (Staff Uniquement)
Ajustement manuel (exceptionnel) du solde d'un client.
- **Headers Requis** : `x-action-pin` (Code d'action obligatoire).
- **Payload** :
  ```json
  {
    "accountId": "sav_456",
    "amount": -5000,
    "reason": "Correction erreur de saisie"
  }
  ```
- **Erreurs Possibles** :
  - `PIN_001` / `PIN_002` : Action PIN manquant ou invalide.
  - `CLIENT_001` : Client introuvable.
  - `CLIENT_002` : Solde insuffisant si l'ajustement entraîne un solde négatif.
