# Audit Complet UI / Code - Covaulty Backoffice

## 1. Résumé exécutif

**Score global de cohérence : 6/10**
Le backoffice possède une base visuelle solide et un design system bien défini dans `globals.css` (palette Tricolore, typo Clash Display, composants natifs CSS). Cependant, la base de code souffre d'une forte dette technique liée au prototypage rapide : logique métier fortement couplée aux vues, styles inline abondants, et violations de l'accessibilité.

### Top 5 des problèmes les plus critiques à corriger en priorité
1. **Surcharge de styles `inline` (`style={{...}}`)** : Plus de 300 occurrences d'injections CSS inline (couleurs en dur `#fff`, grid templates, padding) contournant le design system.
2. **Couplage excessif des composants (God Objects)** : Des écrans comme `DashboardScreen.tsx` (733 lignes) ou `LoginScreen.tsx` (429 lignes) concentrent l'UI, le state complexe et les appels API (`fetchLiveData`).
3. **Typage faible (`any`)** : Présence d'environ 80 occurrences du type `any` dans des endroits critiques (parsing d'API, state local).
4. **Accessibilité (a11y) quasi-inexistante** : Aucun `aria-label` sur les `button.btn-icon`, et aucun lien `<label htmlFor="...">` sur les formulaires.
5. **Incohérence structurelle des Modales** : Plusieurs modales ne respectent pas le pattern standard du design system (`.modal-overlay > .modal > .modal-head > .modal-body`) et recréent leurs propres wrappers.
   
### Top 5 des bonnes pratiques déjà en place à conserver
1. **Fichiers CSS Centralisés** : Excellente configuration des tokens `var(--primary)`, `var(--carbon)` et utilitaires `.btn`, `.pill`, `.card` dans `globals.css`.
2. **Nettoyage des Timers (`useEffect`)** : Tous les `setInterval` identifiés (horloge du dashboard, ping) sont correctement nettoyés dans le cycle de vie du composant (`clearInterval`).
3. **Usage d'icônes génériques** : L'utilisation de composants wrapper `<Ic.* />` (lucide-react) garantit une uniformité visuelle.
4. **Balises `alt` sur les images** : Les logos et QR codes possèdent correctement leurs balises alternatives (`alt="QR Code 2FA"`, `alt="Logo"`).
5. **Routing standardisé** : Le layout Shell (`Sidebar` / `Topbar`) est stable et isole correctement le contenu principal.

---

## 2. Audit par écran

| Écran | Layout OK | Design System OK | États complets | Code propre | Score /5 |
|---|---|---|---|---|---|
| `DashboardScreen` | ✅ Oui | ❌ Non (Styles inline) | ✅ Oui | ❌ Non (God Object, 733L) | 2/5 |
| `RapportsScreen` | ✅ Oui | ❌ Non | ⚠️ Partiel | ❌ Non (Logique data lourde) | 2.5/5 |
| `TransactionsScreen` | ✅ Oui | ❌ Non (Inputs en dur) | ✅ Oui | ⚠️ Moyen (434L) | 3/5 |
| `LoginScreen` | ⚠️ Spécifique | ✅ Oui | ✅ Oui | ❌ Non (Logique auth + UI) | 2.5/5 |
| `MapScreen` | ✅ Oui | ✅ Oui | ⚠️ Partiel | ⚠️ Moyen (Logique leaflet) | 3/5 |
| `ClientsScreen` | ✅ Oui | ✅ Oui | ✅ Oui | ✅ Oui | 4.5/5 |
| `AgentsScreen` | ✅ Oui | ✅ Oui | ✅ Oui | ✅ Oui | 4.5/5 |
| `PlansEpargneScreen` | ✅ Oui | ⚠️ Moyen (Inline grid) | ✅ Oui | ✅ Oui | 4/5 |
| `AgencesScreen` | ✅ Oui | ✅ Oui | ✅ Oui | ✅ Oui | 4.5/5 |
| `InstitutionsScreen` | ✅ Oui | ⚠️ Moyen (Inline color) | ✅ Oui | ✅ Oui | 4/5 |
| `SetupPasswordScreen`| ⚠️ Spécifique | ❌ Non (Styles inline) | ✅ Oui | ✅ Oui | 3.5/5 |
| `VersementsScreen` | ✅ Oui | ❌ Non (Inline padding) | ✅ Oui | ✅ Oui | 4/5 |
| `CreditsScreen` | ✅ Oui | ✅ Oui | ✅ Oui | ✅ Oui | 4.5/5 |
| `LiquiditeScreen` | ✅ Oui | ✅ Oui | ✅ Oui | ✅ Oui | 4.5/5 |

---

## 3. Détail par catégorie

### Design System
Des violations massives du système visuel ont été trouvées via des balises de style inline :
- **`src/components/screens/PlatformDashboardScreen.tsx` (l.46, 52, 58)** : Animations CSS hardcodées (`animationDelay`).
- **`src/components/screens/VersementsScreen.tsx` (l.88)** : Surcharge du padding du design system (`style={{ padding: 0 }}`).
- **`src/components/screens/PlansEpargneScreen.tsx` (l.70)** : Couleur de texte forcée (`style={{ color: "var(--accent)" }}`).
- **`src/components/modals/AgentFicheModal.tsx` (l.45)** : Arrière-plan forcé (`style={{ background: "var(--primary)", color: "#fff" }}`).
- *Note globale* : Les grilles CSS sont très souvent codées en dur (ex: `style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}`). Celles-ci devraient faire partie de Tailwind (`grid grid-cols-2`).

### Composants et Modales
- **Structure de modale dupliquée/non standard** : 
  `PlanEpargneFormModal.tsx`, `AgenceFormModal.tsx`, `InviteInstitutionModal.tsx` utilisent `.modal-content` (un vieux reliquat) et non la hiérarchie standard validée dans `ClientFicheModal.tsx` (`.modal > .modal-head > .modal-body`).
- **Composant Fourre-tout** : `src/components/ui/Field.tsx` (310 lignes) semble contenir une logique excessive (probablement des variantes multiples) pour un simple composant d'affichage de champ.

### Code (React & TypeScript)
- **Logique métier dans la Vue (Custom Hooks manquants)** : 
  `DashboardScreen.tsx` l.87 (`const fetchLiveData = async () => {...}`) parse les flux de données manuellement sur plus de 150 lignes. Ceci devrait être extrait dans un `useDashboardData()`. Même problème sur `RapportsScreen.tsx` l.47.
- **Dette TypeScript (`any`)** : 
  - `src/components/screens/RapportsScreen.tsx` : Plus de 20 instances de `any` (ex: `volume.reduce((acc: any, txn: any) => ...)`).
  - `src/components/screens/DashboardScreen.tsx` l.75 : State non typé (`useState<any[]>([])`).

### Accessibilité (A11y)
- **Boutons sans nom** : Les boutons d'icônes (`<button className="btn-icon"><Ic.X /></button>`) n'ont pas d'attribut `aria-label`, ce qui les rend invisibles pour les lecteurs d'écran.
- **Inputs orphelins** : Les formulaires (ex: `PlanEpargneFormModal.tsx` l.56, `ClientFormModal.tsx` l.95) ont des balises `<input>` ou `<select>` mais aucune liaison via l'`id` avec une balise `<label htmlFor="...">`. Le clic sur le texte ne déclenche pas le focus.

---

## 4. Recommandations pour la refonte

Voici l'ordre de priorité strict pour nettoyer le backoffice :

1. **Extraction de Logique (Semaine 1)**
   - Créer un dossier `src/hooks/` et extraire toute la logique de fetch de `DashboardScreen.tsx`, `RapportsScreen.tsx`, et `TransactionsScreen.tsx` vers des hooks (`useDashboardStats`, `useReports`, etc.).
   - Assainir les types TypeScript (Remplacer les `any` par des types d'inférence stricts existants dans `src/types/`).

2. **Refactorisation du Design System (Semaine 1)**
   - Bannir `style={{}}` du projet. Remplacer les grilles inline par des classes Tailwind (`grid`, `grid-cols-2`, `gap-4`).
   - Remplacer les couleurs inline (`color: "#fff"`) par les équivalents Tailwind configurés ou par des classes de tokens natives.

3. **Standardisation des Modales (Semaine 2)**
   - Créer un composant générique `<Modal />`, `<ModalHeader />`, `<ModalBody />` pour encapsuler la structure HTML et remplacer la copie manuelle des `div` dans la quinzaine de modales existantes.
   - Refactoriser `AgenceFormModal`, `PlanEpargneFormModal`, etc., pour utiliser cette base.

4. **Accessibilité (Semaine 2)**
   - Ajouter `aria-label` à tous les composants `btn-icon`.
   - Lier les labels des inputs via `id` et `htmlFor`.
