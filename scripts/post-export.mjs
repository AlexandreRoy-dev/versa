/*
  Fills the two gaps a static export leaves for GitHub Pages.

  1. Pages has no redirects, and `next export` emits nothing for "/" because
     the only routes live under /[locale]. Without this, the bare URL 404s.
  2. Pages runs Jekyll by default, which strips directories beginning with an
     underscore. That would delete _next/ and take every asset with it.
  3. A force push to gh-pages that carries no CNAME clears the custom domain
     configured in the repo settings, so the domain has to live in the build.
  4. The site was first published under /versa, before the custom domain moved
     it to the root. Those URLs are still in browser caches, history and
     autocomplete, so the 404 page rescues them instead of dead-ending.
*/
import { writeFile, readFile, access } from "node:fs/promises";
import { join } from "node:path";

const OUT = "out";
const DEFAULT_LOCALE = "fr";
const basePath = process.env.PAGES_BASE_PATH ?? "";
const cname = process.env.PAGES_CNAME ?? "";
const target = `${basePath}/${DEFAULT_LOCALE}/`;

// Prefixes this site used to be served under, minus the one in use now.
// Every rescue strictly shortens the path, so repeated hops terminate.
const retiredPrefixes = ["/versa"].filter((p) => p !== basePath);

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

// Pages serves 404.html for every unknown path, which makes it the one place
// that can catch a retired URL whatever its depth.
if (retiredPrefixes.length > 0) {
  const notFound = join(OUT, "404.html");
  const rescue = `<script>(function(){var p=${JSON.stringify(retiredPrefixes)},l=location;for(var i=0;i<p.length;i++){if(l.pathname===p[i]||l.pathname.indexOf(p[i]+"/")===0){var d=l.pathname.slice(p[i].length)||"/";l.replace(d+l.search+l.hash);return}}})();</script>`;

  try {
    const original = await readFile(notFound, "utf8");
    await writeFile(notFound, original.replace("<head>", `<head>${rescue}`), "utf8");
    console.log(`post-export: 404.html rescues ${retiredPrefixes.join(", ")}`);
  } catch {
    console.error("post-export: no 404.html to patch, retired URLs will dead-end.");
    process.exit(1);
  }
}
