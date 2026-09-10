# Versa Capital — refonte (prototype)

Maquette fonctionnelle de refonte pour [versacapital.ca](https://versacapital.ca/),
cabinet-conseil en financement d'équipement commercial basé à
Saint-Augustin-de-Desmaures.

**Ce n'est pas le site officiel.** C'est un prototype destiné à la présentation
client, déployé sur `versa.codesurmesure.ca`.

---

## Ce que c'est

Le site actuel tourne sur WordPress avec le thème Avada. Cette maquette reprend
leur contenu réel et leur nouvelle identité visuelle (janvier 2026), mais
remplace la mise en page statique par un site rythmé, avec un estimateur de
paiement interactif et des compteurs qui fonctionnent.

Bilingue français et anglais, le français étant la langue par défaut.

## Démarrer en local

```bash
npm install
npm run dev
```

Le serveur écoute sur [http://localhost:43127](http://localhost:43127) et `/`
redirige vers `/fr`.

| Commande            | Rôle                                    |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Serveur de développement (port 43127)   |
| `npm run build`     | Build de production (sortie standalone) |
| `npm run start`     | Sert le build de production             |
| `npm run lint`      | ESLint                                  |
| `npm run typecheck` | TypeScript sans émission                |

## Stack

- **Next.js 16** (App Router, Turbopack, sortie `standalone`)
- **TypeScript**, **Tailwind CSS v4**, **shadcn/ui** (primitives Radix)
- Aucune base de données, aucune authentification, aucun service externe

## Structure

```
src/
  app/
    [locale]/            Layout racine (contient <html>), pages par locale
      solutions/         Vue d'ensemble + page par produit ([slug])
      equipements/       Explorateur filtrable des 14 catégories
      cabinet/           Le cabinet, valeurs, équipe
      faq/               Questions fréquentes
      contact/           Coordonnées + formulaire
    api/leads/           Réception des demandes de financement (stub)
  components/
    brand/               Logo et chevron de marque
    motion/              Reveal, Atmosphere, Counter, SmoothAnchor
    site/                Header, Footer, Section, PageHero
    home/                Sections de la page d'accueil
    equipment/           Explorateur d'équipements
    forms/               Formulaire de demande
    ui/                  Primitives shadcn/ui
  content/               Dictionnaires FR et EN, typés
  lib/                   Routes et calculs de financement
  hooks/                 useReveal
```

Le layout racine vit dans `src/app/[locale]/layout.tsx` afin que l'attribut
`lang` du document suive la locale. La redirection de `/` vers `/fr` est
déclarée dans `next.config.ts`.

## Identité visuelle

Les couleurs viennent du fichier logo publié avec leur identité de
janvier 2026, échantillonné pixel par pixel :

| Rôle                | Valeur    |
| ------------------- | --------- |
| Navy (fond de marque) | `#133756` |
| Chevron, ton 1      | `#97d3f2` |
| Chevron, ton 2      | `#1ba5de` |
| Chevron, ton 3      | `#185da4` |
| Chevron, ton 4      | `#14467c` |

Les tons ambre et orange visibles dans le CSS du site actuel sont des valeurs
par défaut du thème Avada, pas des couleurs de marque.

`public/brand/versa-logo-{light,dark}.png` sont dérivés du logo officiel : le
fond navy a été détouré pour que la marque puisse se poser sur n'importe quelle
surface, et la variante `dark` recolore le lettrage pour les fonds clairs.

## Animations

- Entrées au défilement via `IntersectionObserver`, une seule fois, seuil 0,5
  (abaissé automatiquement pour les blocs plus hauts que l'écran).
- Fondu vers le haut : `opacity 0` + `translateY(50px)` sur 0,7 s en
  `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, décalage d'environ 0,3 s entre les
  éléments d'un même groupe.
- Fond atmosphérique permanent : nappes bleues dérivant sur 27 à 34 s, grain en
  mouvement, réaction au curseur très amortie et plafonnée à 26 px.
- Défilement ancré adouci sur 800 ms, avec décalage pour l'en-tête fixe.
- `prefers-reduced-motion` gèle le fond et fait apparaître les entrées
  directement à leur état final.

Les styles d'entrée sont préfixés par `.js`, classe ajoutée avant le premier
rendu. Si le bundle ne se charge pas, le contenu reste visible au lieu de rester
bloqué à `opacity: 0`.

## Contenu

Repris tel quel du site actuel : les quatre produits et leurs avantages, les
quatorze catégories d'équipement, les cinq questions fréquentes, les valeurs du
cabinet, les coordonnées et la signature « Pour les projets d'aujourd'hui. Et
les liens de demain. »

Écrit pour la maquette : les textes explicatifs des sections « Pourquoi passer
par un cabinet » et « Comment se passe une demande », les exemples
d'équipements dans chaque catégorie, une sixième question sur l'équipement
usagé, et les libellés de l'estimateur.

Les chiffres du cabinet (19 courtiers, 21 personnes, fondation en 2022)
proviennent de leur page LinkedIn et du registre des entreprises du Québec.

### À valider avec le client

- **Photographie.** La maquette s'appuie sur la géométrie de marque et la
  typographie là où des photos d'équipement devraient se trouver. De vraies
  photos de leurs dossiers seraient le gain le plus important.
- **Les compteurs.** Le site actuel affiche `0` partenaires concessionnaires,
  `0` partenaires financiers et `0` clients satisfaits. Il faut leurs vrais
  chiffres pour remplacer ceux utilisés ici.
- **Destination du formulaire.** `src/app/api/leads/route.ts` valide la demande
  et l'écrit dans les logs. Il reste à la brancher sur un courriel ou un CRM.
- **Taux de l'estimateur.** `src/lib/finance.ts` utilise des taux illustratifs.
  À remplacer par des fourchettes que le cabinet accepte de montrer, ou à
  retirer si elles sont jugées trop sensibles.

## Déploiement

Cible : `versa.codesurmesure.ca` → `158.69.1.173`, derrière le nginx déjà
installé sur ce VPS, qui héberge d'autres sites. Le script ne touche qu'à son
propre vhost, sa propre unité systemd et `/var/www/versa-capital`.

```bash
VPS_SSH_USER=<utilisateur> ./deploy/deploy.sh
```

Le script construit l'application, envoie la sortie `standalone`, installe
`deploy/versa-capital.service` (Node sur `127.0.0.1:43127`) et
`deploy/nginx-versa.conf` (proxy inverse), puis recharge nginx seulement si
`nginx -t` passe. Si nginx refuse le vhost, celui-ci est retiré et le serveur
reste sur sa configuration précédente. Une fois certbot passé, le script ne
réécrit plus le vhost, pour ne pas effacer le bloc TLS.

Variables reconnues : `VPS_SSH_USER` (obligatoire, doit avoir sudo),
`VPS_HOST` (défaut `158.69.1.173`), `VPS_SSH_KEY` (clé privée, sinon l'agent
SSH), `SKIP_BUILD=1` (réutiliser un build existant).

Pour un agent Cloud, les identifiants se déposent dans Cursor Dashboard →
Cloud Agents → Secrets (`VPS_SSH_USER`, `VPS_SSH_KEY`) ; ils ne sont pas
présents dans l'environnement par défaut.

Le certificat TLS s'obtient ensuite avec certbot :

```bash
ssh <utilisateur>@158.69.1.173 "sudo certbot --nginx -d versa.codesurmesure.ca"
```

Le vhost envoie `X-Robots-Tag: noindex, nofollow`, la maquette n'ayant pas à
être indexée.
