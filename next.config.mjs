// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Adicione esta propriedade aqui dentro
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;