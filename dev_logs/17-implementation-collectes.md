# Implémentation : Collectes & Épargne (Flux Financier)

**Date** : 17 Juin 2026
**Objectif** : Brancher l'historique des collectes sur l'API et supprimer les données mockées pour démarrer la Phase 5.

## 1. Adaptation de l'Écran de Collectes (`CollectesScreen.tsx`)
- Remplacement du mock `collectesData` par `collectionService.getTransactions({ type: "DEPOSIT" })`.
- Utilisation du nouveau type `CollectionTransaction`.
- Extraction des données de reçu (le `receiptPayload` structuré par l'API mobile de l'agent) pour reconstruire l'affichage sans avoir besoin de faire des jointures complexes : `agentName`, `clientName`, `localRef`, `date`.
- Ajustement des widgets "Encaissés" et "Dépôts" avec les données réelles agrégées.

## 2. Détail de la Collecte (`CollecteDetailModal.tsx`)
- Adaptation de l'interface du "Reçu de l'agent" pour exploiter pleinement le `receiptPayload`.
- Affichage de la référence locale, de la référence système, et de la signature cryptographique du reçu (qui certifie que la collecte a bien eu lieu physiquement).

## 3. Sécurité / Fallbacks
- Au cas où l'API est injoignable, un message propre "Chargement de l'historique de collecte..." puis "Aucune collecte trouvée" s'affiche (pas de crash Next.js).
- Si le `receiptPayload` est partiellement manquant (anciens tests), les composants tombent gracieusement sur des placeholders (`"Inconnu"`, `--:--`).

## Prochaines étapes de la Phase 5
- Versements Physiques (Remittance)
- Crédits (Loans)
