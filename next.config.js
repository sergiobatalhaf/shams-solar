/** @type {import('next').NextConfig} */
const nextConfig = {
  // @react-pdf/renderer needs to be bundled for client use
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'canvas', 'jsdom']
    }
    return config
  },
  images: {
    domains: [],
  },
}

module.exports = nextConfig
