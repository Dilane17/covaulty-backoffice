# Workflow du Module Remittance (Versements de Caisse)

## 1. Description Générale
Le module de remittance gère le processus ultra-critique de transfert de fonds entre les Agents de terrain (qui collectent l'argent auprès des clients) et la Caisse de l'Agence (le Coffre).

Ce flux est asymétrique pour garantir la sécurité : l'Agent **déclare** ce qu'il dépose, mais c'est le Caissier/Manager qui **compte** et **valide**.

## 2. Cycle de vie d'un versement (Remittance)

L'entité `CashRemittance` passe par plusieurs statuts stricts : `PENDING` ➔ `VALIDATED` ou `DISCREPANCY` ➔ `RESOLVED`.

### Étape 1 : La Déclaration (Cash-in) par l'Agent
- L'Agent revient à l'agence. Il possède une encaisse (`cashBalance`).
- Il remet physiquement l'argent au caissier et déclare un montant dans l'application (`declaredAmount`).
- **Validation** : Le système vérifie que l'agent a bien les fonds déclarés (`cashBalance >= declaredAmount`). Un agent ne peut pas avoir deux déclarations `PENDING` en même temps (Erreur `REM_001`).
- **Action Technique** : Une `CashRemittance` est créée avec le statut `PENDING`. Le solde de l'agent n'est **pas encore déduit**.

### Étape 2 : Le Comptage par le Caissier/Manager
- Le Manager reçoit l'argent physique et utilise le système pour l'enregistrer (`countedAmount`).
- Cette action requiert obligatoirement le `ActionPin` du Manager (Sécurité).
- **Le système compare automatiquement les deux montants** :
  - **Cas A : Correspondance Parfaite (`countedAmount === declaredAmount`)**
    - Le statut passe à `VALIDATED`.
    - L'encaisse de l'Agent (`cashBalance`) est diminuée du montant.
    - Le solde du coffre de l'Agence (`walletBalance`) est augmenté du montant.
    - Une transaction `WalletTransaction` de type `CASH_IN` est enregistrée.
  - **Cas B : Écart détecté (`countedAmount !== declaredAmount`)**
    - Le statut passe à `DISCREPANCY`.
    - Aucune modification de solde n'a lieu.
    - Une alerte critique est déclenchée pour l'administration.
    - L'API lève l'erreur `REM_002` (Écart de caisse détecté — résolution requise) pour forcer le Front-End à afficher l'écran de résolution d'anomalie.

### Étape 3 : Résolution d'Écart (Discrepancy Resolution)
- Si le statut est `DISCREPANCY`, un Administrateur ou Superviseur doit intervenir.
- Il doit discuter avec l'Agent et le Caissier, puis forcer la validation avec le montant final retenu (`finalAmount`) et un commentaire obligatoire (`notes`).
- Cette action requiert également le `ActionPin` de l'Admin.
- Une fois résolu :
  - Le statut passe à `RESOLVED`.
  - Les soldes sont mis à jour en fonction du `finalAmount` décidé.
  - La transaction `WalletTransaction` est enregistrée.

## 3. Règles Strictes
- **Action PIN** : Toute opération modifiant les soldes ou résolvant une anomalie est bloquée sans le `x-action-pin` valide.
- **Transactions Atomiques** : Les passages au statut `VALIDATED` ou `RESOLVED` utilisent `prisma.$transaction` pour s'assurer que si la mise à jour des soldes échoue, le statut du versement n'est pas modifié.
