# Workflow du Module Agence (Agency)

L'agence est l'entité physique ou logique qui regroupe les agents sur le terrain et centralise leurs versements. Chaque institution (IMF) peut posséder plusieurs agences.

## 1. Création de l'Agence
- Un SuperAdmin ou Admin crée une agence pour son institution (`POST /agencies`).
- L'agence est rattachée au `institutionId` du créateur.

## 2. Rattachement des Utilisateurs (Agents/Managers)
- Lors de la création d'un utilisateur (`POST /users`), celui-ci peut être rattaché à une agence (`agencyId`).
- Si un agent est rattaché à une agence, tous ses encaissements sur le terrain (`CollectionTransaction`) et tous ses versements de caisse (`CashRemittance`) sont automatiquement liés à cette agence.

## 3. Rôle du Manager d'Agence
- Le `MANAGER` est généralement assigné à une agence spécifique.
- Ses requêtes (ex: liste des versements en attente, liste des transactions de collecte) sont filtrées pour ne retourner que les données de son agence.

## 4. Portefeuille d'Agence (`walletBalance`)
- L'agence possède un solde virtuel (`walletBalance`).
- Lorsqu'un agent dépose son cash en agence (Remittance `VALIDATED`), le montant est **déduit** du solde de l'agent et **ajouté** au solde de l'agence.
- L'agence accumule ainsi la trésorerie ramenée par les agents, qui pourra ensuite être transférée en banque.
