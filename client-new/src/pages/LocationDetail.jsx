/*
  LocationDetail — individual location page at /location/:slug.
  Sections: Hero → Quick Info → Description + Contact → Map →
            Videos → Features → Unit Summary → Unit Availability →
            Extras → Gallery → Pay Rent (PayPal UI) → CTA.

  Data: imported from src/data/locations.js (static).
  To pull live data, replace getLocationBySlug() call with an
  Axios GET inside a useEffect, e.g.:
    useEffect(() => { axios.get(`/api/locations/${slug}`).then(...) }, [slug])

  Map: Google Maps iframe via address query string.
  Replace with a Leaflet <MapContainer> once lat/lng are available in the data.

  PayPal: UI only — modal with unit selector and amount field.
  Wire up PayPal JS SDK in handlePayPalCheckout().

  Gallery: react-gallery-carousel. Populate location.images[] with real URLs
  from the API to enable it; empty array renders a placeholder instead.
*/
import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AnimateOnScroll from '../components/AnimateOnScroll'
import { getLocationBySlug } from '../data/locations'
import heroImage from '../assets/hero.jpg'
import locationImage from '../assets/location.jpg'

const statusConfig = {
  Available: {
    dot: 'bg-green-500',
    badge: 'bg-green-500/15 text-green-600 border border-green-500/30',
    label: 'Available',
  },
  'Coming Soon': {
    dot: 'bg-[#CC6633]',
    badge: 'bg-[#CC6633]/15 text-[#CC6633] border border-[#CC6633]/30',
    label: 'Coming Soon',
  },
  Full: {
    dot: 'bg-gray-400',
    badge: 'bg-gray-100 text-gray-500 border border-gray-200',
    label: 'Full',
  },
}

const availabilityRowConfig = {
  Available: 'bg-green-50/60 text-green-700 font-semibold',
  Occupied: 'text-[#1A1A1A]/50',
  'Coming Soon': 'text-[#CC6633] font-semibold',
}

export default function LocationDetail() {
  const { slug } = useParams()
  const location = getLocationBySlug(slug)

  const [openVideoIndex, setOpenVideoIndex] = useState(null)
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [payUnit, setPayUnit] = useState('')
  const [payAmount, setPayAmount] = useState('')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [galleryDirection, setGalleryDirection] = useState(1)

  if (!location) return <Navigate to="/directory" replace />

  const cfg = statusConfig[location.status]
  const fullAddress = [location.address, location.city, location.state, location.zip]
    .filter(Boolean)
    .join(', ')
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`

  // Placeholder images for gallery — replace with location.images when API provides them
  const galleryImages = location.images?.length
    ? location.images
    : [heroImage, locationImage]

  const goTo = useCallback((idx, dir) => {
    setGalleryDirection(dir)
    setGalleryIndex(idx)
  }, [])

  const prev = () => goTo((galleryIndex - 1 + galleryImages.length) % galleryImages.length, -1)
  const next = useCallback(() => goTo((galleryIndex + 1) % galleryImages.length, 1), [galleryIndex, galleryImages.length, goTo])

  useEffect(() => {
    if (galleryImages.length < 2) return
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [next, galleryImages.length])

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative pt-44 pb-24"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#1A1A1A]/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <Link
              to="/directory"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-display font-bold uppercase tracking-widest mb-8 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              All Locations
            </Link>
            <div className="flex items-start gap-5 flex-wrap">
              <div>
                <p className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-xs mb-3">
                  Contractor Garage™
                </p>
                <h1 className="font-display font-black text-white uppercase leading-none text-[clamp(2.5rem,7vw,5.5rem)]">
                  {location.name}
                </h1>
                <p className="text-white/55 text-base mt-3 font-body">{fullAddress}</p>
              </div>
              <div className="mt-2 lg:mt-6">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-display font-bold uppercase tracking-wider ${cfg.badge}`}>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── DESCRIPTION + CONTACT ────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Description */}
            <div className="lg:col-span-2">
              <AnimateOnScroll>
                <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                  About This Location
                </p>
                <p className="text-[#1A1A1A]/70 leading-relaxed text-base lg:text-lg">
                  {location.description}
                </p>
              </AnimateOnScroll>
            </div>

            {/* Contact card */}
            <AnimateOnScroll delay={0.1}>
              <div className="bg-[#F7F6F4] p-8 border-t-4 border-[#CC6633]">
                <p className="font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/40 mb-5">
                  Contact
                </p>
                <div className="space-y-4 text-sm">
                  {location.phone && (
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-[#CC6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${location.phone}`} className="text-[#1A1A1A]/80 hover:text-[#CC6633] transition-colors">
                        {location.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#CC6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${location.email}`} className="text-[#1A1A1A]/80 hover:text-[#CC6633] transition-colors">
                      {location.email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#CC6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[#1A1A1A]/80">{fullAddress}</span>
                  </div>
                </div>

                {location.status === 'Available' && (
                  <div className="mt-6 pt-6 border-t border-[#1A1A1A]/10">
                    <Link
                      to="/development-services#contact"
                      className="block w-full text-center font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white py-3 hover:bg-[#A85228] transition-colors"
                    >
                      Inquire About a Unit
                    </Link>
                  </div>
                )}
                {location.status === 'Coming Soon' && (
                  <div className="mt-6 pt-6 border-t border-[#1A1A1A]/10">
                    <Link
                      to="/development-services#contact"
                      className="block w-full text-center font-display font-bold uppercase tracking-wider text-sm border-2 border-[#CC6633] text-[#CC6633] py-3 hover:bg-[#CC6633] hover:text-white transition-colors"
                    >
                      Join Interest List
                    </Link>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── MAP ──────────────────────────────────────────────── */}
      <section className="bg-[#F7F6F4] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
              Get Directions
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
              Find Us
            </h2>
          </AnimateOnScroll>
          {/* TODO: Replace with Leaflet <MapContainer> once lat/lng are in location data */}
          <AnimateOnScroll delay={0.1}>
            <div className="w-full aspect-video max-w-4xl border border-[#1A1A1A]/10 overflow-hidden">
              <iframe
                title={`Map of ${location.name}`}
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-3 text-[#1A1A1A]/40 text-xs font-body">
              {fullAddress}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── VIDEOS ───────────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
              See It In Action
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
              Video Tour
            </h2>
          </AnimateOnScroll>

          {location.videos.length === 0 ? (
            <AnimateOnScroll delay={0.1}>
              <div className="relative bg-[#1A1A1A] aspect-video flex items-center justify-center max-w-4xl">
                <div className="w-16 h-16 rounded-full bg-[#CC6633] flex items-center justify-center shadow-2xl">
                  <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="absolute bottom-5 left-6 text-white/35 font-display font-semibold uppercase tracking-widest text-xs">
                  Video Tour — Coming Soon
                </div>
              </div>
            </AnimateOnScroll>
          ) : (
            <div className="space-y-3 max-w-4xl">
              {location.videos.map((video, i) => (
                <AnimateOnScroll key={i} delay={i * 0.05}>
                  <div className="border border-[#1A1A1A]/10 overflow-hidden">
                    <button
                      onClick={() => setOpenVideoIndex(openVideoIndex === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-[#F7F6F4] hover:bg-[#EFEFED] transition-colors"
                    >
                      <span className="font-display font-bold uppercase tracking-wider text-sm text-[#1A1A1A]">
                        {video.title}
                      </span>
                      <svg
                        className={`w-5 h-5 text-[#CC6633] transition-transform ${openVideoIndex === i ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openVideoIndex === i && (
                      <div className="aspect-video bg-[#1A1A1A]">
                        <iframe
                          src={video.embedUrl}
                          title={video.title}
                          width="100%"
                          height="100%"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ border: 0 }}
                        />
                      </div>
                    )}
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
              What's Included
            </p>
            <h2 className="font-display font-black text-white uppercase leading-none text-3xl lg:text-4xl mb-10">
              Every Bay Includes
            </h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {location.features.map((feature, i) => (
              <AnimateOnScroll key={feature} delay={i * 0.04}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#CC6633]/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#CC6633]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/75 text-sm leading-snug">{feature}</span>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── UNIT TABLES ──────────────────────────────────────── */}
      <section className="bg-[#F7F6F4] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-16">

          {/* Unit Summary */}
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
              Bay Types
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
              Unit Summary
            </h2>
            <div className="bg-white border border-[#1A1A1A]/10 overflow-hidden max-w-2xl">
              <div className="grid grid-cols-3 bg-[#1A1A1A] px-6 py-3">
                {['Bay Type', 'Sq Ft', 'Count'].map((h) => (
                  <div key={h} className="font-display font-bold uppercase tracking-widest text-white/50 text-xs">
                    {h}
                  </div>
                ))}
              </div>
              {location.units.map(({ type, sqft, count }, i) => (
                <div
                  key={type}
                  className={`grid grid-cols-3 px-6 py-4 border-t border-[#1A1A1A]/8 ${i % 2 === 1 ? 'bg-[#F7F6F4]' : ''}`}
                >
                  <span className="font-display font-bold text-[#1A1A1A] text-sm uppercase tracking-wide">{type}</span>
                  <span className="text-[#1A1A1A]/65 text-sm font-body">{sqft.toLocaleString()} sq ft</span>
                  <span className="text-[#1A1A1A]/65 text-sm font-body">{count}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>

          {/* Unit Availability */}
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
              Availability
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
              Unit Availability
            </h2>
            <div className="bg-white border border-[#1A1A1A]/10 overflow-hidden">
              <div className="grid grid-cols-5 bg-[#1A1A1A] px-6 py-3">
                {['Unit', 'Type', 'Sq Ft', 'Rent / Mo', 'Status'].map((h) => (
                  <div key={h} className="font-display font-bold uppercase tracking-widest text-white/50 text-xs">
                    {h}
                  </div>
                ))}
              </div>
              {location.availability.map(({ unit, type, sqft, rent, status }, i) => {
                const rowCls = availabilityRowConfig[status] || ''
                return (
                  <div
                    key={unit}
                    className={`grid grid-cols-5 px-6 py-4 border-t border-[#1A1A1A]/8 ${i % 2 === 1 ? 'bg-[#F7F6F4]' : ''}`}
                  >
                    <span className="font-display font-bold text-[#1A1A1A] text-sm">{unit}</span>
                    <span className="text-[#1A1A1A]/65 text-sm font-body">{type}</span>
                    <span className="text-[#1A1A1A]/65 text-sm font-body">{sqft.toLocaleString()}</span>
                    <span className="text-[#1A1A1A]/65 text-sm font-body">{rent}</span>
                    <span className={`text-xs font-display uppercase tracking-wide ${rowCls}`}>{status}</span>
                  </div>
                )
              })}
            </div>
          </AnimateOnScroll>

          {/* Extras */}
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
              Add-Ons
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
              Extras &amp; Add-Ons
            </h2>
            <div className="bg-white border border-[#1A1A1A]/10 overflow-hidden max-w-3xl">
              <div className="grid grid-cols-3 bg-[#1A1A1A] px-6 py-3">
                {['Item', 'Included', 'Notes'].map((h) => (
                  <div key={h} className="font-display font-bold uppercase tracking-widest text-white/50 text-xs">
                    {h}
                  </div>
                ))}
              </div>
              {location.extras.map(({ item, included, notes }, i) => (
                <div
                  key={item}
                  className={`grid grid-cols-3 px-6 py-4 border-t border-[#1A1A1A]/8 ${i % 2 === 1 ? 'bg-[#F7F6F4]' : ''}`}
                >
                  <span className="font-display font-bold text-[#1A1A1A] text-sm">{item}</span>
                  <span className={`text-sm font-body ${included ? 'text-green-600' : 'text-[#1A1A1A]/40'}`}>
                    {included ? 'Included' : 'Extra'}
                  </span>
                  <span className="text-[#1A1A1A]/55 text-sm font-body">{notes}</span>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── IMAGE GALLERY ────────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
              Photo Gallery
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
              {location.name} Photos
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <div className="relative max-w-4xl overflow-hidden bg-[#1A1A1A]" style={{ aspectRatio: '16/9' }}>
              <AnimatePresence initial={false} custom={galleryDirection}>
                <motion.img
                  key={galleryIndex}
                  src={galleryImages[galleryIndex]}
                  alt={`${location.name} photo ${galleryIndex + 1}`}
                  custom={galleryDirection}
                  variants={{
                    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => { setGalleryDirection(1); next() }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {galleryImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goTo(i, i > galleryIndex ? 1 : -1)}
                        className={`w-2 h-2 rounded-full transition-colors ${i === galleryIndex ? 'bg-white' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {!location.images?.length && (
              <p className="mt-3 text-[#1A1A1A]/35 text-xs font-body italic">
                Placeholder photos shown — add real images to location.images[] in the data file.
              </p>
            )}
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── PAY RENT ─────────────────────────────────────────── */}
      <section className="bg-[#F7F6F4] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <div className="max-w-xl">
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
                Current Tenants
              </p>
              <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-4">
                Pay Rent Online
              </h2>
              <p className="text-[#1A1A1A]/55 text-sm leading-relaxed mb-8">
                Existing tenants at this location can pay monthly rent securely through
                PayPal. Select your unit number and enter the amount due.
              </p>
              <button
                onClick={() => setPayModalOpen(true)}
                className="inline-flex items-center gap-3 font-display font-bold uppercase tracking-wider text-sm bg-[#003087] text-white px-8 py-3.5 hover:bg-[#002166] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.067 8.478c.492.315.844.727 1.043 1.236.199.51.199 1.055 0 1.565-.199.51-.551.922-1.043 1.237-.492.314-1.063.472-1.711.472H16.5l-.5 2.512H14l1.5-7.5h3.856c.648 0 1.219.158 1.711.478zM8.5 8h5a2.5 2.5 0 010 5H12l-.5 3H9.5L8.5 8zM4 8h2l-1 6H3L4 8z"/>
                </svg>
                Pay with PayPal
              </button>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* PayPal Modal */}
      {payModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => e.target === e.currentTarget && setPayModalOpen(false)}
        >
          <div className="bg-white w-full max-w-md shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#1A1A1A]/10">
              <div>
                <h3 className="font-display font-black uppercase text-[#1A1A1A] text-xl">Pay Rent</h3>
                <p className="text-[#1A1A1A]/45 text-xs font-display font-semibold uppercase tracking-widest mt-0.5">
                  {location.name}
                </p>
              </div>
              <button
                onClick={() => setPayModalOpen(false)}
                className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="px-8 py-6 space-y-5">
              <div>
                <label className="block font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/50 mb-2">
                  Unit Number
                </label>
                <select
                  value={payUnit}
                  onChange={(e) => setPayUnit(e.target.value)}
                  className="w-full border border-[#1A1A1A]/15 bg-[#F7F6F4] px-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#CC6633] transition-colors appearance-none"
                >
                  <option value="">Select your unit…</option>
                  {location.availability
                    .filter((u) => u.status === 'Occupied')
                    .map((u) => (
                      <option key={u.unit} value={u.unit}>
                        Unit {u.unit} — {u.type} ({u.sqft.toLocaleString()} sq ft)
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/50 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 text-sm">$</span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full border border-[#1A1A1A]/15 bg-[#F7F6F4] pl-8 pr-4 py-3 text-sm text-[#1A1A1A] focus:outline-none focus:border-[#CC6633] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                {/* TODO: Wire up PayPal JS SDK — replace disabled button with PayPal checkout */}
                <button
                  disabled={!payUnit || !payAmount}
                  className="w-full font-display font-bold uppercase tracking-wider text-sm bg-[#003087] text-white py-3.5 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#002166] transition-colors"
                >
                  Continue to PayPal
                </button>
                <p className="text-center text-[#1A1A1A]/35 text-xs mt-3 font-body">
                  You will be redirected to PayPal to complete payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-[#CC6633] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-display font-bold uppercase tracking-[0.2em] text-white/60 text-xs mb-2">
                  Find Your Space
                </p>
                <h2 className="font-display font-black text-white uppercase leading-tight text-3xl lg:text-4xl">
                  {location.status === 'Available'
                    ? 'Ready to Move In? Let\'s Talk.'
                    : location.status === 'Coming Soon'
                    ? 'Get On the Interest List.'
                    : 'See All Available Locations.'}
                </h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/directory"
                  className="flex-shrink-0 inline-block font-display font-bold uppercase tracking-wider text-sm border-2 border-white text-white px-8 py-3.5 hover:bg-white hover:text-[#CC6633] transition-colors"
                >
                  All Locations
                </Link>
                {location.status !== 'Full' && (
                  <Link
                    to="/development-services#contact"
                    className="flex-shrink-0 inline-block font-display font-bold uppercase tracking-wider text-sm bg-white text-[#CC6633] px-8 py-3.5 hover:bg-[#1A1A1A] hover:text-white transition-colors"
                  >
                    {location.status === 'Coming Soon' ? 'Join Interest List →' : 'Inquire Now →'}
                  </Link>
                )}
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
