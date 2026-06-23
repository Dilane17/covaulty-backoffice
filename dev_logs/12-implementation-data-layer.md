# Implémentation : Data Layer (Services API & Typage Strict)

**Date** : 17 Juin 2026
**Objectif** : Générer l'intégralité de la couche de services API (Typages et appels Axios) selon l'approche "Backend-for-Frontend" avant d'entamer le développement des interfaces visuelles.

## Réalisations

Conformément à la documentation backend (`docs/`), les modules suivants ont été entièrement typés (`src/types/`) et interfacés (`src/services/`) :

1. **Institution** (`institution.service.ts`) : Ajout de la création de tenant et de l'envoi d'invitations.
2. **Agence** (`agency.service.ts`) : CRUD complet pour les agences (Points de présence).
3. **Staff / User** (`user.service.ts`) : Gestion du personnel (Création, liste, modification de rôle, révocation de l'Action PIN).
4. **Clients KYC** (`client.service.ts`) : Création de profil, récupération du Score de crédit, et ajustement manuel de solde (protégé par Action PIN).
5. **Collecte & Épargne** (`collection.service.ts` & `savings.service.ts`) : 
   - Enregistrement des versements de collecte terrain.
   - Gestion des plages horaires (`Schedules`) de collecte.
   - Création de plans d'épargne (Tontines) et retraits en agence.
6. **Prêts (Loans)** (`loan.service.ts`) : Cycle de vie complet du crédit (Création -> Approbation -> Décaissement -> Remboursement), incluant l'échéancier (`LoanSchedule`).
7. **Wallet (Comptabilité)** (`wallet.service.ts`) : Suivi des encaisses des Agences (Coffre) et des Agents, avec injection sécurisée de fonds.

## Bénéfice
Tous ces services sont désormais "prêts à l'emploi" pour n'importe quel composant React via `await agencyService.getAll()`. La conception des écrans des prochaines phases sera purement orientée UI/UX sans se soucier du réseau.
