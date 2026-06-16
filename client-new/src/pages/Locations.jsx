/*
  Locations — full list of all Contractor Garage™ locations with availability status.
  Sections: Hero → Availability banner → Location table (desktop) / cards (mobile) → Developer CTA.

  Location data is imported from src/data/locations.js (shared with LocationDetail).
  Each row/card links to /location/:slug.

  TODO: integrate a Leaflet map showing pin locations (lat/lng not yet in the data array).
*/
import { Link } from 'react-router-dom'
import AnimateOnScroll from '../components/AnimateOnScroll'
import locationImage from '../assets/location.jpg'
import { locations } from '../data/locations'

const statusConfig = {
  Available: {
    label: 'Available',
    dot: 'bg-green-500',
    badge: 'bg-green-500/15 text-green-600 border border-green-500/30',
  },
  'Coming Soon': {
    label: 'Coming Soon',
    dot: 'bg-[#CC6633]',
    badge: 'bg-[#CC6633]/15 text-[#CC6633] border border-[#CC6633]/30',
  },
  Full: {
    label: 'Full',
    dot: 'bg-gray-400',
    badge: 'bg-gray-100 text-gray-500 border border-gray-200',
  },
}

export default function Locations() {
  const available = locations.filter((l) => l.status === 'Available')

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative pt-40 pb-24"
        style={{
          backgroundImage: `url(${locationImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#1A1A1A]/80" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-xs mb-4">
              KC Metro &amp; Beyond
            </p>
            <h1 className="font-display font-black text-white uppercase leading-none text-[clamp(3rem,8vw,6.5rem)]">
              Our Locations
            </h1>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── AVAILABILITY BANNER ──────────────────────────────── */}
      <div className="bg-[#CC6633] py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse flex-shrink-0" />
            <p className="font-display font-bold uppercase tracking-widest text-white text-sm">
              Several locations currently have units available
            </p>
          </div>
          <p className="text-white/75 font-display font-semibold uppercase tracking-wider text-xs">
            {available.length} locations open now
          </p>
        </div>
      </div>

      {/* ── LOCATION LIST ────────────────────────────────────── */}
      <section className="bg-[#F7F6F4] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-4xl lg:text-5xl mb-4">
              All Locations
            </h2>
            <p className="text-[#1A1A1A]/55 text-sm mb-14 font-display font-semibold uppercase tracking-widest">
              {locations.length} Total · {available.length} Available
            </p>
          </AnimateOnScroll>

          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="bg-white border border-[#1A1A1A]/10 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-12 bg-[#1A1A1A] px-8 py-4">
                <div className="col-span-3 font-display font-bold uppercase tracking-widest text-white/50 text-xs">
                  Location
                </div>
                <div className="col-span-5 font-display font-bold uppercase tracking-widest text-white/50 text-xs">
                  Address
                </div>
                <div className="col-span-2 font-display font-bold uppercase tracking-widest text-white/50 text-xs">
                  City
                </div>
                <div className="col-span-2 font-display font-bold uppercase tracking-widest text-white/50 text-xs text-right">
                  Status
                </div>
              </div>
              {/* Rows */}
              {locations.map(({ slug, name, address, city, state, status }, i) => {
                const cfg = statusConfig[status]
                return (
                  <AnimateOnScroll key={slug} delay={i * 0.03}>
                    <Link
                      to={`/location/${slug}`}
                      className={`grid grid-cols-12 px-8 py-5 border-t border-[#1A1A1A]/8 hover:bg-[#F7F6F4] transition-colors group ${
                        status === 'Available' ? 'bg-green-50/40' : ''
                      }`}
                    >
                      <div className="col-span-3 font-display font-bold text-[#1A1A1A] text-sm uppercase tracking-wide group-hover:text-[#CC6633] transition-colors">
                        {name}
                      </div>
                      <div className="col-span-5 text-[#1A1A1A]/65 text-sm font-body">
                        {address}
                      </div>
                      <div className="col-span-2 text-[#1A1A1A]/65 text-sm font-body">
                        {city}, {state}
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-display font-bold uppercase tracking-wider ${cfg.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                )
              })}
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {locations.map(({ slug, name, address, city, state, status }, i) => {
              const cfg = statusConfig[status]
              return (
                <AnimateOnScroll key={slug} delay={i * 0.04}>
                  <Link
                    to={`/location/${slug}`}
                    className={`block bg-white p-5 border border-[#1A1A1A]/10 hover:border-[#CC6633]/40 transition-colors ${
                      status === 'Available' ? 'border-l-4 border-l-green-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display font-bold uppercase text-[#1A1A1A] text-base tracking-wide">
                        {name}
                      </h3>
                      <span
                        className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-display font-bold uppercase tracking-wider ${cfg.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-[#1A1A1A]/60 text-sm">
                      {address}, {city}, {state}
                    </p>
                  </Link>
                </AnimateOnScroll>
              )
            })}
          </div>

          {/* Legend */}
          <AnimateOnScroll delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#1A1A1A]/50 font-body">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <span key={key} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── DEVELOPER CALLOUT ────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <div className="max-w-2xl">
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                Grow the Network
              </p>
              <h2 className="font-display font-black text-white uppercase leading-tight text-4xl lg:text-5xl mb-6">
                Want to Add<br />Your Location?
              </h2>
              <p className="text-white/55 text-base leading-relaxed mb-10">
                If you're a developer or investor looking to bring Contractor Garage™ to
                your market, Kevin can show you how. License the brand, access the system,
                and put your city on the map.
              </p>
              <Link
                to="/development-services"
                className="inline-block font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white px-8 py-3.5 hover:bg-[#A85228] transition-colors"
              >
                Development Consulting →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
