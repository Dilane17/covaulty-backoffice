# Workflow du Module Authentification (Auth)

## 1. Description Générale
Le module d'authentification gère la sécurité d'accès à l'API Covaulty pour deux cibles distinctes :
- **Le Personnel (Staff)** : Super Admin, Admin, Manager, Agent.
- **Les Clients** : Accès via l'application mobile finale.

L'objectif est de garantir un haut niveau de sécurité (2FA, isolation par Tenant) tout en offrant une expérience fluide sur le terrain (bypass du 2FA pour les agents, QR Code pour les clients).

## 2. Flux d'Authentification du Personnel (Staff)

### 2.1. Administrateurs et Managers (Haute Sécurité)
1. **Création** : L'utilisateur est créé par le Super Admin ou un Admin de l'institution. Un mot de passe temporaire ou défini est configuré.
2. **Connexion Initiale** : 
   - L'utilisateur soumet son Email et son Mot de passe (`/auth/login`).
   - Le système vérifie les identifiants. Si c'est correct, il vérifie le statut `isVerified`.
   - Si l'utilisateur n'est pas vérifié, un OTP à 6 chiffres est généré et envoyé par email via Resend. Le système renvoie `requireVerification: true`.
3. **Vérification OTP** :
   - L'utilisateur soumet l'OTP (`/auth/verify-otp`).
   - Le compte passe en `isVerified = true`.
4. **Configuration 2FA (Google Authenticator)** :
   - Une fois vérifié, si le 2FA n'est pas actif (`twoFactorEnabled: false`), le système génère un secret et une URL QR Code. Il renvoie `require2FaSetup: true`.
   - L'utilisateur scanne le QR code et soumet le premier code généré par son application (`/auth/enable-2fa`).
   - Le système active le 2FA et délivre les tokens finaux (`accessToken`, `refreshToken`).
5. **Connexions Suivantes** :
   - `/auth/login` renvoie `require2Fa: true`.
   - L'utilisateur soumet son code 2FA (`/auth/login/verify-2fa`).
   - L'API délivre les tokens finaux.

### 2.2. Agents de Terrain (Rapidité)
1. **Création** : 
   - L'Admin crée l'Agent (`/users` avec le rôle `AGENT`).
   - L'Admin doit **obligatoirement** valider cette action en fournissant son propre mot de passe (`adminPassword`).
   - Le système génère automatiquement un identifiant unique (`agentCode` sous la forme `AG-XXXXXX`) et un mot de passe aléatoire de 6 caractères alphanumériques.
   - L'Admin transmet ces informations à l'Agent. L'email est optionnel.
2. **Connexion** :
   - L'Agent soumet son `agentCode` (ou email s'il en a un) et son mot de passe généré (`/auth/login`).
   - Le système détecte le rôle `AGENT`.
   - **Bypass** : La vérification OTP et le 2FA sont purement et simplement ignorés.
   - Les tokens (`accessToken`, `refreshToken`) sont immédiatement retournés.
3. **Réinitialisation du Mot de Passe** :
   - En cas d'oubli ou de compromission, l'Admin peut réinitialiser le mot de passe de l'Agent (`/users/:id/reset-password`).
   - Cette action nécessite également la validation par le mot de passe de l'Admin (`adminPassword`).
   - Un nouveau mot de passe de 6 caractères est généré et renvoyé à l'Admin.

## 3. Flux d'Authentification des Clients (QR Code & PIN)

1. **Génération du Token de Configuration** : 
   - L'Agent, depuis son application (connectée et authentifiée), demande la génération d'un QR code pour un client (`/auth/client/setup-token`).
   - Le backend génère un JWT courte durée (15 min) avec `purpose: 'CLIENT_SETUP'`.
2. **Scan et Configuration du PIN** :
   - Le client scanne ce QR code avec sa propre application.
   - L'application client extrait le token et demande au client de choisir un PIN à 4 ou 6 chiffres.
   - L'application appelle `/auth/client/setup-pin` avec le token et le nouveau PIN.
   - Le backend hache le PIN (`pinHash`) et le sauvegarde sur le profil du client.
3. **Connexions Suivantes** :
   - Le client utilise son numéro de téléphone, son `institutionId` et son PIN pour se connecter (`/auth/client/login`).
   - L'API délivre des tokens d'accès restreints au client.

## 4. Sécurité Opérationnelle (Action PIN)
Pour les opérations critiques (transferts de fonds, validation de versements, ajustements de solde) :
- Le staff doit configurer un **Action PIN** unique (`/auth/action-pin/setup`).
- Ce PIN est haché en base (`actionPinHash`).
- Lors d'une requête critique, le front-end inclut le header `x-action-pin`.
- Le `ActionPinGuard` intercepte la requête, hache le PIN fourni et le compare à celui en base. Si invalide, l'action est rejetée (Erreur `PIN_002`).

## 5. Gestion des Sessions (Refresh Tokens)
- L'`accessToken` a une durée de vie courte (ex: 15 minutes).
- Le `refreshToken` a une durée de vie longue (ex: 7 jours). Il est stocké côté serveur dans la table `RefreshToken` avec son empreinte (Device, IP) et côté client dans un cookie `HttpOnly`.
- Lors du renouvellement (`/auth/refresh`), l'ancien token est révoqué (`revokedAt = now()`) et une nouvelle paire est générée (Rotation des Refresh Tokens). Cela permet de détecter les vols de session.
