/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Fotos de perfil do Google
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com', // Variação comum do Google
      },
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com', // Logo do Google
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // CORREÇÃO: Uso de curinga (*) para garantir que qualquer bucket da Vercel funcione
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;