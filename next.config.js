/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: '.next',
  swcMinify: true,
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },
  experimental: {
    turbo: {
      loaders: {}, // ✅ Required structure
    },
    // other experimental settings
    optimisticClientCache: true,
    serverMinification: true,
    gzipSize: true,
    esmExternals: true,
    fetchCacheKeyPrefix: '',
    middlewarePrefetch: 'flexible',
    clientRouterFilter: true,
    largePageDataBytes: 128000,
    cpus: 15,
  },
};

module.exports = nextConfig;
