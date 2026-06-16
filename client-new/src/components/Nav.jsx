/*
  Nav — sticky top navigation bar.
  - Transparent when at the top of the page (over hero images); dark when scrolled.
  - Active route is highlighted in orange (#CC6633).
  - "Development Consulting" always renders as an orange bordered CTA button.
  - Mobile: animated hamburger menu that collapses to a full-width drawer.
  - Logo always renders in white (white prop) since the nav is always on a dark background.
*/
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const links = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about-us' },
  { label: 'Locations', to: '/directory' },
  { label: 'Development Consulting', to: '/development-services', cta: true },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1A1A1A]/95 backdrop-blur-sm shadow-xl shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <Logo white />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map(({ label, to, cta }) => {
              const active = isActive(to)
              if (cta) {
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`ml-3 font-display font-bold uppercase tracking-wider text-sm px-5 py-2 border transition-all duration-200 ${
                      active
                        ? 'bg-[#CC6633] border-[#CC6633] text-white'
                        : 'border-[#CC6633] text-[#CC6633] hover:bg-[#CC6633] hover:text-white'
                    }`}
                  >
                    {label}
                  </Link>
                )
              }
              return (
                <Link
                  key={to}
                  to={to}
                  className={`font-display font-semibold uppercase tracking-wider text-sm px-4 py-2 transition-colors duration-200 ${
                    active
                      ? 'text-[#CC6633]'
                      : 'text-white/85 hover:text-white'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-6 bg-white transition-transform duration-200 ${
                mobileOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-opacity duration-200 ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-transform duration-200 ${
                mobileOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-[#1A1A1A] border-t border-white/10 overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col py-4 px-6 gap-1">
          {links.map(({ label, to, cta }) => (
            <Link
              key={to}
              to={to}
              className={`font-display font-bold uppercase tracking-wider text-base py-3 border-b border-white/10 last:border-0 ${
                cta
                  ? 'text-[#CC6633]'
                  : isActive(to)
                  ? 'text-[#CC6633]'
                  : 'text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
