# Workflow du Module Client

## 1. Description Générale
Ce module gère le KYC (Know Your Customer) et le profil financier des clients de l'institution.
Dans un contexte multi-tenant, un client appartient strictement à une `Institution`.

## 2. Cycle de vie d'un Client
1. **Enregistrement (KYC)** : L'Agent ou le Manager crée le client.
   - Les informations obligatoires incluent le numéro de téléphone, le nom et le prénom.
   - Le système génère automatiquement un `clientCode` unique.
   - Dès sa création, un profil de Score de Crédit (`CreditScore`) est initialisé avec une valeur de base (ex: 300).
2. **Identification Mobile** : 
   - Le client utilise l'application mobile (Voir Workflow `Auth`).
   - Il scanne le QR code généré par l'agent, configure son PIN et lie son appareil au compte.
3. **Opérations Clients** :
   - Le client ne peut qu'effectuer des opérations de **lecture** sur son propre profil (Voir ses soldes, son historique, son score de crédit).
   - Les modifications (ajustements manuels de solde) sont faites par les Managers via le endpoint d'ajustement (soumis au `x-action-pin`).

## 3. Score de Crédit
- Modèle de scoring comportemental. Il évolue en fonction de la régularité des paiements et de l'historique d'épargne. (Évolutif via IA dans la phase 5).
