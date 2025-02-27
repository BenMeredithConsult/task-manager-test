import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, // Enables React's strict mode for catching potential issues
    env: {
      AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY,
      AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID,
    },
    webpack(config) {
      config.resolve.fallback = { fs: false, path: false }; // Fixes issues with server-side modules
      return config;
    },
    
};

export default nextConfig;
