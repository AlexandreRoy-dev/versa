/*
  Prefixes a public-folder path with the deployment base path.

  Next applies basePath to routes and to its own bundles, but not to
  everything: an unoptimised next/image keeps whatever src it is given, and
  metadata icons are emitted verbatim. On a GitHub Pages project site those
  land at the domain root and 404. On the server build the prefix is empty,
  so this is a no-op.
*/
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!BASE_PATH) return path;
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}
