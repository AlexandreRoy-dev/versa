import type { NextConfig } from "next";

/*
  Two build targets.

  Default is `standalone`, for the VPS behind nginx. It keeps the lead API
  route working and lets Next optimise images at request time.

  STATIC_EXPORT=1 produces a plain folder of files for GitHub Pages. Pages has
  no server, so that target drops the API route, turns off image optimisation,
  and cannot use redirects. scripts/post-export.mjs fills those last gaps.
*/
const isStaticExport = process.env.STATIC_EXPORT === "1";

// A project page is served from https://<user>.github.io/<repo>, so every
// asset and link needs that prefix. A user/custom-domain page needs none.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      basePath: basePath || undefined,
      // Pages serves /about as /about/index.html, so emit directories.
      trailingSlash: true,
      images: { unoptimized: true },
      env: {
        // Lets the lead form know there is no API to post to.
        NEXT_PUBLIC_STATIC_EXPORT: "1",
        /*
          Next does not prefix everything with basePath. Unoptimised
          next/image keeps the raw src, and metadata icons are never
          rewritten, so those call asset() with this value instead.
        */
        NEXT_PUBLIC_BASE_PATH: basePath,
      },
    }
  : {
      output: "standalone",
      env: { NEXT_PUBLIC_STATIC_EXPORT: "", NEXT_PUBLIC_BASE_PATH: "" },
      async redirects() {
        return [
          // French is the primary market, so the bare domain lands on /fr.
          { source: "/", destination: "/fr", permanent: false },
        ];
      },
    };

export default nextConfig;
