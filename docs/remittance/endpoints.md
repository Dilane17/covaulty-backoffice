# Endpoints du Module Remittance (Versements)

---

### `POST /remittances`
Déclaration du montant par l'agent.
- **Payload** :
  ```json
  {
    "declaredAmount": 150000
  }
  ```
- **Retour Succès** : Objet `CashRemittance`
- **Erreurs Possibles** :
  - `REM_001` (Versement déjà en attente)
  - `REM_005` (Solde agent insuffisant) (l'agent ne possède pas ce montant).

---

### `PATCH /remittances/:id/count`
Comptage des fonds par le caissier.
- **Headers Requis** : `x-action-pin` (Code d'action du caissier).
- **Payload** :
  ```json
  {
    "countedAmount": 150000
  }
  ```
- **Retour Succès (Correspondance Parfaite)** : 
  Le statut passe à `VALIDATED`.
  `{ "remittance": { "status": "VALIDATED" } }`
- **Erreurs Possibles** :
  - `PIN_001` / `PIN_002` : Problème d'Action PIN.
  - `REM_004` : Versement introuvable.
  - `REM_002` : **Écart de caisse détecté** (Code 409). Le statut passe en `DISCREPANCY` et cette erreur est levée pour alerter le Front-End.

---

### `PATCH /remittances/:id/resolve`
Résolution d'un écart de caisse par un Admin.
- **Headers Requis** : `x-action-pin` (Code d'action de l'admin).
- **Payload** :
  ```json
  {
    "finalAmount": 148000,
    "discrepancyReason": "Erreur de comptage sur le terrain par l'agent. Ajustement effectué."
  }
  ```
- **Retour Succès** : 
  Le statut passe à `RESOLVED` et les soldes sont mis à jour selon le `finalAmount`.
  `{ "remittance": { "status": "RESOLVED" } }`
- **Erreurs Possibles** :
  - `PIN_001` / `PIN_002` : Problème d'Action PIN.
  - `REM_004` : Versement introuvable.
  - `REM_003` : Versement déjà résolu.
