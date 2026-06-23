# Endpoints du Module Authentification (Auth)

Ce document liste les routes d'authentification pour le staff et les clients. Toutes les routes métier renvoient une erreur structurée en cas d'échec.

---

## 1. Connexion (Staff)

### `POST /auth/login`
Authentification initiale (Email + Mot de passe).
- **Payload** :
  ```json
  {
    "email": "admin@covaulty.com",
    "password": "Password123"
  }
  ```
- **Retour Succès (Agent)** : Renvoie directement les tokens.
  ```json
  { "accessToken": "jwt...", "user": { ... } }
  ```
- **Retour (Admin/Manager sans 2FA ni OTP)** :
  ```json
  { "requireVerification": true, "message": "..." }
  ```
- **Erreurs Possibles** :
  - `AUTH_001` : Email ou mot de passe incorrect.

---

### `POST /auth/verify-otp`
Vérifie l'OTP reçu par email pour la première connexion.
- **Payload** : `{ "email": "...", "code": "123456" }`
- **Erreurs Possibles** : `AUTH_001`, `AUTH_002` (Code OTP invalide ou expiré).

---

### `POST /auth/setup-password`
Permet à un administrateur d'institution de configurer son mot de passe initialement (via le lien reçu par e-mail d'invitation).
- **Payload** : 
  ```json
  { 
    "token": "...", 
    "email": "admin@institution.com",
    "password": "NewSecurePassword123"
  }
  ```
- **Retour** : `{ "success": true, "message": "..." }`
- **Erreurs Possibles** : `AUTH_001`, `AUTH_002` (Token invalide ou expiré).

---

### `POST /auth/enable-2fa`
Active le 2FA lors du setup initial.
- **Payload** : `{ "email": "...", "code": "654321" }`
- **Erreurs Possibles** : `AUTH_001`, `AUTH_003` (Code 2FA invalide), `AUTH_005` (Secret non généré).

---

### `POST /auth/login/verify-2fa`
Connexion finale pour les admins via le code de l'Authenticator.
- **Payload** : `{ "email": "...", "code": "123456" }`
- **Retour** : `{ "accessToken": "...", "user": { ... } }`
- **Erreurs Possibles** : `AUTH_001`, `AUTH_003`.

---

## 2. Authentification Client (Mobile)

### `POST /auth/client/setup-token` (Réservé au Staff)
Génère un QR Code token pour un client.
- **Payload** : `{ "clientId": "cli_123" }`
- **Retour** : `{ "setupToken": "jwt_courte_duree" }`

### `POST /auth/client/setup-pin`
Configure le PIN du client après scan du QR code.
- **Payload** : `{ "token": "jwt_courte_duree", "pin": "1234" }`
- **Erreurs Possibles** : `AUTH_010` (Token de liaison invalide/expiré).

### `POST /auth/client/login`
Connexion de l'application cliente.
- **Payload** : `{ "institutionId": "inst_123", "phone": "+22990000000", "pin": "1234" }`
- **Retour** : `{ "accessToken": "...", "client": { ... } }`
- **Erreurs Possibles** : `AUTH_011` (Code PIN client incorrect).

---

## 3. Sécurité Opérationnelle

### `POST /auth/action-pin/setup` (Nécessite JWT Staff)
Configure le PIN d'action du staff.
- **Payload** : `{ "pin": "9999" }`
- **Retour** : `{ "success": true }`

---

## 4. Sessions

### `POST /auth/refresh`
Renouvelle l'`accessToken` à partir du cookie `refreshToken`.
- **Erreurs Possibles** : `AUTH_006` (Refresh token invalide ou révoqué).
