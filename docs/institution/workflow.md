# Workflow du Module Institution (Tenant)

## 1. Description Générale
Covaulty est un système SaaS Multi-Tenant. Le module Institution est la clé de voûte de cette architecture. Chaque client B2B (une microfinance) représente une `Institution`.

## 2. Sous-Domaines (Subdomains)
1. **Génération du Slug** : 
   - Lors de la création d'une institution (Ex: "Microfinance Beta"), le système génère automatiquement un slug `microfinance-beta`.
   - Ce slug doit être unique (`@unique` en base).
   - Le système vérifie l'unicité et ajoute un suffixe si besoin (ex: `microfinance-beta-1`).
2. **Domaine Personnalisé** :
   - L'institution possède un `subdomain` (ex: `beta.covaulty.com`).
   - L'institution peut aussi configurer un `domain` complet (ex: `app.beta-finance.com`).

## 3. Séparation et Isolation des Données
Toutes les entités du système (`User`, `Client`, `Agency`, `CashRemittance`, `WalletTransaction`) portent un `institutionId`.
- **Interception** : Un intercepteur ou la base de données (via le contexte de la requête) garantit qu'un utilisateur ne peut voir ou modifier QUE les données portant son `institutionId`.
- L'erreur `TENANT_001` est déclenchée si un `tenantId` (sous-domaine ou header) ne résout vers aucune institution valide.

## 4. Onboarding d'une Institution (Workflow)
L'ajout d'une nouvelle institution est géré de manière sécurisée par le `SUPER_ADMIN` :
1. Le super administrateur fait un appel `POST /institutions/invite`.
2. Le système crée l'institution, génère le sous-domaine.
3. Il crée automatiquement un compte utilisateur avec le rôle `ADMIN` pour cette institution (non vérifié).
4. Un e-mail d'invitation avec la charte Covaulty est envoyé via **Resend** contenant un lien avec un token de sécurité unique.
5. Le responsable de l'institution clique sur ce lien (qui pointe vers le front-end `FRONTEND_URL/setup-password`).
6. Le front-end soumet le mot de passe via `POST /auth/setup-password`, validant ainsi l'adresse e-mail et activant définitivement le compte.
