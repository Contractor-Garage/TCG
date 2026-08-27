import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import MarkerCluster from '../components/MarkerCluster'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useMetaTags from '../hooks/useMetaTags'
import { useMapContext } from '../context/MapContext'
import { API } from '../util/API'
import { getLocationStatus } from '../util/availability'
import locationImage from '../assets/location.jpg'

function MapEventHandler() {
  const [, dispatch] = useMapContext()
  useMapEvents({
    zoomend: (e) => {
      const map = e.target
      dispatch({ type: 'UPDATE_MAP', payload: { zoom: map.getZoom(), center: [map.getCenter().lat, map.getCenter().lng] } })
    },
    moveend: (e) => {
      const map = e.target
      dispatch({ type: 'UPDATE_MAP', payload: { zoom: map.getZoom(), center: [map.getCenter().lat, map.getCenter().lng] } })
    },
  })
  return null
}

function LocationMarkers({ locations }) {
  const markers = useMemo(() =>
    locations
      .filter(l => l.coordinates?.length === 2)
      .map(location => ({
        position: location.coordinates,
        popup: `
          <div style="font-size:13px;max-width:220px">
            <strong style="display:block;margin-bottom:4px">${location.name}</strong>
            ${getLocationStatus(location) === 'Coming Soon' ? '<span style="background:#CC6633;color:#fff;font-size:11px;font-weight:bold;padding:2px 6px;border-radius:3px;display:inline-block;margin-bottom:4px">Coming Soon</span>' : getLocationStatus(location) === 'Available' ? '<span style="background:#22c55e;color:#fff;font-size:11px;font-weight:bold;padding:2px 6px;border-radius:3px;display:inline-block;margin-bottom:4px">Units Available</span>' : ''}
            <span style="color:#666;display:block">${location.addressFirstLine || ''}</span>
            <span style="color:#666;display:block;margin-bottom:6px">${location.addressSecondLine || ''}</span>
            ${location.thumbnailImage ? `<img src="${location.thumbnailImage.src}" alt="${location.thumbnailImage.alt || ''}" style="width:100%;border-radius:4px;margin-bottom:6px"/>` : ''}
            <a href="/location/${location.slug}" style="color:#CC6633;font-weight:bold;font-size:12px;text-decoration:none">View Location →</a>
          </div>
        `,
      })),
    [locations]
  )

  return <MarkerCluster markers={markers} />
}

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
  useMetaTags({
    title: 'Locations',
    description: 'Find Contractor Garage™ locations across the US. Interactive map, unit availability, and contact info for each location.',
  })
  const [mapState] = useMapContext()
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    API.getAllLocations()
      .then((data) => {
        setLocations(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Unable to load locations. Please try again later.')
        setLoading(false)
      })
  }, [])

  const available = locations.filter((l) => getLocationStatus(l) === 'Available')

  const filtered = useMemo(() => {
    let result = locations
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(l =>
        l.name?.toLowerCase().includes(q) ||
        l.addressFirstLine?.toLowerCase().includes(q) ||
        l.addressSecondLine?.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(l => getLocationStatus(l) === statusFilter)
    }
    return result
  }, [locations, search, statusFilter])

  if (loading) {
    return (
      <main>
        <section className="bg-[#1A1A1A] pt-40 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-32 bg-white/10 rounded" />
              <div className="h-16 w-80 bg-white/10 rounded" />
            </div>
          </div>
        </section>
        <section className="bg-[#F7F6F4] py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="animate-pulse space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 bg-white border border-[#1A1A1A]/10 rounded" />
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <section className="bg-[#1A1A1A] pt-40 pb-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <p className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-xs mb-4">
              Locations
            </p>
            <h1 className="font-display font-black text-white uppercase leading-none text-4xl mb-6">
              Something went wrong
            </h1>
            <p className="text-white/60 text-sm">{error}</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      {/* HERO */}
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

      {/* AVAILABILITY BANNER */}
      {available.length > 0 && (
        <div className="bg-[#CC6633] py-4">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse flex-shrink-0" />
              <p className="font-display font-bold uppercase tracking-widest text-white text-sm">
                Several locations currently have units available
              </p>
            </div>
            <p className="text-white/75 font-display font-semibold uppercase tracking-wider text-xs">
              {available.length} location{available.length !== 1 ? 's' : ''} open now
            </p>
          </div>
        </div>
      )}

      {/* MAP */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
              Explore
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-3xl lg:text-4xl mb-4">
              Find a Location
            </h2>
            <p className="text-[#1A1A1A]/55 text-sm mb-8">
              Interact with the map and click on markers to see more information about a specific location.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <div className="w-full border border-[#1A1A1A]/10 overflow-hidden" style={{ height: '75vh', minHeight: '500px' }}>
              <MapContainer
                center={mapState.center}
                zoom={mapState.zoom}
                scrollWheelZoom={true}
                tap={false}
                style={{ width: '100%', height: '100%' }}
              >
                <MapEventHandler />
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  opacity={mapState.zoom <= 7 ? 1 : 0}
                />
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                  opacity={mapState.zoom > 7 ? 1 : 0}
                />
                <LocationMarkers locations={locations} />
              </MapContainer>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* LOCATION LIST */}
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

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <input
              type="text"
              placeholder="Search locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 border border-[#1A1A1A]/15 bg-white text-sm focus:outline-none focus:border-[#CC6633] transition-colors"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-[#1A1A1A]/15 bg-white text-sm font-display font-bold uppercase tracking-wider focus:outline-none focus:border-[#CC6633] transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Coming Soon">Coming Soon</option>
              <option value="Full">Full</option>
            </select>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block">
            <div className="bg-white border border-[#1A1A1A]/10 overflow-hidden">
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
              {filtered.map((location, i) => {
                const status = getLocationStatus(location)
                const cfg = statusConfig[status]
                return (
                  <AnimateOnScroll key={location._id} delay={i * 0.03}>
                    <Link
                      to={`/location/${location.slug}`}
                      className={`grid grid-cols-12 px-8 py-5 border-t border-[#1A1A1A]/8 hover:bg-[#F7F6F4] transition-colors group ${
                        status === 'Available' ? 'bg-green-50/40' : ''
                      }`}
                    >
                      <div className="col-span-3 font-display font-bold text-[#1A1A1A] text-sm uppercase tracking-wide group-hover:text-[#CC6633] transition-colors">
                        {location.name}
                      </div>
                      <div className="col-span-5 text-[#1A1A1A]/65 text-sm font-body">
                        {location.addressFirstLine}
                      </div>
                      <div className="col-span-2 text-[#1A1A1A]/65 text-sm font-body">
                        {location.addressSecondLine}
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
            {filtered.map((location, i) => {
              const status = getLocationStatus(location)
              const cfg = statusConfig[status]
              return (
                <AnimateOnScroll key={location._id} delay={i * 0.04}>
                  <Link
                    to={`/location/${location.slug}`}
                    className={`block bg-white p-5 border border-[#1A1A1A]/10 hover:border-[#CC6633]/40 transition-colors ${
                      status === 'Available' ? 'border-l-4 border-l-green-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display font-bold uppercase text-[#1A1A1A] text-base tracking-wide">
                        {location.name}
                      </h3>
                      <span
                        className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-display font-bold uppercase tracking-wider ${cfg.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-[#1A1A1A]/60 text-sm">
                      {location.addressFirstLine}, {location.addressSecondLine}
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

      {/* DEVELOPER CALLOUT */}
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
