import { resolve } from 'path';
const pages = [
  ['financement-equipements', 'financement-equipements'],
  ['financement-corporatif-strategique', 'financement-corporatif-strategique'],
  ['credit-bail', 'credit-bail'],
  ['financement-machinerie-lourde', 'financement-machinerie-lourde'],
  ['financement-camions-remorques', 'financement-camions-remorques'],
  ['financement-equipements-agricoles', 'financement-equipements-agricoles'],
  ['refinancement-equipements', 'refinancement-equipements'],
  ['fonds-de-roulement', 'fonds-de-roulement'],
  ['carrieres', 'carrieres'],
  ['en', 'en'],
  ['en-equipment-financing', 'en/equipment-financing'],
  ['en-corporate-strategic-financing', 'en/corporate-strategic-financing'],
  ['en-leasing', 'en/leasing'],
  ['en-careers', 'en/careers'],
  ['en-heavy-machinery-financing', 'en/heavy-machinery-financing'],
  ['en-trucks-trailers-financing', 'en/trucks-trailers-financing'],
  ['en-agricultural-equipment-financing', 'en/agricultural-equipment-financing'],
  ['en-equipment-refinancing', 'en/equipment-refinancing'],
  ['en-working-capital', 'en/working-capital'],
];
export default {
  base: '/',
  server: { host: '0.0.0.0', port: 5180, strictPort: true },
  preview: { host: '0.0.0.0', port: 5180 },
  build: {
    rollupOptions: {
      input: Object.fromEntries([['main', resolve(__dirname, 'index.html')], ...pages.map(([name, dir]) => [name, resolve(__dirname, dir, 'index.html')])]),
    },
  },
};
