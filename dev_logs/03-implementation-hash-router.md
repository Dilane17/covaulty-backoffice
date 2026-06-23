# Implémentation : Routeur basé sur le Hash (Hash Router)

**Date** : 16 Juin 2026
**Objectif** : Transformer la gestion du state basique des écrans en un véritable routeur dynamique basé sur l'URL de la fenêtre (via le `#hash`).

## Analyse Initiale

Le point d'entrée de l'application cliente `CovaultyApp.tsx` gérait la navigation avec un simple React State (`const [route, setRoute] = useState<RouteId>("login")`). 
Il ne regardait jamais l'URL. Conséquence : si l'utilisateur mettait `http://localhost:3000/#dashboard` dans sa barre d'adresse, il atterrissait quand même sur `#login`. De plus, les liens natifs de la Sidebar (balises `<a>`) avaient un comportement court-circuité par `e.preventDefault()`.

## Ce qui a été fait :

1. **Centralisation des routes valides** :
   - Création d'un tableau `VALID_ROUTES` permettant de vérifier si un hash entré manuellement dans l'URL correspond à un écran existant (évitant ainsi les écrans blancs).

2. **Écoute de l'événement `hashchange`** :
   - Mise en place d'un hook `useEffect` pour surveiller les changements natifs du hash de l'URL via `window.addEventListener("hashchange", ...)`.
   - À chaque changement, l'événement extrait le hash (ex: `#dashboard` -> `dashboard`), le valide, et met à jour le state React `route`.

3. **Comportement par défaut (Fallback)** :
   - Au tout premier chargement de l'application (Mount), le hook lit l'URL actuelle.
   - S'il n'y a aucun hash, ou s'il est invalide, il modifie l'URL pour la forcer à `#login` par défaut.

4. **Programmatic Navigation (`onNav`)** :
   - La fonction `handleNav` passée aux enfants (LoginScreen, Sidebar) ne modifie désormais **plus directement le state React**. 
   - Au lieu de ça, elle modifie `window.location.hash = '#' + id`. 
   - Cela déclenche l'événement `hashchange`, qui est intercepté par le point 2, qui met à jour l'état. Ainsi, le state React et l'URL sont parfaitement et infailliblement synchronisés, tout en respectant la contrainte de ne pas installer de librairie externe (comme `react-router`).
