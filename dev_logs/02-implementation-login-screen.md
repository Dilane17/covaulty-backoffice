# Implémentation : Formulaire de Connexion (LoginScreen)

**Date** : 16 Juin 2026
**Objectif** : Implémenter le flux complet d'authentification conditionnelle (Login, OTP, 2FA) dans l'interface utilisateur.

## Ce qui a été fait :

1. **Refonte Logique (`src/components/screens/LoginScreen.tsx`)** :
   - Mise en place d'une state machine locale avec `step` (`"login" | "otp" | "2fa-setup" | "2fa"`).
   - Appel des fonctions d'`authService` selon l'étape actuelle.
   - Branchement conditionnel (if/else) sur la réponse de l'API :
     - Si `requireVerification` -> affichage OTP.
     - Si `require2FaSetup` -> affichage du QR Code retourné par l'API et demande du code 2FA.
     - Si `require2Fa` -> demande directe du code 2FA.
     - Si `accessToken` -> connexion réussie et mise à jour globale (`useAuthStore`).
   
2. **Redirection Post-Login par Rôle** :
   - Implémentation de la fonction `redirectAfterLogin`.
   - Si l'utilisateur est `SUPER_ADMIN`, `ADMIN` ou `MANAGER`, il est redirigé vers `#dashboard`.
   - Si l'utilisateur est `AGENT`, il est redirigé vers `#collectes`.

3. **Gestion des erreurs et de l'état** :
   - Ajout d'un state `isLoading` pour désactiver le bouton pendant la soumission (UX).
   - Ajout d'un composant d'erreur pour intercepter les erreurs API et les afficher à l'utilisateur sous la forme d'une bannière rouge avec le message de l'API ou un message par défaut.

4. **Nettoyage CSS et Tailwind** :
   - Conformément aux instructions, **tous** les `style={{...}}` statiques ont été supprimés du composant.
   - Ils ont été remplacés par leurs équivalents en classes utilitaires **Tailwind CSS** (`mt-7`, `flex`, `flex-col`, `gap-5`, `text-[var(--primary)]`, `text-xs`, `font-medium`, `h-auto` etc.).
   - Le design originel a été parfaitement conservé avec les utilitaires Tailwind et les classes globales existantes (`.h2`, `.lead`, `.field`, `.input`, `.btn`, `.divider-or`).

5. **Ajustement de l'API** :
   - Modification de la signature de `verifyOtp` dans `auth.service.ts` pour qu'elle puisse renvoyer les données (notamment `require2FaSetup` et `qrCodeUrl`) afin de poursuivre le workflow, plutôt que de ne rien retourner (`void`).
