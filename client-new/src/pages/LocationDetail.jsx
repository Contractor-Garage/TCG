import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useTextScramble from '../hooks/useTextScramble'
import { API } from '../util/API'

export default function LocationDetail() {
  const { slug } = useParams()
  const scramble = useTextScramble()

  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [openVideoIndex, setOpenVideoIndex] = useState(null)
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [payAmount, setPayAmount] = useState('')
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [galleryDirection, setGalleryDirection] = useState(1)

  useEffect(() => {
    setLoading(true)
    setError(null)
    API.getLocationBySlug(slug)
      .then((data) => {
        setLocation(data)
        setLoading(false)
      })
      .catch(() => {
        setError('not-found')
        setLoading(false)
      })
  }, [slug])

  const goTo = useCallback((idx, dir) => {
    setGalleryDirection(dir)
    setGalleryIndex(idx)
  }, [])

  const galleryImages = location?.detailPageImages || []
  const prev = () => goTo((galleryIndex - 1 + galleryImages.length) % galleryImages.length, -1)
  const next = useCallback(() => goTo((galleryIndex + 1) % galleryImages.length, 1), [galleryIndex, galleryImages.length, goTo])

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
              <div className="h-4 w-48 bg-white/10 rounded" />
            </div>
          </div>
        </section>
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="animate-pulse space-y-6">
              <div className="h-4 w-full max-w-lg bg-[#1A1A1A]/10 rounded" />
              <div className="h-4 w-full max-w-md bg-[#1A1A1A]/10 rounded" />
              <div className="h-4 w-full max-w-sm bg-[#1A1A1A]/10 rounded" />
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (error || !location) {
    return <Navigate to="/directory" replace />
  }

  const hasAvailable = location.units?.some((u) => u.available)
  const status = hasAvailable ? 'Available' : 'Full'
  const fullAddress = [location.addressFirstLine, location.addressSecondLine].filter(Boolean).join(', ')
  const hasCoordinates = location.coordinates?.length === 2

  const feePercent = location.paymentMarkupPercent || 0
  const feeFixed = location.paymentMarkupFixed || 0
  const payTotal = payAmount
    ? (parseFloat(payAmount) + parseFloat(payAmount) * feePercent + feeFixed).toFixed(2)
    : '0.00'

  return (
    <main>
      {/* HERO */}
      <section
        className="relative pt-44 pb-24"
        style={{
          backgroundImage: location.bannerImage?.src ? `url(${location.bannerImage.src})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#1A1A1A',
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
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 text-sm font-display font-bold uppercase tracking-wider ${
                  status === 'Available'
                    ? 'bg-green-500/15 text-green-600 border border-green-500/30'
                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${status === 'Available' ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {status}
                </span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* DESCRIPTION + CONTACT */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            <div className="lg:col-span-2">
              <AnimateOnScroll>
                <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                  About This Location
                </p>
                <p className="text-[#1A1A1A]/70 leading-relaxed text-base lg:text-lg">
                  {location.longDescription}
                </p>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll delay={0.1}>
              <div className="bg-[#F7F6F4] p-8 border-t-4 border-[#CC6633]">
                <p className="font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/40 mb-5">
                  Contact
                </p>
                <div className="space-y-4 text-sm">
                  {location.contactName && (
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-[#CC6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-[#1A1A1A]/80">{scramble(location.contactName)}</span>
                    </div>
                  )}
                  {location.contactPhone && (
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-[#CC6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-[#1A1A1A]/80">{scramble(location.contactPhone)}</span>
                    </div>
                  )}
                  {location.contactEmail && (
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-[#CC6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[#1A1A1A]/80">{scramble(location.contactEmail)}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-[#CC6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[#1A1A1A]/80">{fullAddress}</span>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* MAP */}
      {hasCoordinates && (
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
            <AnimateOnScroll delay={0.1}>
              <div className="w-full aspect-video max-w-4xl border border-[#1A1A1A]/10 overflow-hidden">
                <MapContainer
                  center={location.coordinates}
                  zoom={15}
                  scrollWheelZoom={false}
                  dragging={false}
                  zoomControl={false}
                  doubleClickZoom={false}
                  touchZoom={false}
                  keyboard={false}
                  attributionControl={false}
                  style={{ width: '100%', height: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={location.coordinates}>
                    <Popup>{location.name}<br />{fullAddress}</Popup>
                  </Marker>
                </MapContainer>
              </div>
              <p className="mt-3 text-[#1A1A1A]/40 text-xs font-body">{fullAddress}</p>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* VIDEOS */}
      {location.detailPageVideos?.length > 0 && (
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
            <div className="space-y-3 max-w-4xl">
              {location.detailPageVideos.map((video, i) => (
                <AnimateOnScroll key={video._id || i} delay={i * 0.05}>
                  <div className="border border-[#1A1A1A]/10 overflow-hidden">
                    <button
                      onClick={() => setOpenVideoIndex(openVideoIndex === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-[#F7F6F4] hover:bg-[#EFEFED] transition-colors"
                    >
                      <span className="font-display font-bold uppercase tracking-wider text-sm text-[#1A1A1A]">
                        Video {i + 1}
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
                        <video
                          src={video.src}
                          poster={video.poster}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      {location.features?.length > 0 && (
        <section className="bg-[#1A1A1A] py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <AnimateOnScroll>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
                What's Included
              </p>
              <h2 className="font-display font-black text-white uppercase leading-none text-3xl lg:text-4xl mb-10">
                Location Features
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
      )}

      {/* UNIT TABLES */}
      <section className="bg-[#F7F6F4] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 space-y-16">
          {location.unitSummary?.length > 0 && (
            <AnimateOnScroll>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
                Bay Types
              </p>
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
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Width</th>
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Depth</th>
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Sq Ft</th>
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Height</th>
                    </tr>
                  </thead>
                  <tbody>
                    {location.unitSummary.map((unit, i) => (
                      <tr key={i} className={`border-t border-[#1A1A1A]/8 ${i % 2 === 1 ? 'bg-[#F7F6F4]' : ''}`}>
                        <td className="px-6 py-4 font-display font-bold text-[#1A1A1A] uppercase tracking-wide">{unit.unitName}</td>
                        <td className="px-6 py-4 text-[#1A1A1A]/65">{unit.numberOfUnitsByType}</td>
                        <td className="px-6 py-4 text-[#1A1A1A]/65">{unit.monthlyRent ? `$${unit.monthlyRent}/mo` : '—'}</td>
                        <td className="px-6 py-4 text-[#1A1A1A]/65">{unit.width ? `${unit.width}′` : '—'}</td>
                        <td className="px-6 py-4 text-[#1A1A1A]/65">{unit.depth ? `${unit.depth}′` : '—'}</td>
                        <td className="px-6 py-4 text-[#1A1A1A]/65">{unit.squareFeet || '—'}</td>
                        <td className="px-6 py-4 text-[#1A1A1A]/65">{unit.height || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimateOnScroll>
          )}

          {location.units?.some((u) => u.available) && (
            <AnimateOnScroll>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
                Available Now
              </p>
              <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
                Unit Availability
              </h2>
              <div className="bg-white border border-[#1A1A1A]/10 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1A1A1A]">
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Unit</th>
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Rent</th>
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Width</th>
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Depth</th>
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Sq Ft</th>
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Height</th>
                    </tr>
                  </thead>
                  <tbody>
                    {location.units.filter((u) => u.available).map((unit, i) => (
                      <tr key={i} className={`border-t border-[#1A1A1A]/8 bg-green-50/60 ${i % 2 === 1 ? 'bg-green-50/30' : ''}`}>
                        <td className="px-6 py-4 font-display font-bold text-green-700 uppercase tracking-wide">{unit.unitName}</td>
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
            </AnimateOnScroll>
          )}

          {location.extras?.length > 0 && (
            <AnimateOnScroll>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
                Add-Ons
              </p>
              <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-8">
                Extras
              </h2>
              <div className="bg-white border border-[#1A1A1A]/10 overflow-x-auto max-w-3xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1A1A1A]">
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Price</th>
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Frequency</th>
                      <th className="px-6 py-3 text-left font-display font-bold uppercase tracking-widest text-white/50 text-xs">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {location.extras.map((extra, i) => (
                      <tr key={i} className={`border-t border-[#1A1A1A]/8 ${i % 2 === 1 ? 'bg-[#F7F6F4]' : ''}`}>
                        <td className="px-6 py-4 font-display font-bold text-[#1A1A1A]">{extra.price ? `$${extra.price}` : '—'}</td>
                        <td className="px-6 py-4 text-[#1A1A1A]/65">{extra.frequency || '—'}</td>
                        <td className="px-6 py-4 text-[#1A1A1A]/65">{extra.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimateOnScroll>
          )}
        </div>
      </section>

      {/* IMAGE GALLERY */}
      {galleryImages.length > 0 && (
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
                    src={galleryImages[galleryIndex]?.src || galleryImages[galleryIndex]}
                    alt={galleryImages[galleryIndex]?.alt || `${location.name} photo ${galleryIndex + 1}`}
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
                    <button
                      onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => next()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
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
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* PAY RENT */}
      {location.enablePayments && (
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
                  PayPal. A small processing fee applies.
                </p>
                <button
                  onClick={() => setPayModalOpen(true)}
                  className="inline-flex items-center gap-3 font-display font-bold uppercase tracking-wider text-sm bg-[#003087] text-white px-8 py-3.5 hover:bg-[#002166] transition-colors"
                >
                  Pay with PayPal
                </button>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      )}

      {/* PayPal Modal */}
      {payModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => e.target === e.currentTarget && setPayModalOpen(false)}
        >
          <div className="bg-white w-full max-w-md shadow-2xl">
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
            <div className="px-8 py-6 space-y-5">
              <div>
                <label className="block font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/50 mb-2">
                  Rent Amount
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
              {payAmount && parseFloat(payAmount) > 0 && (
                <div className="bg-[#F7F6F4] p-4 border border-[#1A1A1A]/10 text-xs space-y-1">
                  <div className="flex justify-between text-[#1A1A1A]/55">
                    <span>Rent</span>
                    <span>${parseFloat(payAmount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#1A1A1A]/55">
                    <span>Processing fee</span>
                    <span>${(parseFloat(payAmount) * feePercent + feeFixed).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#1A1A1A] pt-1 border-t border-[#1A1A1A]/10">
                    <span>Total</span>
                    <span>${payTotal}</span>
                  </div>
                </div>
              )}
              <div className="pt-2">
                <button
                  disabled={!payAmount || parseFloat(payAmount) <= 0}
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

      {/* CTA */}
      <section className="bg-[#CC6633] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-display font-bold uppercase tracking-[0.2em] text-white/60 text-xs mb-2">
                  Find Your Space
                </p>
                <h2 className="font-display font-black text-white uppercase leading-tight text-3xl lg:text-4xl">
                  {status === 'Available'
                    ? "Ready to Move In? Let's Talk."
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
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
