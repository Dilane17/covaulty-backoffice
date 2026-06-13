<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:covaulty -->
# Covaulty · Backoffice

SaaS de supervision de la collecte journalière d'épargne (Bénin). Backoffice web
porté depuis un prototype design vers **Next.js (App Router) + Tailwind CSS v4 + lucide-react**.

## Commandes
- `npm run dev` — serveur de développement (http://localhost:3000)
- `npm run build` — build de production
- `npm start` — lancer le build de production
- `npx eslint src` — linter

## Architecture
- `src/app/page.js` — point d'entrée, rend `<CovaultyApp />`.
- `src/app/layout.js` — layout racine (locale `fr`, métadonnées).
- `src/app/globals.css` — Tailwind + **design-system Covaulty** (tokens, composants `.card`,
  `.btn`, `.pill`, `.tbl`, layout `.shell`/`.sidebar`/`.topbar`, écran `.login`…).
- `src/components/CovaultyApp.jsx` — **toute l'application** (composant client unique) :
  routeur par hash (`#dashboard`, `#agents`…), shell (sidebar + topbar), 14 écrans,
  graphiques SVG (LineChart, BarChart, ForecastChart, DonutChart, Sparkline) et
  le jeu d'icônes `Ic` adossé à **lucide-react**.

## Design system (palette Tricolore)
Rouge Mahogany `#B3001B` · Carbon Black `#262626` · Baltic Blue `#255C99` · papier `#F6F4F3`.
Typo : Clash Display + JetBrains Mono (tabular-nums). Radius 8/14/22/32.

## Navigation
SPA à routage par hash dans `CovaultyApp`. L'app démarre sur `#login`, puis le shell
(sidebar groupée Pilotage/Gestion/Finance/Paramètres) donne accès aux écrans.
<!-- END:covaulty -->
