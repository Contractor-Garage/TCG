/*
  Footer — 4-column dark footer with brand info, nav links, services list, and contact.
  Bottom bar shows copyright and tagline.
*/
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo white />
            <p className="mt-5 text-white/55 text-sm leading-relaxed max-w-xs">
              Large-bay industrial workspace for contractors, tradespeople, and small business owners.
              Built different. Built right.
            </p>
            <p className="mt-4 text-[#CC6633] font-display font-bold uppercase tracking-widest text-xs">
              The Original Since 2008
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-xs text-white/40 mb-5">
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'About Kevin', to: '/about-us' },
                { label: 'Locations', to: '/directory' },
                { label: 'Development Consulting', to: '/development-services' },
                { label: 'Privacy Policy', to: '/privacy-policy' },
                { label: 'Terms of Service', to: '/terms-of-service' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white/65 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-xs text-white/40 mb-5">
              Services
            </h4>
            <ul className="space-y-3 text-white/65 text-sm">
              <li>
                <Link to="/development-services" className="hover:text-white transition-colors">
                  Development Consulting
                </Link>
              </li>
              <li>Brand Subscription</li>
              <li>Online Course</li>
              <li>
                <Link to="/seminar" className="hover:text-white transition-colors">
                  Live 2-Day Seminar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold uppercase tracking-widest text-xs text-white/40 mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-white/65 text-sm">
              <li>Kansas City Metro, KS</li>
              <li>
                <a
                  href="mailto:kcombs@insightcommercial.net"
                  className="hover:text-white transition-colors"
                >
                  kcombs@insightcommercial.net
                </a>
              </li>
              <li>
                <Link
                  to="/development-services"
                  className="text-[#CC6633] hover:text-[#D97A4D] font-semibold transition-colors"
                >
                  Talk to Kevin →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-xs">
            © {new Date().getFullYear()} Contractor Garage™. All rights reserved.
          </p>
          <p className="text-white/35 text-xs font-display font-semibold uppercase tracking-widest">
            The Original Since 2008 · Kansas City, KS
          </p>
        </div>
      </div>
    </footer>
  )
}
