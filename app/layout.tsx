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
  title: 'Colorir e Aprender - Atividades Educativas para Criancas',
  description: 'Plataforma educativa para criancas de 3 a 10 anos com desenhos para colorir, atividades de alfabetizacao, matematica e ingles. Aprenda brincando!',
  keywords: ['colorir', 'atividades infantis', 'educacao infantil', 'alfabetizacao', 'matematica para criancas', 'ingles para criancas'],
  authors: [{ name: 'Colorir e Aprender' }],
  openGraph: {
    title: 'Colorir e Aprender - Atividades Educativas para Criancas',
    description: 'Plataforma educativa para criancas de 3 a 10 anos com desenhos para colorir, atividades de alfabetizacao, matematica e ingles.',
    type: 'website',
    locale: 'pt_BR',
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
