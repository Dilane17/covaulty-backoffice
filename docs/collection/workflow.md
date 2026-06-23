# Workflow du Module Collection (Collecte de Terrain)

## 1. Description Générale
La collecte est le cœur du métier. Les agents se déplacent sur le terrain pour récolter l'épargne ou les remboursements de prêt auprès des clients. 

Pour éviter les fraudes et garantir le suivi, le module applique des contraintes très strictes (Horaires, GPS, Limitation des encaissements).

## 2. Le Flux de Collecte
1. **Initialisation** : L'Agent arrive chez le client.
2. **Identification Client** : L'Agent sélectionne le client (ou scanne son QR code/carte).
3. **Transaction** : 
   - L'Agent saisit le montant collecté et sélectionne la destination (Compte Épargne ou Remboursement de Prêt).
   - L'application mobile de l'Agent capte les coordonnées GPS.
4. **Validation Backend** :
   - Le backend vérifie l'heure de la transaction via les `CollectionSchedule` (Plages horaires autorisées). Si l'agence n'autorise la collecte que de 08:00 à 18:00, toute transaction à 18h01 sera bloquée avec `COLLECT_001`.
   - Le backend vérifie la présence du GPS (`COLLECT_002`).
   - Le compte du client est crédité.
   - L'encaisse de l'Agent (`cashBalance`) est augmentée du montant.

## 3. Gestion des Horaires (CollectionSchedule)
Les managers définissent des plages horaires (`CollectionSchedule`) par agence ou par agent. 
- Si aucune plage n'est définie, la collecte est ouverte H24 (fallback).
- Si une plage existe (ex: Lundi, 08:00 - 18:00), le serveur rejette catégoriquement tout dépôt hors de cette fenêtre pour éviter les collectes nocturnes non sécurisées.

## 4. Lien avec la Comptabilité
- Il met à jour le `cashBalance` de l'agent.
- Il génère le `receiptPayload` avec signature HMAC.
- **Épargne** : Le système résout automatiquement l'unique compte épargne du client et le crédite. Si le client ne possède aucun compte épargne actif, la transaction est rejetée avec l'erreur `SAVINGS_006`.
