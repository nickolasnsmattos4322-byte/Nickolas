import type { Metadata, Viewport } from 'next'
import { Baloo_2, Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const baloo = Baloo_2({ 
  subsets: ["latin"],
  variable: '--font-baloo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const nunito = Nunito({ 
  subsets: ["latin"],
  variable: '--font-nunito',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Colorir e Aprender - Atividades Educativas para Crianças',
  description: 'Plataforma educativa para crianças de 3 a 10 anos com desenhos para colorir, atividades de alfabetização, matemática e inglês. Aprenda brincando!',
  keywords: ['colorir', 'atividades infantis', 'educação infantil', 'alfabetização', 'matemática para crianças', 'inglês para crianças'],
  authors: [{ name: 'Colorir e Aprender' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Colorir e Aprender',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Colorir e Aprender - Atividades Educativas para Crianças',
    description: 'Plataforma educativa para crianças de 3 a 10 anos com desenhos para colorir, atividades de alfabetização, matemática e inglês.',
    type: 'website',
    locale: 'pt_BR',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/icons/icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/icons/icon-192x192.jpg', sizes: '192x192', type: 'image/jpeg' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FF6B9D',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className={`${baloo.variable} ${nunito.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
