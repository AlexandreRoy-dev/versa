# Génère les pages services (Vite multi-page). Contenu tiré uniquement du site, de la brochure et du PDF Qui sommes-nous.
import re, os
H=open('index.html',encoding='utf-8').read()
DOMAIN='https://versa.roymarketing.ca'
def cut(a,b): i=H.index(a); j=H.index(b,i); return H[i:j]
head_tpl=H[:H.index('<body>')]
header=cut('<div class="progress"','</header>')+'</header>'
contact=cut('  <!-- CONTACT -->','</main>')
footer=cut('<footer','</html>')+'</html>'
IMG=lambda stem,alt,w,h,lazy: (f'<img src="%BASE_URL%img/{stem}-1400.webp" srcset="%BASE_URL%img/{stem}-800.webp 800w, %BASE_URL%img/{stem}-1400.webp 1400w, %BASE_URL%img/{stem}-2400.webp 2400w" sizes="100vw" alt="{alt}" width="{w}" height="{h}" '+('loading="lazy"' if lazy else 'fetchpriority="high"')+' />')
STEPS=[('Comprendre','Saisir la réalité de l’entreprise, ses opérations, son industrie, sa situation financière et ses ambitions.'),
('Structurer','Bâtir une stratégie de financement adaptée au projet, au profil et aux objectifs du client.'),
('Positionner','Préparer et présenter le dossier aux partenaires financiers appropriés en mettant en valeur ses forces.'),
('Comparer et expliquer','Comparer les options et rendre leurs impacts faciles à comprendre afin de soutenir une décision éclairée.'),
('Accompagner','Coordonner la documentation, la négociation, la signature et le déboursé, puis demeurer disponible après la transaction.')]
SECT=[('Construction et excavation',['Équipement d’excavation','Équipement de construction']),('Manutention et industriel',['Équipement de manutention','Équipement industriel']),('Médical et technologies',['Équipement médical','Équipement informatique'])]
P=[
 dict(slug='financement-equipements',name='Financement d’équipements',img=('excavatrice-chantier-vue-aerienne','Excavatrice jaune vue du ciel sur un chantier d’excavation',2400,1801),
  title='Financement d’équipements | Versa Capital, cabinet-conseil en financement',
  meta="Financement d'équipements par Versa Capital : crédit-bail, prêt, location-acquisition, refinancement et cession-bail, avec plus de 20 partenaires financiers.",
  lede='Plus de 20 partenaires financiers, des structures flexibles et un processus simplifié pour financer l’équipement de votre entreprise.',
  desc=['Crédit-bail, achat financé, location-exploitation, refinancement, vente avec cession-bail, structures avec valeur résiduelle et stratégies de renouvellement.','Chaque structure est analysée selon le projet, le profil de l’entreprise, les liquidités disponibles, l’horizon de détention des actifs et les objectifs à long terme.'],
  bullets=['Accès à des conditions compétitives grâce à plus de 20 partenaires financiers','Structures flexibles (crédit-bail, prêt, location-acquisition)','Délais rapides et processus simplifié'],sectors=True),
 dict(slug='financement-corporatif-strategique',name='Financement corporatif et stratégique',img=('horizon-urbain-commercial','Horizon urbain et immeubles commerciaux',2400,1600),
  title='Financement corporatif et stratégique | Versa Capital',
  meta="Financement corporatif et stratégique par Versa Capital : hypothécaire commercial, fusions et acquisitions, financement privé et alternatif, optimisation de structure financière.",
  lede='Croissance, acquisition, refinancement ou optimisation : une stratégie de financement alignée sur les ambitions de votre entreprise.',
  desc=['Soutien aux projets de croissance, acquisitions, fonds de roulement, refinancement, consolidation de dettes et optimisation de la structure financière.','Financement hypothécaire commercial : accompagnement pour les projets immobiliers commerciaux et les besoins de financement qui s’inscrivent dans la stratégie globale de l’entreprise.','Fusions, acquisitions et solutions corporatives : conseils pour les décisions structurantes liées à l’achat, à la vente, au transfert ou au développement d’une entreprise.'],
  bullets=['Financement hypothécaire commercial','Fusions et acquisitions (M&amp;A)','Financement privé et alternatif','Optimisation de structure financière'],sectors=False),
 dict(slug='solutions-specialisees',name='Solutions spécialisées',img=('facade-immeuble-moderne','Façade d’un immeuble moderne',2400,1579),
  title='Solutions spécialisées | Versa Capital, cabinet-conseil en financement',
  meta="Solutions spécialisées de Versa Capital : programmes sur mesure pour industries spécifiques et stratégies de liquidité et de croissance.",
  lede='Des programmes sur mesure pour les industries spécifiques et des stratégies de liquidité et de croissance.',
  desc=['Nous considérons plusieurs avenues et structurons des solutions qui correspondent réellement à la situation du client.'],
  bullets=['Programmes sur mesure pour industries spécifiques','Stratégies de liquidité et de croissance'],sectors=True),
 dict(slug='optimisation-cout-capital',name='Optimisation du coût du capital',img=('tours-centre-ville-nuit','Tours du centre-ville illuminées la nuit',2400,1675),
  title='Optimisation du coût du capital | Versa Capital',
  meta="Optimisation du coût du capital par Versa Capital : accompagnement transactionnel, support à l'achat ou à la vente d'équipements, offre intégrée avec Versa Équipements.",
  lede='Accompagnement transactionnel et support lors de l’achat ou de la vente d’équipements, en collaboration avec Versa Équipements.',
  desc=['Nous centralisons la recherche, la comparaison, la négociation et les suivis dans une démarche simple et claire.'],
  bullets=['Accompagnement transactionnel','Support lors de l’achat ou de la vente d’équipements','Collaboration avec Versa Équipements pour une offre intégrée'],sectors=False),
]
def fix_links(x):
    x=x.replace('href="#top"','href="/"')
    return re.sub(r'href="#(services|secteurs|qui)"',r'href="/#\1"',x)
svc_nav=''.join(f'<li><a href="/{p["slug"]}/">{p["name"]}</a></li>' for p in P)
for p in P:
    head=head_tpl
    head=re.sub(r'<title>.*?</title>',f'<title>{p["title"]}</title>',head)
    head=re.sub(r'<meta name="description" content="[^"]*" />',f'<meta name="description" content="{p["meta"]}" />\n  <link rel="canonical" href="{DOMAIN}/{p["slug"]}/" />',head)
    st=p['img'][0]
    head=re.sub(r'<link rel="preload" as="image"[^>]*/>',f'<link rel="preload" as="image" href="%BASE_URL%img/{st}-1400.webp" imagesrcset="%BASE_URL%img/{st}-800.webp 800w, %BASE_URL%img/{st}-1400.webp 1400w, %BASE_URL%img/{st}-2400.webp 2400w" imagesizes="100vw" />',head)
    hero=f'''  <section class="hero hero--page" data-section="dark">
    <div class="hero__media">
      {IMG(st,p["img"][1],p["img"][2],p["img"][3],False).replace('<img ','<img class="hero__img" ')}
      <div class="hero__veil"></div>
      <div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
    </div>
    <div class="hero__grid wrap">
      <div class="hero__copy" data-hero>
        <p class="hero__brand"><a class="hero__crumb" href="/">Versa Capital</a><span class="hero__brand-role">Nos services</span></p>
        <h1 class="hero__title">{p["name"]}</h1>
        <p class="hero__lede">{p["lede"]}</p>
        <div class="hero__ctas">
          <a class="btn" data-magnetic href="#contact"><span class="btn__label" data-text="Demander une soumission">Demander une soumission</span><span class="btn__arrow" aria-hidden="true"></span></a>
          <a class="hero__tel" href="tel:+18335083772"><span class="label label--muted">Appelez-nous</span><span>1-833-508-3772</span></a>
        </div>
      </div>
    </div>
  </section>
'''
    desc=''.join(f'<p class="body">{d}</p>' for d in p['desc'])
    bl=''.join(f'<li>{b}</li>' for b in p['bullets'])
    body=f'''
  <section class="services page-intro" data-section="light">
    <div class="wrap page-grid">
      <div class="fade">
        <div class="sec-head"><p class="label">Le service</p><span class="hair"></span></div>
        <h2 class="services__title">Ce que nous offrons</h2>
        <div class="page-desc">{desc}</div>
      </div>
      <aside class="page-incl fade">
        <h2 class="page-incl__title">Ce qui est inclus</h2>
        <ul class="svc__list">{bl}</ul>
      </aside>
    </div>
  </section>
'''
    if p['sectors']:
        tiles=''.join(f'<article class="sector fade"><div class="sector__body"><h3 class="sector__title">{t}</h3><ul class="sector__list">{"".join(f"<li>{i}</li>" for i in items)}</ul></div></article>' for t,items in SECT)
        body+=f'''
  <section class="sectors" data-section="light">
    <div class="wrap">
      <div class="sec-head"><p class="label">Pour qui</p><span class="hair"></span></div>
      <div class="sectors__intro fade"><h2 class="sectors__title">Secteurs financés</h2><p class="body">Excavation, construction, manutention, industriel, médical ou informatique.</p></div>
      <div class="sectors__grid" data-stagger>{tiles}</div>
    </div>
  </section>
'''
    steps=''.join(f'<li class="step fade"><span class="step__n">{i}</span><h3 class="step__t">{t}</h3><p>{d}</p></li>' for i,(t,d) in enumerate(STEPS,1))
    body+=f'''
  <section class="about steps" data-section="dark">
    <div class="wrap">
      <p class="label label--light">Notre approche</p>
      <h2 class="about__title">Un accompagnement en cinq étapes</h2>
      <ol class="steps__list" data-stagger>{steps}</ol>
    </div>
  </section>

  <section class="stat" data-section="dark">
    <div class="blobs" aria-hidden="true"><i></i><i></i><i></i></div>
    <div class="wrap stat__wrap fade">
      <div class="stat__copy"><p class="stat__num" aria-hidden="true"><span data-count="20">20</span>+</p><p class="stat__text">Plus de 20 partenaires financiers. Un seul point de contact pour comparer et négocier vos options.</p></div>
      <a class="btn" data-magnetic href="#contact"><span class="btn__label" data-text="Parler à un conseiller">Parler à un conseiller</span><span class="btn__arrow" aria-hidden="true"></span></a>
    </div>
  </section>
'''
    rel=''.join(f'<a class="rel fade" href="/{q["slug"]}/"><span class="rel__k">Service</span><span class="rel__n">{q["name"]}</span><span class="svc__arrow" aria-hidden="true"></span></a>' for q in P if q is not p)
    body+=f'''
  <section class="related" data-section="light">
    <div class="wrap">
      <div class="sec-head"><p class="label">Services connexes</p><span class="hair"></span></div>
      <div class="related__grid" data-stagger>{rel}</div>
    </div>
  </section>

'''
    ft=fix_links(footer).replace('<li><a href="/#services">Services</a></li>',svc_nav)
    html=head+'<body>\n\n'+fix_links(header)+'\n\n<main id="top">\n\n'+hero+body+contact+'</main>\n\n'+ft
    os.makedirs(p['slug'],exist_ok=True)
    open(f'{p["slug"]}/index.html','w',encoding='utf-8').write(html)
# Homepage: card links + footer service links
s=H
order=[p['slug'] for p in P]
parts=s.split('<a class="svc__cta" href="#contact">Discuter de ce service')
s=parts[0]+''.join(f'<a class="svc__cta" href="/{order[i]}/">En savoir plus'+parts[i+1] for i in range(len(parts)-1))
for p in P:
    s=s.replace(f'<h2 class="svc__title">{p["name"]}</h2>',f'<h2 class="svc__title"><a href="/{p["slug"]}/">{p["name"]}</a></h2>',1)
if 'link rel="canonical"' not in s:
    s=s.replace('<meta name="theme-color"',f'<link rel="canonical" href="{DOMAIN}/" />\n  <meta name="theme-color"',1)
s=s.replace('<li><a href="#services">Services</a></li>',svc_nav,1)
open('index.html','w',encoding='utf-8').write(s)
print('ok')
