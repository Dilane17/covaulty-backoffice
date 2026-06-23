# Endpoints du Module User (Personnel)

Toutes les routes de ce module nécessitent le JWT d'un utilisateur ayant au moins le rôle `MANAGER`.

---

### `POST /users`
Création d'un membre du personnel.
- **Payload** :
  ```json
  {
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice@institution.com",
    "password": "SecurePassword123",
    "role": "AGENT",
    "agencyId": "agc_123"
  }
  ```
- **Retour Succès** : Profil créé sans renvoyer le `passwordHash`.
- **Erreurs Possibles** :
  - `USER_002` : Cet email est déjà utilisé.
  - `WALLET_003` : L'agence spécifiée n'appartient pas à l'institution.
  - `TENANT_001` : Institution ID manquant (Si créé par Super Admin sans spécifier l'institution).

---

### `GET /users`
Liste du personnel de l'institution.
- **Paramètres de requête** : `?role=AGENT&isActive=true&agencyId=agc_123`
- **Retour Succès** : Tableau des utilisateurs. Les Super Admins voient tout le monde, les autres ne voient que leur institution.

---

### `GET /users/:id`
Récupère les détails d'un utilisateur.
- **Erreurs Possibles** : `USER_001` (Utilisateur introuvable, supprimé ou appartenant à une autre institution).

---

### `PATCH /users/:id`
Mise à jour du profil (Nom, Rôle, Agence, Changement de mot de passe).
- **Payload** :
  ```json
  {
    "isActive": false,
    "agencyId": "agc_456"
  }
  ```
- **Erreurs Possibles** : `USER_001`, `WALLET_003`.

---

### `PATCH /users/:id/action-pin/reset` (SuperAdmin / Admin)
Force la réinitialisation du code d'action (PIN) de l'utilisateur. Le champ `actionPinHash` est remis à null.
- **Retour Succès** : Objet `User` avec `actionPinHash` à null.
- **Erreurs Possibles** : `USER_001` (Utilisateur introuvable).

---

### `DELETE /users/:id` (SuperAdmin / Admin)
Suppression logique (Soft Delete).
- Passe `isActive` à false et renseigne `deletedAt`.
- **Erreurs Possibles** : `USER_001`.
