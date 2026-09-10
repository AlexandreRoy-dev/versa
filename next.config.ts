import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
    Standalone keeps the lead API route working behind nginx on the VPS. A
    static export would drop it and break the quote form, which is one of the
    things we want to demo.
  */
  output: "standalone",
  async redirects() {
    return [
      // French is the primary market, so the bare domain lands on /fr.
      { source: "/", destination: "/fr", permanent: false },
    ];
  },
};

export default nextConfig;
