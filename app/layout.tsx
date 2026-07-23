import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'SHAMS Energia Solar — Simulador de Proposta',
  description: 'Simule sua proposta comercial de energia solar fotovoltaica com a SHAMS Soluções em Energia.',
  keywords: 'energia solar, fotovoltaico, proposta comercial, SHAMS, economia energia',
  openGraph: {
    title: 'SHAMS Energia Solar — Simulador de Proposta',
    description: 'Simule sua proposta de energia solar e descubra sua economia.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-shams-black text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
