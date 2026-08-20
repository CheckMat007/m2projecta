import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'M2 Projecta',
    short_name: 'M2 Projecta',
    description: 'Painel de gestão (CMS) da M2 Projecta',
    start_url: '/gestor/login',
    scope: '/gestor/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1b4d3e',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}