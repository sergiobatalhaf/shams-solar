'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Sun } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '/#quem-somos',  label: 'Quem Somos' },
    { href: '/#projetos',    label: 'Projetos' },
    { href: '/#como-funciona', label: 'Como Funciona' },
    { href: '/simulator',   label: 'Simular Proposta', highlight: true },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-shams-dark/95 backdrop-blur-md shadow-lg shadow-black/40' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 shams-gradient rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sun size={18} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-white text-lg tracking-widest">SHAMS</span>
              <span className="text-shams-cyan text-[9px] tracking-[0.2em] font-medium">SOLUÇÕES EM ENERGIA</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={link.highlight
                  ? 'ml-4 btn-primary text-sm py-2'
                  : 'px-4 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/5'}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="ml-2 px-3 py-2 text-xs text-white/40 hover:text-white/70 transition-colors">
              Admin
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white/70 hover:text-white">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-shams-green/20 mt-2 pt-4 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={link.highlight
                  ? 'block btn-primary text-center text-sm py-3 mt-3'
                  : 'block px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
