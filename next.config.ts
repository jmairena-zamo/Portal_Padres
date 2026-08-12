import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Usar remotePatterns (recomendado) en lugar de `domains`
    remotePatterns: [
      {
        protocol: "https",
        hostname: "devempleados.zamorano.edu",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "devempleados.edu",
        port: "",
        pathname: "/**",
      },
    ],
    localPatterns: [
      {
        pathname: "/api/estudiantes/fotoProxy/**",
        // search is omitted, so ?v=123, ?t=456, or no query string are all allowed
      },
    ],
  },
};

export default nextConfig;
