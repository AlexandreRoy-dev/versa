import { resolve } from 'path';
const pages = ['financement-equipements', 'financement-corporatif-strategique', 'solutions-specialisees', 'optimisation-cout-capital'];
export default {
  base: '/',
  server: { host: '0.0.0.0', port: 5180, strictPort: true },
  preview: { host: '0.0.0.0', port: 5180 },
  build: {
    rollupOptions: {
      input: Object.fromEntries([['main', resolve(__dirname, 'index.html')], ...pages.map((p) => [p, resolve(__dirname, p, 'index.html')])]),
    },
  },
};
