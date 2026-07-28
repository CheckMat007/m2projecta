import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'M2 Projecta',
    short_name: 'M2 Projecta',
    description: 'Site e CMS da M2 Projecta',
    start_url: '/gestor/login',
    display: 'standalone', 
    background_color: '#ffffff',
    theme_color: '#1b4d3e', 
    icons: [
      {
        src: '/apple-icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}