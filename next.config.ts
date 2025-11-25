import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Désactive les source maps (évite bugs Turbopack sur Windows)
  productionBrowserSourceMaps: false,

  // Configure Turbopack explicitement avec le bon dossier racine
  turbopack: {
    root: __dirname, // Pointe vers le dossier contenant next.config.ts
  },

  async rewrites() {
    return  [
      {
        source: '/api/:path*',
        destination: 'https://irelis-backend.onrender.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

export default nextConfig;


