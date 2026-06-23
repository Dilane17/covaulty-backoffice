import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Covaulty Backoffice',
    short_name: 'Covaulty',
    description: 'SaaS de supervision de la collecte journalière d\'épargne',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f4f3',
    theme_color: '#255c99',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
