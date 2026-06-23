# Workflow du Module User (Personnel)

## 1. Description Générale
Le module User gère le personnel de Covaulty. Un `User` n'est **jamais** un client final, c'est obligatoirement un membre du personnel.
Chaque utilisateur possède un `Role` strict : `SUPER_ADMIN`, `ADMIN`, `MANAGER`, ou `AGENT`.

## 2. La Sécurité et l'Isolation
1. **Isolation par Tenant** :
   - Chaque utilisateur est lié à une `Institution` (Sauf éventuellement le Super Admin système).
   - Les requêtes API filtrent automatiquement les utilisateurs pour ne renvoyer que ceux appartenant à l'`institutionId` du validateur en cours (`user.institutionId`).
2. **Assignation d'Agence** :
   - Un Agent ou Manager peut être restreint à une agence spécifique (`agencyId`).
   - Le système vérifie toujours que l'agence assignée appartient bien à la même institution que l'utilisateur (Erreur `WALLET_003` si violation).

## 3. Gestion du Statut
- Le soft-delete est activé (`deletedAt`). Un utilisateur supprimé n'est pas effacé de la base de données pour conserver l'intégrité de l'historique des collectes et des transactions. Il perd cependant son accès (`isActive: false`).

## 4. Workflows Spécifiques
- **Création Agent** : L'Admin crée un Agent. Il doit obligatoirement valider l'action avec son propre mot de passe (`adminPassword`). Le système génère automatiquement un identifiant unique (`agentCode`) et un mot de passe aléatoire à 6 caractères, puis les renvoie à l'Admin pour transmission. L'email est optionnel.
- **Réinitialisation Mot de Passe Agent** : L'Admin peut réinitialiser le mot de passe d'un agent via une action sécurisée nécessitant son propre mot de passe (`adminPassword`).
- **Réinitialisation Action PIN** : Seul un Admin peut forcer la réinitialisation de l'Action PIN d'un employé si celui-ci l'a oublié.
