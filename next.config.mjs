import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // Desativa o Service Worker no modo de desenvolvimento para evitar problemas de cache enquanto você programa
  disable: process.env.NODE_ENV === "development", 
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // @react-pdf/renderer é distribuído só como ESM; sem isso o Next tenta tratá-lo como
  // "external" no bundle do servidor e quebra com "ESM packages need to be imported".
  transpilePackages: ['@react-pdf/renderer'],
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

// Envolve a configuração do Next.js com a configuração do PWA
export default withPWA(nextConfig);