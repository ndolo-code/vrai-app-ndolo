# Ndolomath MVP — Classe de 3e (BEPC)

Ce MVP expose uniquement l'espace **3e / BEPC** en accès libre (sans login), avec des données locales de démonstration et un fonctionnement PWA orienté hors-ligne.

## Développement

```bash
pnpm dev
```

## Build statique

```bash
pnpm build
```

Le projet est configuré en export statique (`output: "export"`). Les fichiers générés sont dans `out/`.

## Déploiement statique (coût minimal)

Déployer le dossier `out/` sur un hébergeur statique (Netlify, Vercel static output, Cloudflare Pages, GitHub Pages, etc.).

## Données BEPC locales

Les sujets/corrections locaux sont servis depuis `public/data/bepc/`.

- `public/data/bepc/index.json` : index des années disponibles.
- `public/data/bepc/<annee>/subject.json` : sujet.
- `public/data/bepc/<annee>/correction.json` : correction.

Années de démo incluses : **1999** et **2025**.

## Hors-ligne

- Manifest PWA : `public/manifest.json`
- Service worker : `public/sw.js`
- Fallback hors-ligne : `/offline/`

Après une première visite en ligne, l'app conserve le shell et les données BEPC locales de démo pour un usage hors-ligne.
