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
  'en-equipment-financing': {
    href: '/en/equipment-financing/',
    kicker: 'Service',
    title: 'Equipment financing',
    description: 'Leasing, loans and rentals for business equipment.',
    locale: 'en',
  },
  'en-leasing': {
    href: '/en/leasing/',
    kicker: 'Product',
    title: 'Leasing',
    description: 'Capital lease or operating lease, with no purchase guarantee.',
    locale: 'en',
  },
  'en-heavy-machinery-financing': {
    href: '/en/heavy-machinery-financing/',
    kicker: 'Sector',
    title: 'Heavy machinery',
    description: 'Construction, excavation and forestry equipment.',
    locale: 'en',
  },
  'en-trucks-trailers-financing': {
    href: '/en/trucks-trailers-financing/',
    kicker: 'Sector',
    title: 'Trucks and trailers',
    description: 'Transportation equipment: trucks and trailers.',
    locale: 'en',
  },
  'en-agricultural-equipment-financing': {
    href: '/en/agricultural-equipment-financing/',
    kicker: 'Sector',
    title: 'Agricultural equipment',
    description: 'Equipment for the agriculture sector.',
    locale: 'en',
  },
  'en-equipment-refinancing': {
    href: '/en/equipment-refinancing/',
    kicker: 'Product',
    title: 'Equipment refinancing',
    description: 'Sale-leaseback or renewal of a file already in place.',
    locale: 'en',
  },
  'en-working-capital': {
    href: '/en/working-capital/',
    kicker: 'Product',
    title: 'Working capital',
    description: 'A loan for operations, separate from financing an asset.',
    locale: 'en',
  },
  'en-corporate-strategic-financing': {
    href: '/en/corporate-strategic-financing/',
    kicker: 'Service',
    title: 'Corporate and strategic financing',
    description: 'Growth, acquisitions and financial structure.',
    locale: 'en',
  },
  'versaequip-en': {
    href: 'https://www.versaequip.ca/',
    kicker: 'New product line',
    title: 'Equipment sales and purchases',
    description: 'Versa Équipements',
    external: true,
    locale: 'en',
  },
};

export const liensParPage = {
  'financement-machinerie-lourde': ['financement-equipements', 'credit-bail', 'refinancement-equipements', 'versaequip'],
  'financement-camions-remorques': ['financement-equipements', 'credit-bail', 'refinancement-equipements', 'versaequip'],
  'financement-equipements-agricoles': ['financement-equipements', 'credit-bail', 'financement-machinerie-lourde', 'versaequip'],
  'refinancement-equipements': ['financement-equipements', 'credit-bail', 'fonds-de-roulement', 'versaequip'],
  'fonds-de-roulement': ['financement-corporatif-strategique', 'financement-equipements', 'refinancement-equipements', 'versaequip'],
  'en/heavy-machinery-financing': ['en-equipment-financing', 'en-leasing', 'en-equipment-refinancing', 'versaequip-en'],
  'en/trucks-trailers-financing': ['en-equipment-financing', 'en-leasing', 'en-equipment-refinancing', 'versaequip-en'],
  'en/agricultural-equipment-financing': ['en-equipment-financing', 'en-leasing', 'en-heavy-machinery-financing', 'versaequip-en'],
  'en/equipment-refinancing': ['en-equipment-financing', 'en-leasing', 'en-working-capital', 'versaequip-en'],
  'en/working-capital': ['en-corporate-strategic-financing', 'en-equipment-financing', 'en-equipment-refinancing', 'versaequip-en'],
  'en/equipment-financing': ['en-leasing', 'en-heavy-machinery-financing', 'en-trucks-trailers-financing', 'en-agricultural-equipment-financing', 'en-equipment-refinancing', 'en-corporate-strategic-financing', 'versaequip-en'],
  'en/leasing': ['en-equipment-financing', 'en-corporate-strategic-financing', 'versaequip-en'],
  'en/corporate-strategic-financing': ['en-equipment-financing', 'en-leasing', 'en-working-capital', 'versaequip-en'],
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
    const onglet = page.locale === 'en' ? 'new tab' : 'nouvel onglet';
    return `<a class="rel fade" data-versaequip href="${page.href}" target="_blank" rel="noopener" aria-label="${page.title}, ${page.description}, www.versaequip.ca (${onglet})"><span class="rel__k">${page.kicker}</span><span class="rel__n">${page.title}</span><span class="rel__meta">${page.description}</span><span class="svc__arrow" aria-hidden="true"></span></a>`;
  }
  return `<a class="rel fade" href="${page.href}"><span class="rel__k">${page.kicker}</span><span class="rel__n">${page.title}</span><span class="rel__meta">${page.description}</span><span class="svc__arrow" aria-hidden="true"></span></a>`;
}

export function htmlCartes(cles) {
  return cles.map((cle) => `        ${htmlCarte(cle)}`).join('\n');
}
