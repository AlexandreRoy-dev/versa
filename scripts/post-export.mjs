/*
  Fills the two gaps a static export leaves for GitHub Pages.

  1. Pages has no redirects, and `next export` emits nothing for "/" because
     the only routes live under /[locale]. Without this, the bare URL 404s.
  2. Pages runs Jekyll by default, which strips directories beginning with an
     underscore. That would delete _next/ and take every asset with it.
  3. A force push to gh-pages that carries no CNAME clears the custom domain
     configured in the repo settings, so the domain has to live in the build.
*/
import { writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const OUT = "out";
const DEFAULT_LOCALE = "fr";
const basePath = process.env.PAGES_BASE_PATH ?? "";
const cname = process.env.PAGES_CNAME ?? "";
const target = `${basePath}/${DEFAULT_LOCALE}/`;

try {
  await access(OUT);
} catch {
  console.error(`post-export: ${OUT}/ not found. Run the export build first.`);
  process.exit(1);
}

// Redirect immediately, but still render a link so the page is usable if the
// redirect is blocked and readable to anything that does not run scripts.
const html = `<!doctype html>
<html lang="${DEFAULT_LOCALE}">
<head>
<meta charset="utf-8">
<title>Versa Capital</title>
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="canonical" href="${target}">
<script>location.replace(${JSON.stringify(target)});</script>
</head>
<body>
<p>Redirection vers <a href="${target}">Versa Capital</a>…</p>
</body>
</html>
`;

await writeFile(join(OUT, "index.html"), html, "utf8");
await writeFile(join(OUT, ".nojekyll"), "", "utf8");

console.log(`post-export: wrote ${OUT}/index.html -> ${target}`);
console.log(`post-export: wrote ${OUT}/.nojekyll`);

if (cname) {
  await writeFile(join(OUT, "CNAME"), `${cname}\n`, "utf8");
  console.log(`post-export: wrote ${OUT}/CNAME -> ${cname}`);
}
