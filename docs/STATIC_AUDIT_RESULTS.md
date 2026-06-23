# Résultats de l'Audit Statique du Code

Ce document consigne les résultats de l'auto-vérification statique des composants React liés à la checklist E2E.

---

## Étape 2 — Institution
| Vérification | Statut | Détail |
|---|---|---|
| Payload complet | ❌ | Le bouton "Sauvegarder" dans `src/components/screens/SettingsScreen.tsx` n'a pas de prop `onClick` et le formulaire n'est pas lié à l'API (`tenantService.update` manquant). |
| Erreurs mappées | ❌ | Aucune gestion d'erreur implémentée. |
| Refresh auto post-action | ❌ | Non implémenté. |
| PIN correctement injecté | N/A | |

---

## Étape 3 — Agence (`Agency`)
| Vérification | Statut | Détail |
|---|---|---|
| Payload complet | ✅ | `AgenceFormModal.tsx` collecte et envoie exactement `{ name, address, phone, email }` à `agencyService.create()`. |
| Erreurs mappées | ⚠️ | Le code attrape l'erreur mais se fie à `axiosErr.response?.data?.message` générique au lieu de vérifier explicitement le code `AGENCY_001`. |
| Refresh auto post-action | ✅ | `fetchAgencies()` est appelé juste après `agencyService.create()` dans `AgencesScreen.tsx`. |
| PIN correctement injecté | N/A | |

---

## Étape 4 — Staff
| Vérification | Statut | Détail |
|---|---|---|
| Payload complet | ⚠️ | `AgentFormModal.tsx` envoie un champ `adminPassword` supplémentaire à `userService.create()`, qui n'est pas documenté dans `docs/user/endpoints.md`. Le reste des champs est correct. |
| Erreurs mappées | ⚠️ | Affiche le message de l'API dynamiquement (`axiosErr...message`), mais ne mappe pas explicitement les codes `USER_002` et `WALLET_003`. |
| Refresh auto post-action | ✅ | `fetchUsers()` est bien appelé après la sauvegarde dans `AgentsScreen.tsx`. |
| PIN correctement injecté | N/A | |

---

## Étape 5 — Client (KYC)
| Vérification | Statut | Détail |
|---|---|---|
| Payload complet | ❌ | Le bouton "Nouveau client KYC" dans `src/components/screens/ClientsScreen.tsx` n'a pas de fonction `onClick`. La création est manquante côté UI. |
| Erreurs mappées | ❌ | Non implémenté. |
| Refresh auto post-action | ❌ | Non implémenté. |
| PIN correctement injecté | N/A | |

---

## Étape 6 — Plans d'épargne
**NON VÉRIFIABLE STATIQUEMENT — à tester manuellement**
*L'interface n'est pas implémentée (prévu via Postman ou script d'après la checklist).*

---

## Étape 7 — Compte Épargne Client
| Vérification | Statut | Détail |
|---|---|---|
| Payload complet | ❌ | `ClientFicheModal.tsx` n'a aucun bouton "Ouvrir un compte épargne". Il n'y a que le bouton "Lier un smartphone". |
| Erreurs mappées | ❌ | Non implémenté. |
| Refresh auto post-action | ❌ | Non implémenté. |
| PIN correctement injecté | N/A | |

---

## Étape 8 — Collecte Terrain
**NON VÉRIFIABLE STATIQUEMENT — à tester manuellement**
*L'action `POST /collection/transactions` s'effectue généralement côté Application Mobile ou via API directe (Postman). Le Front-End backoffice n'a pas d'UI pour simuler cette saisie.*

---

## Étape 9 — Versement Agent (Remittance) & Écart de caisse
| Vérification | Statut | Détail |
|---|---|---|
| Payload complet | ✅ | `VersementsScreen.tsx` inclut les actions `count(id, amount, pin)` et `resolve(id, amount, reason, pin)` avec les bons arguments. (L'action de création initiale n'est pas dans l'UI). |
| Erreurs mappées | ⚠️ | Le code intercepte le statut HTTP `409` pour simuler l'état `DISCREPANCY` (rafraîchissement automatique), mais les codes exacts `REM_001` et `REM_005` ne sont pas textuellement checkés (repose sur le fallback message API). |
| Refresh auto post-action | ✅ | `fetchRemittances()` est systématiquement appelé après `count` ou `resolve`. |
| PIN correctement injecté | ✅ | L'UI fait appel à `await requestPin()` et injecte la valeur correctement dans les requêtes de `remittanceService`. |

---

## Étape 10 — Crédit (Loan)
| Vérification | Statut | Détail |
|---|---|---|
| Payload complet | ✅ | `CreditsScreen.tsx` effectue bien `approve`, `disburse` et `createRepayment(amount, note)`. (L'action de création du prêt n'est pas dans l'UI). |
| Erreurs mappées | ⚠️ | Les erreurs utilisent toutes le fallback `axiosErr.response?.data?.message` au lieu du mapping strict des codes métier. |
| Refresh auto post-action | ✅ | `fetchData()` est exécuté après chaque approbation, décaissement ou paiement. |
| PIN correctement injecté | ✅ | `requestPin()` est appelé pour la fonction `handleDisburse` et injecté correctement. |

---

## Étape 11 — Alertes
| Vérification | Statut | Détail |
|---|---|---|
| Payload complet | ✅ | `AlertesScreen.tsx` déclenche `alertService.resolveAlert(id)`. |
| Erreurs mappées | ⚠️ | Le code attrape spécifiquement le code `ALERT_001` pour afficher "Alerte introuvable.", le reste utilise le message par défaut de l'API. |
| Refresh auto post-action | ✅ | `fetchAlerts(TAB_MAPPING[tab])` est invoqué après validation. |
| PIN correctement injecté | N/A | |

---

## Étape 12 — Dashboard & Rapports
| Vérification | Statut | Détail |
|---|---|---|
| Payload complet | ✅ | Les composants (`RapportsScreen`, `TransactionsScreen`, `BCEAOScreen`) agrègent massivement avec `Promise.all` via tous les services adéquats. L'export CSV applique bien l'encodage `\uFEFF` (BOM). |
| Erreurs mappées | ✅ | Protection efficace : tous les appels API possèdent un `.catch(() => [])` pour empêcher l'écran blanc (crash React) en cas de 500 sur un seul sous-module. |
| Refresh auto post-action | N/A | Affichage en lecture seule (pas d'action de mutation). |
| PIN correctement injecté | N/A | |
