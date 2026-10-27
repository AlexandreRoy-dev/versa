/* Candidatures : validation locale, puis POST multipart vers Zoho Forms Canada.
   L’URL vient de VITE_RECRUTEMENT_FORM_URL (vide = aucun envoi).
   Voir docs/recrutement-zoho.md. */
const MAX_CV = 5 * 1024 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^(?:\+?1[\s.-]?)?(?:\(?[2-9]\d{2}\)?[\s.-]?)[2-9]\d{2}[\s.-]?\d{4}$/;
const CV_MIME = {
  pdf: ['application/pdf'],
  doc: ['application/msword'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

const MSG = {
  prenom: 'Entrez votre prénom.',
  nom: 'Entrez votre nom.',
  courrielVide: 'Entrez votre courriel.',
  courriel: 'Entrez un courriel valide.',
  telephone: 'Entrez un numéro de téléphone nord-américain, par exemple 514 555-0134.',
  cv: 'Joignez votre CV.',
  cvType: 'Le CV doit être un fichier PDF, DOC ou DOCX.',
  cvVide: 'Le fichier CV est vide.',
  cvTaille: 'Le CV doit faire 5 Mo ou moins.',
  consentement: 'Cochez la case pour consentir à la collecte de vos renseignements.',
  ferme: 'Le dépôt de candidatures sera ouvert sous peu.',
  merci: 'Merci. Nous avons bien reçu votre envoi.',
};

const form = document.querySelector('[data-recrutement]');

function resolveEndpoint(raw) {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) return '';
  let url;
  try {
    url = new URL(value);
  } catch {
    return '';
  }
  const host = url.hostname.toLowerCase();
  const local = host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
  if (local && (url.protocol === 'http:' || url.protocol === 'https:')) return url.toString();
  if (url.protocol === 'https:' && host === 'forms.zohopublic.ca') return url.toString();
  return '';
}

function cvError(file) {
  if (!file) return MSG.cv;
  const parts = file.name.toLowerCase().split('.');
  const ext = parts.length > 1 ? parts.pop() : '';
  if (!CV_MIME[ext]) return MSG.cvType;
  const mime = (file.type || '').toLowerCase();
  if (mime && mime !== 'application/octet-stream' && !CV_MIME[ext].includes(mime)) return MSG.cvType;
  if (file.size === 0) return MSG.cvVide;
  if (file.size > MAX_CV) return MSG.cvTaille;
  return '';
}

function setError(name, message) {
  const input = form.querySelector(`[data-field="${name}"]`);
  const error = form.querySelector(`[data-error="${name}"]`);
  if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (!error) return;
  error.textContent = message || '';
  error.hidden = !message;
}

function clearErrors() {
  ['prenom', 'nom', 'courriel', 'telephone', 'cv', 'consentement'].forEach((name) => setError(name, ''));
  const status = form.querySelector('[data-status]');
  status.hidden = true;
  status.textContent = '';
  delete status.dataset.state;
}

function showStatus(state, message) {
  const status = form.querySelector('[data-status]');
  status.dataset.state = state;
  status.textContent = message;
  status.hidden = false;
  status.tabIndex = -1;
  status.focus();
}

function fieldValue(name) {
  return form.querySelector(`[name="${name}"]`).value.trim();
}

function validate() {
  let first = '';
  const mark = (name, message) => {
    setError(name, message);
    if (message && !first) first = name;
  };

  mark('prenom', fieldValue('Prenom') ? '' : MSG.prenom);
  mark('nom', fieldValue('Nom') ? '' : MSG.nom);

  const courriel = fieldValue('Courriel');
  mark('courriel', !courriel ? MSG.courrielVide : EMAIL.test(courriel) ? '' : MSG.courriel);

  const telephone = fieldValue('Telephone');
  mark('telephone', telephone && !PHONE.test(telephone) ? MSG.telephone : '');

  const file = form.querySelector('[name="CV"]').files[0];
  mark('cv', cvError(file));

  const consent = form.querySelector('[name="ConsentementLoi25"]').checked;
  mark('consentement', consent ? '' : MSG.consentement);

  if (first) form.querySelector(`[data-field="${first}"]`)?.focus();
  return !first;
}

function trimTextFields() {
  form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea').forEach((el) => {
    if (el.hasAttribute('data-honeypot')) return;
    el.value = el.value.trim();
  });
}

if (form) {
  const configured = import.meta.env.VITE_RECRUTEMENT_FORM_URL;
  const endpoint = resolveEndpoint(configured);
  if (typeof configured === 'string' && configured.trim() && !endpoint) {
    console.warn('VITE_RECRUTEMENT_FORM_URL ignorée : seul https://forms.zohopublic.ca ou un hôte local de test est accepté.');
  }
  form.dataset.endpoint = endpoint ? 'pret' : 'ferme';
  form.dataset.script = 'pret';

  window.__soumettreCandidature = (event) => {
    trimTextFields();
    clearErrors();
    if (!validate()) {
      event.preventDefault();
      return false;
    }

    const honeypot = form.querySelector('[data-honeypot]');
    if (honeypot && honeypot.value.trim()) {
      event.preventDefault();
      showStatus('merci', MSG.merci);
      return false;
    }

    if (!endpoint) {
      event.preventDefault();
      showStatus('ferme', MSG.ferme);
      return false;
    }

    if (honeypot) honeypot.disabled = true;
    const referrer = form.querySelector('[name="zf_referrer_name"]');
    if (referrer) referrer.value = document.referrer || '';
    form.action = endpoint;
    return true;
  };
}
