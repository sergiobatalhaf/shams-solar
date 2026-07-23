import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SHAMS Energia Solar",
  description: "Soluções em energia solar fotovoltaica",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className} style={{ background: "#060D06", color: "#fff", minHeight: "100vh" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(6,13,6,.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(46,125,50,.2)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#00ACC1,#4CAF50)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", fontSize: 14 }}>S</div>
              <div>
                <div style={{ fontWeight: 900, letterSpacing: 3, fontSize: 16, color: "#fff" }}>SHAMS</div>
                <div style={{ fontSize: 7, color: "#00ACC1", letterSpacing: 2 }}>SOLUÇÕES EM ENERGIA</div>
              </div>
            </a>
            <a href="/simulator"><button style={{ background: "#4CAF50", color: "#060D06", padding: "8px 20px", borderRadius: 8, fontWeight: 700, border: "none", cursor: "pointer", fontSize: 13 }}>Simular Projeto</button></a>
          </div>
        </header>
        <main>{children}</main>
        <footer style={{ background: "#0D1A0D", borderTop: "1px solid rgba(46,125,50,.2)", padding: "40px 24px", textAlign: "center" }}>
          <div style={{ fontWeight: 900, letterSpacing: 3, marginBottom: 12 }}>SHAMS ENERGIA SOLAR</div>
          <div style={{ color: "rgba(255,255,255,.4)", fontSize: 13 }}>(41) 99665-9223 · comercial@shamsolar.net · www.shamsenergia.com.br</div>
          <div style={{ color: "rgba(255,255,255,.2)", fontSize: 11, marginTop: 8 }}>© 2025 SHAMS Energia Solar</div>
        </footer>
      </body>
    </html>
  )
}
