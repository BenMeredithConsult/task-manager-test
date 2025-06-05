import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.google.com', 'fr.wikipedia.org', 'usualcom.net'], // Ajoute les domaines que tu veux autoriser
  },
};

export default nextConfig;
