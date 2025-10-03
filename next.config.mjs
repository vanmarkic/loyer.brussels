import createNextIntlPlugin from "next-intl/plugin"; // Import the plugin

const withNextIntl = createNextIntlPlugin(
  // Provide the path to your i18n configuration file that exports the default config
  // Relative to the root of your project
  "./src/i18n/request.ts"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing Next.js config options here
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Turbopack configuration for Next.js 15
  turbopack: {
    // Custom module resolution
    resolveAlias: {
      '@': './src',
      '@/components': './components', 
      '@/app': './app',
      '@/lib': './lib',
    },
  },
};

// Wrap your config with the plugin
export default withNextIntl(nextConfig);
