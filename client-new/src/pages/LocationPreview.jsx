import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useTextScramble from '../hooks/useTextScramble'
import { API } from '../util/API'
import { getAvailabilityLabel, getAvailableUnits, isFutureDated } from '../util/availability'

export default function LocationPreview() {
  const { id } = useParams()
  const scramble = useTextScramble()

  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [openVideoIndex, setOpenVideoIndex] = useState(null)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [galleryDirection, setGalleryDirection] = useState(1)

  useEffect(() => {
    setLoading(true)
    API.getPreviewLocation(id)
      .then((data) => {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data
        setLocation(parsed.data ? (typeof parsed.data === 'string' ? JSON.parse(parsed.data) : parsed.data) : parsed)
        setLoading(false)
      })
      .catch(() => {
        setError('Preview not found or expired.')
        setLoading(false)
      })
  }, [id])

  const goTo = useCallback((idx, dir) => {
    setGalleryDirection(dir)
    setGalleryIndex(idx)
  }, [])

  const galleryImages = location?.detailPageImages || []
  const availableUnits = getAvailableUnits(location)
  const next = useCallback(() => goTo((galleryIndex + 1) % galleryImages.length, 1), [galleryIndex, galleryImages.length, goTo])
  const prev = () => goTo((galleryIndex - 1 + galleryImages.length) % galleryImages.length, -1)

  useEffect(() => {
    if (galleryImages.length < 2) return
    const t = setInterval(next, 4000)
    return () => clearInterval(t)
  }, [next, galleryImages.length])

  if (loading) {
    return (
      <main>
        <section className="bg-[#1A1A1A] pt-40 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-24 bg-white/10 rounded" />
              <div className="h-16 w-64 bg-white/10 rounded" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (error || !location) {
    return (
      <main>
        <section className="bg-[#1A1A1A] pt-40 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <p className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-xs mb-4">
              Preview
            </p>
            <h1 className="font-display font-black text-white uppercase leading-none text-4xl mb-6">
              Preview Expired
            </h1>
            <p className="text-white/60 text-sm mb-8">{error || 'This preview link has expired (30 minute limit).'}</p>
            <Link to="/" className="text-[#CC6633] font-display font-bold uppercase tracking-wider text-sm hover:underline">
              ← Return Home
            </Link>
          </div>
        </section>
      </main>
    )
  }

  const fullAddress = [location.addressFirstLine, location.addressSecondLine].filter(Boolean).join(', ')
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`

  return (
    <main>
      {/* Preview Banner */}
      <div className="bg-yellow-500 text-yellow-900 text-center py-2 text-xs font-display font-bold uppercase tracking-widest fixed top-0 left-0 right-0 z-[60]">
        Preview Mode — This location is not published
      </div>

      {/* HERO */}
      <section
        className="relative pt-48 pb-24"
        style={{
          backgroundImage: location.bannerImage?.src ? `url(${location.bannerImage.src})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#1A1A1A',
        }}
      >
        <div className="absolute inset-0 bg-[#1A1A1A]/75" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <p className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-xs mb-3">
            Contractor Garage™
          </p>
          <h1 className="font-display font-black text-white uppercase leading-none text-[clamp(2.5rem,7vw,5.5rem)]">
            {location.name}
          </h1>
          <p className="text-white/55 text-base mt-3 font-body">{fullAddress}</p>
        </div>
      </section>

      {/* DESCRIPTION */}
      {location.longDescription && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
              <div className="lg:col-span-2">
                <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                  About This Location
                </p>
                <p className="text-[#1A1A1A]/70 leading-relaxed text-base lg:text-lg">
                  {location.longDescription}
                </p>
              </div>
              <div className="bg-[#F7F6F4] p-8 border-t-4 border-[#CC6633]">
                <p className="font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/40 mb-5">
                  Contact
                </p>
                <div className="space-y-4 text-sm">
                  {location.contactName && (
                    <div className="text-[#1A1A1A]/80">{scramble(location.contactName)}</div>
                  )}
                  {location.contactPhone && (
                    <div className="text-[#1A1A1A]/80">{scramble(location.contactPhone)}</div>
                  )}
                  {location.contactEmail && (
                    <div className="text-[#1A1A1A]/80">{scramble(location.contactEmail)}</div>
                  )}
                  <div className="text-[#1A1A1A]/80">{fullAddress}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MAP */}
      {fullAddress && (
        <section className="bg-[#F7F6F4] py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="w-full aspect-video max-w-4xl border border-[#1A1A1A]/10 overflow-hidden">
              <iframe
                title={`Map of ${location.name}`}
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      {location.features?.length > 0 && (
        <section className="bg-[#1A1A1A] py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <h2 className="font-display font-black text-white uppercase leading-none text-3xl lg:text-4xl mb-10">
              Location Features
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {location.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#CC6633]/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#CC6633]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/75 text-sm leading-snug">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* UNIT SUMMARY */}
      {location.unitSummary?.length > 0 && (
        <section className="bg-[#F7F6F4] py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
              Unit Summary
            </h2>
            <div className="bg-white border border-[#1A1A1A]/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1A1A1A]">
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Name</th>
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs"># Units</th>
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Rent</th>
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Sq Ft</th>
                  </tr>
                </thead>
                <tbody>
                  {location.unitSummary.map((unit, i) => (
                    <tr key={i} className={`border-t border-[#1A1A1A]/8 ${i % 2 === 1 ? 'bg-[#F7F6F4]' : ''}`}>
                      <td className="px-6 py-4 font-display font-bold text-[#1A1A1A] uppercase tracking-wide">{unit.unitName}</td>
                      <td className="px-6 py-4 text-[#1A1A1A]/65">{unit.numberOfUnitsByType}</td>
                      <td className="px-6 py-4 text-[#1A1A1A]/65">{unit.monthlyRent ? `$${unit.monthlyRent}/mo` : '—'}</td>
                      <td className="px-6 py-4 text-[#1A1A1A]/65">{unit.squareFeet || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* UNIT AVAILABILITIES */}
      {availableUnits.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
              Unit Availabilities
            </h2>
            <div className="bg-white border border-[#1A1A1A]/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1A1A1A]">
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Unit</th>
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Available</th>
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Rent</th>
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Width</th>
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Depth</th>
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Sq Ft</th>
                    <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Height</th>
                  </tr>
                </thead>
                <tbody>
                  {availableUnits.map((unit, i) => (
                    <tr key={i} className={`border-t border-[#1A1A1A]/8 bg-green-50/60 ${i % 2 === 1 ? 'bg-green-50/30' : ''}`}>
                      <td className="px-6 py-4 font-display font-bold text-green-700 uppercase tracking-wide">{unit.unitName}</td>
                      <td className={`px-6 py-4 font-display font-bold uppercase tracking-wide whitespace-nowrap ${isFutureDated(unit) ? 'text-[#CC6633]' : 'text-green-700'}`}>
                        {getAvailabilityLabel(unit)}
                      </td>
                      <td className="px-6 py-4 text-green-700">{unit.monthlyRent ? `$${unit.monthlyRent}/mo` : '—'}</td>
                      <td className="px-6 py-4 text-green-700/70">{unit.width ? `${unit.width}′` : '—'}</td>
                      <td className="px-6 py-4 text-green-700/70">{unit.depth ? `${unit.depth}′` : '—'}</td>
                      <td className="px-6 py-4 text-green-700/70">{unit.squareFeet || '—'}</td>
                      <td className="px-6 py-4 text-green-700/70">{unit.height || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
              Photos
            </h2>
            <div className="relative max-w-4xl overflow-hidden bg-[#1A1A1A]" style={{ aspectRatio: '16/9' }}>
              <AnimatePresence initial={false} custom={galleryDirection}>
                <motion.img
                  key={galleryIndex}
                  src={galleryImages[galleryIndex]?.src || galleryImages[galleryIndex]}
                  alt={galleryImages[galleryIndex]?.alt || `Photo ${galleryIndex + 1}`}
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
              {galleryImages.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/80 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={() => next()} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/80 flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
