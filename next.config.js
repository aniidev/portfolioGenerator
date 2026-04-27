/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent webpack from bundling packages with native binaries or ESM-only internals
      config.externals.push('@xenova/transformers', 'onnxruntime-node', 'sharp');
    }
    return config;
  },
};

module.exports = nextConfig;
