# Recrutement : brancher Zoho Forms (Canada)

La page `/recrutement/` valide la candidature dans le navigateur, puis envoie un `POST` `multipart/form-data` directement à Zoho Forms. Aucun serveur de Versa ne relaie les données. Tant que l’URL n’est pas configurée, le formulaire s’affiche, valide, et affiche « Le dépôt de candidatures sera ouvert sous peu. » Il n’envoie rien.

## Choix d’intégration

POST HTML vers l’URL `formperma` du centre de données canadien (`https://forms.zohopublic.ca/...`).

C’est le même mécanisme que le fichier Plain HTML de Zoho (Share, Embed, HTML and CSS). Le navigateur parle à `forms.zohopublic.ca`. Les fichiers passent en multipart, sans CORS.

L’iframe et le script d’intégration Zoho ont été écartés. Ils afficheraient le formulaire Zoho, pas celui du site. On ne pourrait pas y garder le texte de consentement Loi 25, le pot de miel, les messages de validation (type et taille du CV) ni le message neutre quand l’URL est vide.

Le code refuse toute adresse qui n’est pas `https://forms.zohopublic.ca/...`. Un hôte local (`localhost`, `127.0.0.1`) est accepté seulement pour les tests. `forms.zohopublic.com` (États-Unis) et les services du type Formspree ou Netlify Forms sont refusés. Rien n’est alors envoyé.

Après un envoi réel, la personne quitte la page et voit la confirmation de Zoho, servie par `forms.zohopublic.ca`. On peut rédiger ce message en français dans Zoho (page de remerciement). La redirection vers un site externe ne fonctionne que sur les forfaits payants, et seulement avec leur HTML. Le champ caché `zf_redirect_url` est laissé vide.

## Ce que Versa doit fournir

1. Un compte Zoho Forms dont le centre de données est le Canada.
2. Un formulaire dont les noms de liens sont exactement ceux du tableau plus bas.
3. L’URL `action` du HTML Zoho, collée dans la variable `VITE_RECRUTEMENT_FORM_URL`.
4. L’avis par courriel, sans le CV en pièce jointe.
5. La double authentification sur chaque accès aux candidatures.
6. La suppression des candidatures après 12 mois.
7. Le texte de la section « Candidatures » collé dans la politique déjà en ligne (voir plus bas). Ce dépôt ne contient pas cette politique.
8. L’accord du propriétaire avant de fusionner la pull request. La fusion vers `main` publie le site.

## Créer le compte au Canada

1. Créer le compte depuis le Canada, ou choisir le Canada à l’inscription. Le centre est choisi selon le pays du compte. Un courriel ne peut pas exister dans deux centres.
2. Une fois connecté, l’adresse doit commencer par `https://forms.zohocloud.ca`. Le compte Zoho est sur `https://accounts.zohocloud.ca`.
3. Le lien public du formulaire doit commencer par `https://forms.zohopublic.ca`. Si vous voyez `forms.zohopublic.com`, le compte est aux États-Unis. Ne l’utilisez pas pour ce formulaire.
4. Si Zoho dit que le courriel existe déjà ailleurs, il faut un autre courriel, ou fermer l’autre compte avant de recréer celui du Canada.

## Créer le formulaire

Nom suggéré : Candidature. La langue du formulaire : français.

Pour chaque champ, ouvrir les propriétés et régler **Field link name** avant de recevoir des réponses. Le nom est sensible à la casse. Ne pas laisser `SingleLine` ou `SingleLine1`.

| Libellé affiché dans Zoho | Type Zoho | Nom de lien (`name`) | Requis | Notes |
| --- | --- | --- | --- | --- |
| Prénom | Single Line | `Prenom` | oui | |
| Nom | Single Line | `Nom` | oui | |
| Courriel | Email | `Courriel` | oui | |
| Téléphone | Single Line | `Telephone` | non | Ne pas utiliser le type Phone. Ce type ajoute souvent un sous-champ de pays (`Telephone_countrycode`) et le POST du site ne le remplit pas. |
| Poste visé | Single Line | `PosteVise` | non | Vide = candidature spontanée. Le site n’invente pas de poste. |
| Message | Multi Line | `Message` | non | |
| CV | File Upload | `CV` | oui | Voir les limites plus bas. |
| Consentement | Decision Box | `ConsentementLoi25` | oui | Valeur envoyée quand la case est cochée : `ConsentementLoi25`. |

Champs cachés déjà envoyés par le site, à ne pas recréer dans Zoho :

| `name` | Contenu |
| --- | --- |
| `zf_referrer_name` | Page d’origine, comme dans le HTML Zoho. |
| `zf_redirect_url` | Vide. |

Le pot de miel s’appelle `champ_piege` dans la page. Il est retiré avant l’envoi. Ne le créez pas dans Zoho.

### CV

Dans le champ File Upload :

- formats autorisés : `pdf`, `doc`, `docx`
- nombre de fichiers : 1
- taille maximale : 5 Mo
- champ obligatoire

Le site refuse, avant l’envoi, un fichier qui dépasse 5 × 1024 × 1024 octets (5 242 880). Le message est « Le CV doit faire 5 Mo ou moins. » Un mauvais type produit « Le CV doit être un fichier PDF, DOC ou DOCX. »

### Case de consentement

Decision Box, obligatoire, nom de lien `ConsentementLoi25`.

Le site envoie `ConsentementLoi25=ConsentementLoi25` lorsque la case est cochée. Elle ne l’est pas par défaut.

Après avoir enregistré le formulaire : Share, Embed, HTML and CSS, Generate Code, Download Plain HTML. Ouvrez le fichier et comparez :

- l’attribut `action` du `form` (c’est l’URL à copier)
- chaque attribut `name`
- l’attribut `value` de la case

Si Zoho a mis une autre valeur que `ConsentementLoi25` sur la case, remplacez seulement `value` dans `recrutement/index.html` par celle du HTML téléchargé. Ne changez pas le `name`.

### Ce qu’il ne faut pas activer

- CAPTCHA ou reCAPTCHA. Zoho indique que le captcha n’est pas pris en charge dans le HTML embarqué. Un captcha obligatoire peut refuser le POST.
- Le blocage des envois faits avec le code HTML. Dans les réglages de restriction des envois, l’option qui accepte le HTML doit rester active. L’aide Zoho dit que la désactiver bloque ces envois.
- Un champ Phone à la place de Single Line pour le téléphone.
- Une liste de postes. Le champ reste un texte libre.

## Avis par courriel, sans le CV

Settings, Email and Notifications, Email, onglet New Record, Configure.

- To : l’adresse choisie par Versa. Le site publie déjà `info@versacapital.ca`.
- Message : insérer le résumé du formulaire (Non-empty Fields, ou All Fields).
- **Field Upload Attachments : ne rien ajouter.** C’est cette section qui joint les fichiers téléversés. Sans elle, le CV n’est pas en pièce jointe. Il reste dans Zoho Forms (All Entries), visible par les personnes autorisées.
- Ne pas ajouter non plus le CV dans les autres pièces jointes.

Le forfait gratuit de Zoho n’envoie de toute façon pas les fichiers joints. Laissez quand même la section vide, pour qu’un changement de forfait ne se mette pas à envoyer les CV.

## Double authentification

Ce n’est pas un double opt-in envoyé au candidat.

1. Aller sur `https://accounts.zohocloud.ca`, Security, et activer l’authentification multifacteur.
2. L’activer pour chaque personne qui peut ouvrir les candidatures.
3. Ne partager le compte qu’avec les personnes autorisées de Versa Capital. Les réponses du formulaire ne sont pas publiques. Seul le lien d’envoi l’est.

## Suppression à 12 mois

Le texte affiché au candidat dit que les renseignements sont conservés 12 mois, puis détruits.

Réglage Zoho : Settings, Submissions and Storage, Auto-Trash.

- Offert sur les forfaits Premium et Zoho One Enterprise.
- Choisir l’intervalle le jour où le formulaire ouvre. L’aide Zoho précise que les réponses déjà reçues avant l’activation ne sont pas effacées toutes seules, et que le premier passage garde une marge (leur exemple : un intervalle de 7 jours, premier effacement au 15e jour).
- Après le passage, la réponse reste 5 jours dans la corbeille et peut être restaurée. Elle est ensuite supprimée pour de bon. Vider la corbeille et ne pas restaurer.
- Zoho indique par ailleurs que des données supprimées peuvent rester dans des copies de sauvegarde jusqu’à environ 3 mois. En tenir compte si le libellé public doit être revu avec un conseiller.

Sans forfait Premium, l’auto-trash n’existe pas. Prévoir alors, chaque mois, la suppression manuelle des candidatures de plus de 12 mois, puis vider la corbeille. Le mettre au calendrier. L’engagement de 12 mois reste à la charge de Versa.

Ne pas recopier les CV vers un outil hébergé hors Canada.

## Où mettre l’URL

La variable s’appelle `VITE_RECRUTEMENT_FORM_URL`.

Valeur : l’attribut `action` du Plain HTML, de la forme

`https://forms.zohopublic.ca/PORTAIL/form/LIEN/formperma/JETON`

Sans espace, sans guillemet. Pas l’adresse du site Versa. Pas une URL `forms.zohopublic.com`.

### En local

Créer `.env.local` à la racine (fichier ignoré par git) :

```bash
VITE_RECRUTEMENT_FORM_URL=https://forms.zohopublic.ca/PORTAIL/form/LIEN/formperma/JETON
```

Puis `npm run build`. Vite fige la valeur dans le JavaScript. Un simple rafraîchissement sans rebuild ne suffit pas.

Sans le fichier, ou avec une valeur vide, le message neutre s’affiche et rien n’est envoyé.

### GitHub Actions

Le workflow `.github/workflows/pages.yml` ne part que sur un push vers `main`. Le job a en plus la condition `github.ref == 'refs/heads/main'`. Une pull request, ou un lancement manuel depuis une autre branche, ne publie pas `gh-pages`.

Le build reçoit la variable de dépôt :

```yaml
env:
  VITE_RECRUTEMENT_FORM_URL: ${{ vars.VITE_RECRUTEMENT_FORM_URL }}
```

Pour la définir : dépôt GitHub, Settings, Secrets and variables, Actions, onglet Variables, New repository variable.

- Name : `VITE_RECRUTEMENT_FORM_URL`
- Value : l’URL `formperma`

Ce n’est pas un secret : le site construit la contient, puisque le navigateur doit l’utiliser. Ne pas inventer de valeur. Tant que la variable n’existe pas, le build de production laisse le dépôt fermé.

Après avoir enregistré la variable, il faut un nouveau build sur `main` (un commit sur `main`, ou un lancement manuel du workflow depuis `main`) pour que le site en ligne envoie vraiment les candidatures.

## Texte à coller dans la politique (hors de ce dépôt)

Ce site n’a pas de page de politique. Le pied de page pointe vers `https://versacapital.ca/politique-de-confidentialite/`, un site WordPress qui n’est pas dans ce dépôt. La section ci-dessous n’est donc pas publiée. Elle est prête à coller dans cette politique, sous le titre « Candidatures ».

La politique actuelle nomme Frédéric Parent, `fparent@capital.ca`, 101-110 rue de Singapour, Saint-Augustin-de-Desmaures (Québec) G3A 0P5. Le formulaire de ce site, comme le reste des pages, utilise `info@versacapital.ca`. À confirmer : quelle boîte reçoit les demandes d’accès, de rectification et de retrait.

```text
Candidatures

Versa Capital recueille des candidatures spontanées au moyen du formulaire Recrutement, afin d’évaluer la candidature et de l’ajouter à une banque de candidatures.

Renseignements recueillis : prénom, nom, courriel, numéro de téléphone si la personne le fournit, poste visé si elle le fournit, message si elle le fournit, et curriculum vitae (PDF, DOC ou DOCX).

Ces renseignements sont hébergés au Canada, dans Zoho Forms (centre de données canadien). Seules les personnes autorisées de Versa Capital y ont accès.

Ils sont conservés 12 mois, puis détruits.

La personne peut demander l’accès, la rectification ou le retrait de ses renseignements en écrivant à info@versacapital.ca. Elle peut aussi écrire au responsable de la protection des renseignements personnels nommé dans la présente politique.
```

## Vérifier

```bash
npm run test:e2e
```

Le script construit le site sans URL, lance l’aperçu, exécute Playwright (ordinateur et téléphone), puis reconstruit avec un petit serveur local et vérifie que le POST multipart contient les champs et le CV.
