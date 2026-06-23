# Implémentation : Intégration QR Code et Traçabilité API

**Date** : 17 Juin 2026
**Objectif** : Générer le QR Code dynamique depuis le Payload de l'API et sécuriser le logging pour l'environnement de développement.

## 1. Génération Automatique du QR Code (`LoginScreen.tsx` & `auth.types.ts`)
- **Problème** : Le backend renvoie la chaîne de configuration native `otpauthUrl` (ex: `otpauth://totp/...`) au lieu d'une image.
- **Solution implémentée** :
  - Mise à jour de l'interface `LoginResponse` pour accepter `otpauthUrl`.
  - Au moment du déclenchement du `require2FaSetup`, le frontend encode cette URL.
  - Utilisation de l'API publique (zéro dépendance) `api.qrserver.com` pour transformer à la volée la chaîne de caractères en image PNG affichable dans le flux.

## 2. Traçabilité et Logs Conditionnels (`api.ts` & `LoginScreen.tsx`)
- **Problème** : Le développeur avait besoin de voir les Payload exacts de l'API pour debugger, mais laisser des `console.log` actifs en production présente un risque de sécurité majeur.
- **Solution implémentée** :
  - Ajout de trackers explicites (`[API REQUEST]`, `[API RESPONSE SUCCESS]`, `[API RESPONSE ERROR]`) dans les intercepteurs Axios.
  - Enveloppement systématique de ces logs dans la condition `if (process.env.NODE_ENV === "development")`.
  - Résultat : Visibilité totale en local (`npm run dev`), silence radio absolu en production (`npm run build`).
