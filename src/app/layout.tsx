import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Crescent Moon Cocker Spaniels | Premium Breeder',
    template: '%s | Crescent Moon Cocker Spaniels'
  },
  description: 'Top-quality Cocker Spaniel puppies for sale. Healthy, home-raised, and socialized spaniels from champion bloodlines. Join the Crescent Moon family today!',
  keywords: ['Cocker Spaniel', 'Spaniel Puppies', 'English Cocker Spaniel', 'Dog Breeder', 'Puppies for sale', 'Crescent Moon'],
  authors: [{ name: 'Crescent Moon Spaniels' }],
  creator: 'Crescent Moon Spaniels',
  publisher: 'Crescent Moon Spaniels',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://oncocker.netlify.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Crescent Moon Cocker Spaniels | Premium Breeder',
    description: 'Top-quality Cocker Spaniel puppies for sale. Healthy, home-raised, and socialized spaniels from champion bloodlines.',
    url: 'https://oncocker.netlify.app',
    siteName: 'Crescent Moon Cocker Spaniels',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Crescent Moon Cocker Spaniels Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crescent Moon Cocker Spaniels | Premium Breeder',
    description: 'Top-quality Cocker Spaniel puppies for sale. Healthy, home-raised, and socialized spaniels from champion bloodlines.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
