# Implémentation : Crédits (Loans)

**Date** : 17 Juin 2026
**Objectif** : Créer le pipeline métier de gestion des micro-crédits, finalisant ainsi l'intégralité de la Phase 5.

## 1. Nouvel Écran (`CreditsScreen.tsx`)
Conception d'une nouvelle page de gestion des dossiers de crédits accessible via le menu `Finance > Crédits`.
- **Récupération des données croisées** : L'écran appelle simultanément `loanService.getAll()` et `clientService.getAll()` pour associer intelligemment l'ID du client à son vrai nom (Prénom Nom) et éviter de n'afficher qu'un UUID cryptique.

## 2. Pipeline de Décaissement
Chaque prêt suit une machine à état stricte, retranscrite sous forme d'actions contextuelles :
1. **PENDING** -> Bouton `Approuver` (Appelle `loanService.approve(id)`).
2. **APPROVED** -> Bouton `Décaisser` (Appelle `loanService.disburse(id)`). **Sécurité** : Cette action critique déclenche le `requestPin()` qui ouvre la modale "Action Sensible" et bloque l'exécution jusqu'à ce que le Manager valide via son PIN à 4 chiffres.
3. **DISBURSED** -> Bouton `Paiement` (Appelle `loanService.createRepayment(id, payload)`). L'utilisateur peut enregistrer un remboursement manuel via un simple prompt rapide.

## 3. Ajout au Routeur
- Injection de `credits` dans `VALID_ROUTES` de `CovaultyApp.tsx`.
- Ajout à la sidebar.

## Statut
- La Phase 5 (Flux Financier) est 100% connectée aux services API.
