# Workflow du Module Wallet (Gestion des Soldes)

## 1. Description Générale
Le module Wallet gère la comptabilité interne de Covaulty de façon asymétrique. Il n'existe pas de "solde unique" par utilisateur.
Il distingue :
1. **Le Coffre de l'Agence (`Agency.walletBalance`)** : L'argent physique et digital sécurisé dans la caisse principale de l'institution.
2. **L'Encaisse de l'Agent (`User.cashBalance`)** : L'argent que l'Agent détient physiquement sur lui suite à ses collectes sur le terrain.

## 2. Flux Financiers

### Flux d'Entrée (Cash-in depuis le terrain)
- **Collecte** : L'Agent collecte l'argent du client. Son `cashBalance` augmente (voir Module Collection).
- **Versement (Remittance)** : L'Agent remet l'argent à l'Agence. Son `cashBalance` diminue, et le `walletBalance` de l'Agence augmente (voir Module Remittance).

### Flux de Sortie (Décaissement)
- **Prêts / Retraits** : Lorsqu'un client retire son épargne ou reçoit un prêt, l'argent sort directement du `walletBalance` de l'Agence.
- **Ajustement (Fund Agency)** : Le Super Admin ou le Manager principal peut injecter des liquidités directement dans le coffre (ex: Virement bancaire externe) via le financement direct.

## 3. Financement Direct du Coffre (Fund Agency)
- Seul un profil de niveau `ADMIN` ou `SUPER_ADMIN` peut injecter de l'argent dans le coffre.
- L'action (`POST /wallets/agency/:id/fund`) nécessite le `x-action-pin`.
- Elle augmente le `walletBalance` de l'agence et enregistre une `WalletTransaction` de type `FUNDING`.

## 4. Retrait Direct (Withdraw / Adjust)
- Tout ajustement négatif du coffre (ex: virement du coffre vers la banque) nécessite une validation par Action PIN.
- Si le solde de l'agence n'est pas suffisant pour couvrir une sortie, l'API renvoie l'erreur `WALLET_001`.
