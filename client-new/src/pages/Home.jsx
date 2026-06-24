/*
  Home — landing page.
  Sections: Hero → What Is It (split) → Who It's For → Why It Works (6-card grid) → Developer CTA.

  The "Why It Works" grid uses a gap-px pattern: the parent has a light gray background
  and children have white backgrounds — the gray shows through as 1px separators.
  AnimateOnScroll wrappers inside the grid need className="h-full" or cards won't fill
  their cells and gray will bleed above/below.
*/
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useMetaTags from '../hooks/useMetaTags'
import heroImage from '../assets/hero.jpg'
import locationImage from '../assets/location.jpg'

const tenantTypes = [
  'General Contractors',
  'Plumbers, Electricians & HVAC',
  'Landscapers & Irrigation',
  'Mobile Service Businesses',
  'Hobbyists & Car Collectors',
  'E-Commerce & Light Storage',
  'Entrepreneurs & Start-Ups',
  'Restoration & Detailing',
]

const whyCards = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h16v4M4 16v4h16v-4M4 12h16" />
      </svg>
    ),
    title: 'Right-Sized Units',
    body: '750–1,500 SF bays match exactly what small trade businesses actually need — not a cramped storage unit, not an oversized flex suite.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Affordable Rents',
    body: 'Below market flex rates mean tenants stay for years. Simpler and less expensive than flex space — you get what your business actually needs, nothing more.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
      </svg>
    ),
    title: 'Drive-In Access',
    body: 'Easily maneuverable lots with large overhead doors let you pull a full truck and trailer straight in. No tight turns, no wasted time.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Lights & Power',
    body: 'Every bay comes with real lighting and electric service. Show up, plug in, and get to work — not a dark padlocked storage unit.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Built for the Trades',
    body: 'Insulated bays and heavier-duty construction mean you work comfortably year-round — purpose-built for the trades, not converted from something else.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    title: 'Skip the Overhead',
    body: 'No storefront requirements, no office buildout, no unnecessary square footage. Functional workspace at the right price — nothing more, nothing less.',
  },
]

export default function Home() {
  useMetaTags({
    description: 'Large-bay industrial workspace for contractors, tradespeople, and small business owners. The original since 2008, Kansas City.',
  })
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-black/40" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-40 w-full">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-sm mb-5"
          >
            The Original Since 2008
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black text-white uppercase leading-none text-[clamp(3.5rem,10vw,7.5rem)] mb-7"
          >
            Space Built<br />for the<br />Trades
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/75 text-lg lg:text-xl max-w-xl mb-10 leading-relaxed"
          >
            Large-bay industrial workspace for contractors, tradespeople, and small
            businesses. Better than mini storage. Less overhead than flex. The right
            fit — finally.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              to="/directory"
              className="inline-block font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white px-8 py-3.5 hover:bg-[#A85228] transition-colors"
            >
              Find a Location
            </Link>
            <Link
              to="/development-services"
              className="inline-block font-display font-bold uppercase tracking-wider text-sm border-2 border-white text-white px-8 py-3.5 hover:bg-white hover:text-[#1A1A1A] transition-colors"
            >
              Developer Consulting →
            </Link>
          </motion.div>
        </div>

        {/* Stats bottom-right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="absolute bottom-10 right-8 lg:right-12 hidden lg:flex items-end gap-8"
        >
          {[
            { value: '10+', label: 'Projects' },
            { value: '15+', label: 'Years' },
            { value: '~1,000', label: 'Sq Ft / Unit' },
          ].map(({ value, label }) => (
            <div key={label} className="text-right">
              <div className="font-display font-black text-[#CC6633] text-4xl leading-none">{value}</div>
              <div className="text-white/50 text-xs uppercase tracking-widest mt-1 font-display font-semibold">{label}</div>
            </div>
          ))}
          <div className="w-px h-10 bg-white/20 self-center ml-2" />
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
          />
        </div>
      </section>

      {/* ── WHAT IS IT ────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2">
            {/* Left: copy */}
            <div className="px-8 lg:px-16 py-20 lg:py-28 flex flex-col justify-center">
              <AnimateOnScroll>
                <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                  The Concept
                </p>
                <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-5xl lg:text-6xl mb-8">
                  Something Better<br />Than Storage.<br />
                  <span className="text-[#CC6633]">Less Overhead<br />Than Flex.</span>
                </h2>
              </AnimateOnScroll>
              <AnimateOnScroll delay={0.1}>
                <p className="text-[#1A1A1A]/70 text-base lg:text-lg leading-relaxed mb-6">
                  Contractor Garage™ bridges the gap between basic storage and expensive
                  flex space — and it's been overlooked for decades. Storage gives you a
                  dark padlocked box. Flex space loads you down with office buildout,
                  storefronts, and overhead you never needed.
                </p>
                <p className="text-[#1A1A1A]/70 text-base lg:text-lg leading-relaxed mb-10">
                  What it is: insulated 750–1,500 SF bays with real lighting, electric
                  service, and a large maneuverable lot to pull a truck and trailer
                  straight in. Heavier-duty construction built for the trades. Simpler
                  and less expensive than flex space. Far more functional than storage.
                </p>
                <Link
                  to="/about-us"
                  className="inline-block font-display font-bold uppercase tracking-wider text-sm text-[#CC6633] border-b-2 border-[#CC6633] pb-0.5 hover:text-[#A85228] hover:border-[#A85228] transition-colors"
                >
                  About the Founder →
                </Link>
              </AnimateOnScroll>
            </div>

            {/* Right: photo */}
            <div
              className="min-h-80 lg:min-h-0 bg-gray-700"
              style={{
                backgroundImage: `url(${locationImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
              Tenant Profile
            </p>
            <h2 className="font-display font-black text-white uppercase leading-none text-5xl lg:text-6xl mb-14">
              Who It's For
            </h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tenantTypes.map((type, i) => (
              <AnimateOnScroll key={type} delay={i * 0.05}>
                <div className="flex items-start gap-3 group">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#CC6633]/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#CC6633]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/80 font-body font-medium text-sm leading-snug group-hover:text-white transition-colors">
                    {type}
                  </span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT WORKS ─────────────────────────────────────── */}
      <section className="bg-[#F7F6F4] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
              The Investment Case
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-5xl lg:text-6xl mb-14">
              Why It Works
            </h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1A1A1A]/10">
            {whyCards.map(({ icon, title, body }, i) => (
              <AnimateOnScroll key={title} delay={i * 0.07} className="h-full">
                <div className="h-full bg-white p-8 lg:p-10 group hover:bg-[#1A1A1A] transition-colors duration-300">
                  <div className="text-[#CC6633] mb-5">{icon}</div>
                  <h3 className="font-display font-black uppercase text-xl text-[#1A1A1A] group-hover:text-white mb-3 transition-colors">
                    {title}
                  </h3>
                  <p className="text-[#1A1A1A]/60 group-hover:text-white/60 text-sm leading-relaxed transition-colors">
                    {body}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER CTA BAND ───────────────────────────────── */}
      <section className="bg-[#CC6633] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <p className="font-display font-bold uppercase tracking-[0.2em] text-white/60 text-xs mb-3">
                  For Developers &amp; Investors
                </p>
                <h2 className="font-display font-black text-white uppercase leading-tight text-4xl lg:text-5xl">
                  Are You a Developer?<br />Build One in Your Market.
                </h2>
              </div>
              <Link
                to="/development-services"
                className="flex-shrink-0 inline-block font-display font-bold uppercase tracking-wider text-sm bg-white text-[#CC6633] px-10 py-4 hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                See How It Works →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
