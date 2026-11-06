/* Catalogue des pages liées. Le gabarit lit href, kicker, title et description.
   Une entrée incomplète ou une clé inconnue doit échouer, pas produire « undefined ». */

const CHAMPS = ['href', 'kicker', 'title', 'description'];

export const pagesConnexes = {
  'financement-equipements': {
    href: '/financement-equipements/',
    kicker: 'Service',
    title: 'Financement d’équipements',
    description: 'Crédit-bail, prêt et location pour l’équipement de l’entreprise.',
  },
  'credit-bail': {
    href: '/credit-bail/',
    kicker: 'Produit',
    title: 'Crédit-bail',
    description: 'Location-acquisition ou location-exploitation, sans garantie de rachat.',
  },
  'financement-machinerie-lourde': {
    href: '/financement-machinerie-lourde/',
    kicker: 'Secteur',
    title: 'Machinerie lourde',
    description: 'Équipement de construction, d’excavation et forestier.',
  },
  'financement-camions-remorques': {
    href: '/financement-camions-remorques/',
    kicker: 'Secteur',
    title: 'Camions et remorques',
    description: 'Équipement de transport : camion et remorque.',
  },
  'financement-equipements-agricoles': {
    href: '/financement-equipements-agricoles/',
    kicker: 'Secteur',
    title: 'Équipements agricoles',
    description: 'Équipement du secteur Agriculture.',
  },
  'refinancement-equipements': {
    href: '/refinancement-equipements/',
    kicker: 'Produit',
    title: 'Refinancement d’équipements',
    description: 'Vente avec cession-bail ou renouvellement d’un dossier déjà en place.',
  },
  'fonds-de-roulement': {
    href: '/fonds-de-roulement/',
    kicker: 'Produit',
    title: 'Fonds de roulement',
    description: 'Prêt pour l’exploitation, distinct du financement d’un bien.',
  },
  'financement-corporatif-strategique': {
    href: '/financement-corporatif-strategique/',
    kicker: 'Service',
    title: 'Financement corporatif et stratégique',
    description: 'Croissance, acquisitions et structure financière.',
  },
  versaequip: {
    href: 'https://www.versaequip.ca/fr/accueil.htm',
    kicker: 'Nouvelle ligne de produits',
    title: 'Vente et achat d’équipements',
    description: 'Versa Équipements',
    external: true,
  },
};

export const liensParPage = {
  'financement-machinerie-lourde': ['financement-equipements', 'credit-bail', 'refinancement-equipements', 'versaequip'],
  'financement-camions-remorques': ['financement-equipements', 'credit-bail', 'refinancement-equipements', 'versaequip'],
  'financement-equipements-agricoles': ['financement-equipements', 'credit-bail', 'financement-machinerie-lourde', 'versaequip'],
  'refinancement-equipements': ['financement-equipements', 'credit-bail', 'fonds-de-roulement', 'versaequip'],
  'fonds-de-roulement': ['financement-corporatif-strategique', 'financement-equipements', 'refinancement-equipements', 'versaequip'],
};

export function carteConnexe(cle) {
  const page = pagesConnexes[cle];
  if (!page) throw new Error(`Clé de page connexe absente du catalogue : ${cle}`);
  for (const champ of CHAMPS) {
    const valeur = page[champ];
    if (typeof valeur !== 'string' || !valeur.trim() || valeur.includes('undefined')) {
      throw new Error(`Champ ${champ} manquant pour ${cle}`);
    }
  }
  return page;
}

export function htmlCarte(cle) {
  const page = carteConnexe(cle);
  if (page.external) {
    return `<a class="rel fade" data-versaequip href="${page.href}" target="_blank" rel="noopener" aria-label="${page.title}, ${page.description}, www.versaequip.ca (nouvel onglet)"><span class="rel__k">${page.kicker}</span><span class="rel__n">${page.title}</span><span class="rel__meta">${page.description}</span><span class="svc__arrow" aria-hidden="true"></span></a>`;
  }
  return `<a class="rel fade" href="${page.href}"><span class="rel__k">${page.kicker}</span><span class="rel__n">${page.title}</span><span class="rel__meta">${page.description}</span><span class="svc__arrow" aria-hidden="true"></span></a>`;
}

export function htmlCartes(cles) {
  return cles.map((cle) => `        ${htmlCarte(cle)}`).join('\n');
}
