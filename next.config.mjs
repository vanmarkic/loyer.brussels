import createNextIntlPlugin from "next-intl/plugin"; // Import the plugin

const withNextIntl = createNextIntlPlugin(
  // Provide the path to your i18n configuration file that exports the default config
  // Relative to the root of your project
  "./app/i18n/request.ts"
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
  // Fix multiple lockfiles warning
  outputFileTracingRoot: process.cwd(),
  // Turbopack configuration for Next.js 15
  turbopack: {
    // Custom module resolution
    resolveAlias: {
      '@': './',
      '@/components': './components',
      '@/app': './app',
      '@/features': './app/features',
    },
  },
};

// Wrap your config with the plugin
export default withNextIntl(nextConfig);
