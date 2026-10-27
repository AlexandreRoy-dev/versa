# Versa Capital

Site statique de Versa Capital, cabinet-conseil en financement. Le projet est une application Vite (HTML, CSS, JavaScript) avec GSAP, ScrollTrigger, Lenis et split-type.

## Développement

```bash
npm ci
npm run dev
```

Le serveur de développement écoute sur [http://localhost:5180](http://localhost:5180).

## Build

```bash
npm run build
npm run preview
```

`npm run build` écrit le site dans `dist`. `npm run preview` sert ce dossier.

## GitHub Pages

Le domaine personnalisé `versa.roymarketing.ca` sert le site à la racine. `vite.config.js` fixe donc `base` à `/`. Les images dans `index.html` passent par `%BASE_URL%`, pour que les chemins suivent cette base.

Le workflow `.github/workflows/pages.yml` installe les dépendances, lance `npm run build`, puis publie le dossier `dist` sur la branche `gh-pages` à chaque push sur `main`. Une pull request ne déploie pas. La page Recrutement lit `VITE_RECRUTEMENT_FORM_URL` au build. Tant que cette variable est vide, le formulaire ne transmet rien. Voir `docs/recrutement-zoho.md`.

`public/CNAME` contient `versa.roymarketing.ca`. Ce fichier était sur la branche `gh-pages` du dépôt précédent. Il est recopié dans `dist` au build pour que le domaine personnalisé reste attaché au site.
