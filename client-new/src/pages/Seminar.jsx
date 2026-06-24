/*
  Seminar — the live 2-day "Introduction to the Development of Large-Bay Storage"
  seminar, ported from the old client (client/src/routes/seminar/Seminar.js) and
  restyled to match the v3 app.

  Sections: Hero → Overview & Format → Speaker → Schedule (+ map) →
            Pricing & Sign-Up → Syllabus.

  The sign-up form posts to /api/seminar/sign-up via API.submitSeminarSignupForm,
  with a hidden honeypot "username" field (same anti-spam pattern as the contact
  form). Event dates: April 16–18, 2027.
*/
import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useMetaTags from '../hooks/useMetaTags'
import { API } from '../util/API'
import kevinImage from '../assets/kevin.jpg'

const VENUE = {
  coordinates: [38.98520709907486, -94.66967884584639],
  addressFirstLine: '7925 Marty St',
  addressSecondLine: 'Overland Park, KS 66204',
}

const credentials = [
  'B.S. Mechanical Engineering, Kansas State University — 2002',
  'Certified Commercial Investment Member (CCIM) — 2009, earned through rigorous education, proven transactional experience, and ethics.',
  'Licensed general contractor (Johnson County, KS — Class A)',
  'Licensed real estate broker (Kansas and Missouri)',
]

const schedule = [
  {
    date: 'Fri · April 16, 2027',
    label: 'Optional',
    title: 'Meet & Greet',
    body: '7:00 PM — Optional meet and greet at Brew Lab (7925 Marty St, Overland Park, KS).',
  },
  {
    date: 'Sat · April 17, 2027',
    label: 'Day 1',
    title: 'The Nitty Gritty',
    body: '9:00 AM — Session 1 in a private event space at Brew Lab. Complimentary lunch and happy-hour drinks provided.',
  },
  {
    date: 'Sun · April 18, 2027',
    label: 'Day 2',
    title: 'Property Tour',
    body: '9:00 AM — Guided tour of active Contractor Garage™ properties across the KC metro. Wraps up at Brew Lab around 3:00 PM.',
  },
]

const syllabus = [
  {
    category: 'General',
    items: [
      'Problems with mini-storage for the small business owner.',
      'Problems with flex industrial for the small business owner.',
      'What is a Contractor Garage™?',
      'Who is your customer? Sort between 3 different products for 3 different customers.',
      'When to build a Contractor Garage™, when to build flex industrial, or a combination of the two.',
      'When to build mini storage in combination with a Contractor Garage™.',
    ],
  },
  {
    category: 'Evaluating Supply & Demand',
    items: [
      'Use of commercial real estate professionals.',
      'Demographic study.',
      'Old-fashioned investigation.',
    ],
  },
  {
    category: 'Site Selection',
    items: [
      'Ideal lot size.',
      'Ideal locations.',
      'Ideal topography.',
      'Configuration to main road.',
      'Potential layouts.',
    ],
  },
  {
    category: 'Hand-Drafting Your First Site Plan',
    items: [
      'Set-backs, stormwater detention, possible easements.',
      'What are the goals?',
      'Discuss the two different possible layouts.',
    ],
  },
  {
    category: 'Purchase Contract',
    items: [
      'Working with a commercial/land real estate agent and/or attorney to draft a purchase contract.',
      'Contingencies and negotiation deal-points.',
      'Due diligence.',
    ],
  },
  {
    category: 'Planning Stage',
    items: [
      'Pre-preliminary meeting with the city.',
      'Hiring your design professionals (civil engineer and architect).',
      'Preliminary site plan.',
      'Locating existing utilities — know when to expect major costs.',
      'Ideal unit sizes.',
      'Preliminary meeting with the city.',
      'Final site development plans for planning commission / city council.',
      'Critical design points we have learned over the years and often missed by others.',
      'Common problems and hurdles you will encounter.',
    ],
  },
  {
    category: 'Pro Forma',
    items: [
      'Basics of commercial real estate finance (Pro Forma template distributed in Microsoft Excel).',
      'Build and interpolate parameters to create a winning financial plan.',
      'Historical construction costs given out in class.',
      'Learn how to benefit from post-stabilization value — earn instant net worth!',
    ],
  },
  {
    category: 'Lending',
    items: [
      'Common lending parameters (minimum vacancy rate, debt coverage ratio, loan to value).',
      'Conventional vs. SBA.',
      'Down payment options.',
      'Bank versus private equity.',
    ],
  },
  {
    category: 'Syndication',
    items: [
      'Different ways to organize (lightly covered).',
      'Cash vs. non-cash contributions towards ownership.',
    ],
  },
  {
    category: 'Construction',
    items: [
      'Permitting.',
      'GC or not to GC.',
      'Construction type (mini storage / lightweight metal, pre-engineered red-iron, masonry, concrete tilt-up, etc).',
      'Materials.',
      'Pads, piers, concrete thickness, foundation types, structural slabs.',
      'Sprinklers / firewalls / construction types (2B vs. 5B and storage vs. factory).',
      'Inevitable potential construction problems and delays.',
      "Optional upgrades (polished floors, 14' tall doors, insulation, HVAC, openers, electrical, liners, plumbing, common loading dock).",
      'AIA construction draw worksheets and the typical construction draw process.',
      'Protecting yourself with insurance certificates, lien waivers, and dual checks.',
      'Restroom(s) details.',
    ],
  },
  {
    category: 'Leasing',
    items: [
      'Self-perform or outsource.',
      'Marketing and advertising.',
      'Benefits to being part of the Contractor Garage™ brand.',
      'Screening tenants.',
      'Lease details.',
      'Rent roll.',
    ],
  },
  {
    category: 'Management',
    items: [
      'Self-perform or outsource.',
      'Welcome letter.',
      'Rent payments / ACH.',
      'Being a good property manager.',
      'Common issues.',
      'Bookkeeping.',
      'Move-out checklist.',
      'Turning over units.',
      'Evictions.',
      'Maintaining profits.',
    ],
  },
]

const inputClass =
  'w-full border border-[#1A1A1A]/15 bg-[#F7F6F4] px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#CC6633] transition-colors'
const labelClass =
  'block font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/50 mb-2'

export default function Seminar() {
  useMetaTags({
    title: 'Live 2-Day Seminar',
    description:
      'Introduction to the Development of Large-Bay Storage — a live 2-day seminar in Kansas City with Kevin Combs, CCIM. April 16–18, 2027.',
  })

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    attendanceType: 'In-Person',
    company: '',
    jobTitle: '',
    hearAboutUs: '',
    specialRequests: '',
    username: '', // honeypot
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((d) => ({ ...d, [name]: value }))
    setErrors((er) => ({ ...er, [name]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!formData.fullname.trim()) e.fullname = 'Full name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    if (!formData.phoneNumber.trim()) e.phoneNumber = 'Phone number is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length) {
      setErrors(v)
      return
    }
    setSubmitting(true)
    setFailed(false)
    API.submitSeminarSignupForm(formData)
      .then(() => {
        setSuccess(true)
        setSubmitting(false)
      })
      .catch(() => {
        setFailed(true)
        setSubmitting(false)
      })
  }

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] pt-40 pb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#CC6633]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-xs mb-4">
              Live 2-Day Seminar · Kansas City
            </p>
            <h1 className="font-display font-black text-white uppercase leading-none text-[clamp(2.5rem,7vw,5.5rem)] mb-8 max-w-4xl">
              Introduction to the Development of Large-Bay Storage
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.15}>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <p className="font-display font-black text-white uppercase text-2xl">
                April 16–18, 2027
              </p>
              <span className="text-white/30">·</span>
              <p className="text-white/55 font-display font-semibold uppercase tracking-widest text-xs">
                Hosted by Contractor Garage™
              </p>
            </div>
            <a
              href="#signup"
              className="mt-10 inline-block font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white px-8 py-3.5 hover:bg-[#A85228] transition-colors"
            >
              Reserve Your Seat →
            </a>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── OVERVIEW & FORMAT ────────────────────────────────── */}
      <section className="bg-[#F7F6F4] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <AnimateOnScroll>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                Overview
              </p>
              <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-tight text-3xl lg:text-4xl mb-6">
                A Growing Niche
              </h2>
              <div className="space-y-5 text-[#1A1A1A]/70 leading-relaxed">
                <p>
                  Real estate development is a complex, multifaceted process. This
                  in-person course focuses on <strong>large-bay storage</strong> — a
                  fast-growing niche of commercial real estate that bridges the gap
                  between mini storage and flex industrial.
                </p>
                <p>
                  Presented by Contractor Garage™, the leading brand in large-bay
                  storage since 2008, we walk through every stage of the development
                  process — preventing mistakes, shortening your learning curve, and
                  helping you get it right from the beginning.
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.1}>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                Format
              </p>
              <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-tight text-3xl lg:text-4xl mb-6">
                Two Days, Hands-On
              </h2>
              <div className="space-y-5 text-[#1A1A1A]/70 leading-relaxed">
                <p>
                  A <strong>two-day course</strong> starting with the basics. Day 1 gets
                  down to the nitty-gritty in a private event space at Brew Lab, a
                  neighborhood brewpub in Overland Park, Kansas — lunch and happy-hour
                  drinks provided. Day 2 is a guided tour of our properties across the
                  greater Kansas City metro.
                </p>
                <p className="font-display font-bold uppercase tracking-wide text-[#1A1A1A] text-sm">
                  Class size is limited to 20 people.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── SPEAKER ──────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
              Your Instructor
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-4xl lg:text-5xl mb-14">
              Kevin Combs, CCIM
            </h2>
          </AnimateOnScroll>
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <AnimateOnScroll direction="right">
              <div
                className="aspect-[4/5] bg-gray-300"
                style={{
                  backgroundImage: `url(${kevinImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                }}
              />
              <ul className="mt-px divide-y divide-[#1A1A1A]/10 border-t border-[#1A1A1A]/10">
                {credentials.map((c) => (
                  <li key={c} className="py-3 text-xs text-[#1A1A1A]/60 leading-relaxed">
                    {c}
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.1} className="lg:col-span-2">
              <div className="space-y-5 text-[#1A1A1A]/70 leading-relaxed">
                <p>
                  After leaving engineering and the corporate rat race in 2005, Kevin
                  started his commercial real estate career focused on the industrial
                  market in Kansas City. Working with the smallest of entrepreneurs, he
                  kept hearing the same need: 500–1,000 square feet for $500–1,000 a
                  month. Mini storage didn't work and flex space was too expensive —
                  these spaces simply didn't exist in Kansas City, or, it turns out, the
                  nation.
                </p>
                <p>
                  Rather than keep watching good leads go cold, he built his first
                  Contractor Garage™ in 2008 — in the middle of a recession, using
                  private funds. He and his investors quickly learned the spaces were
                  recession-resistant, filling up before construction was even finished
                  in a poor economy.
                </p>
                <p>
                  After years of fielding calls from interested developers across the
                  country, he redesigned the Contractor Garage™ website in 2022 and
                  trademarked the brand to launch the concept nationally. With experience
                  as a general contractor, syndicator, leasing agent, and property
                  manager, he is the ideal consultant — and with more than ten projects
                  built across the KC metro, he has the track record to prove it.
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── SCHEDULE + MAP ───────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
              Schedule
            </p>
            <h2 className="font-display font-black text-white uppercase leading-none text-4xl lg:text-5xl mb-4">
              April 16–18, 2027
            </h2>
            <p className="text-white/55 text-sm mb-14 max-w-lg">
              In-person in Overland Park, KS. A webinar option runs once a 4-person
              minimum is reached.
            </p>
          </AnimateOnScroll>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <AnimateOnScroll>
              <div className="space-y-6">
                {schedule.map(({ date, label, title, body }) => (
                  <div key={date} className="border-l-2 border-[#CC6633] pl-6">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-display font-black uppercase tracking-widest text-[#CC6633] text-xs">
                        {label}
                      </span>
                      <span className="text-white/40 text-xs font-display font-semibold uppercase tracking-widest">
                        {date}
                      </span>
                    </div>
                    <h4 className="font-display font-bold uppercase text-white text-lg tracking-wide mb-1">
                      {title}
                    </h4>
                    <p className="text-white/55 text-sm leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.1} direction="left">
              <MapContainer
                center={VENUE.coordinates}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '440px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={VENUE.coordinates}>
                  <Popup>
                    <strong>Brew Lab</strong>
                    <br />
                    {VENUE.addressFirstLine}
                    <br />
                    {VENUE.addressSecondLine}
                  </Popup>
                </Marker>
              </MapContainer>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── PRICING + SIGN UP ────────────────────────────────── */}
      <section id="signup" className="bg-[#F7F6F4] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Pricing */}
            <AnimateOnScroll>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                Price & Reservation
              </p>
              <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-tight text-4xl lg:text-5xl mb-8">
                Reserve<br />Your Seat
              </h2>
              <div className="flex items-end gap-2 mb-8">
                <span className="font-display font-black text-[#1A1A1A] text-5xl">$1,000</span>
                <span className="text-[#1A1A1A]/50 text-sm mb-1.5 font-body">per person</span>
              </div>
              <div className="space-y-4 text-sm text-[#1A1A1A]/65 leading-relaxed max-w-md">
                <p>
                  <strong className="text-[#1A1A1A]">Cancellation policy:</strong> Fully
                  refundable if canceled up to one month before the class.
                </p>
                <p>
                  <strong className="text-[#1A1A1A]">Payment instructions:</strong> You'll
                  receive detailed payment instructions after completing the sign-up
                  process below.
                </p>
                <p>We look forward to having you at the seminar!</p>
              </div>
            </AnimateOnScroll>

            {/* Sign-up form */}
            <AnimateOnScroll delay={0.1}>
              {success ? (
                <div className="bg-white border border-[#1A1A1A]/10 p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display font-black uppercase text-[#1A1A1A] text-2xl mb-3">You're Signed Up</h3>
                  <p className="text-[#1A1A1A]/55 text-sm leading-relaxed">
                    Thanks for signing up! We'll be in touch soon with payment instructions
                    and event details.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="bg-white border border-[#1A1A1A]/10 p-8 lg:p-10 space-y-5"
                >
                  {/* Honeypot — hidden from real users */}
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div>
                    <label htmlFor="fullname" className={labelClass}>
                      Full Name <span className="text-[#CC6633]">*</span>
                    </label>
                    <input
                      id="fullname"
                      name="fullname"
                      type="text"
                      value={formData.fullname}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    {errors.fullname && (
                      <p className="text-red-600 text-xs mt-1.5">{errors.fullname}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email <span className="text-[#CC6633]">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs mt-1.5">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className={labelClass}>
                        Phone <span className="text-[#CC6633]">*</span>
                      </label>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className={inputClass}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-600 text-xs mt-1.5">{errors.phoneNumber}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className={labelClass}>How will you attend?</span>
                    <div className="flex gap-6">
                      {['In-Person', 'Webinar'].map((type) => (
                        <label key={type} className="flex items-center gap-2 text-sm text-[#1A1A1A]/70 cursor-pointer">
                          <input
                            type="radio"
                            name="attendanceType"
                            value={type}
                            checked={formData.attendanceType === type}
                            onChange={handleChange}
                            className="accent-[#CC6633]"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="company" className={labelClass}>Company</label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="jobTitle" className={labelClass}>Job Title</label>
                      <input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="specialRequests" className={labelClass}>
                      Geographic Market
                    </label>
                    <input
                      id="specialRequests"
                      name="specialRequests"
                      type="text"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      placeholder="e.g. Nashville, TN"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="hearAboutUs" className={labelClass}>
                      How did you hear about us?
                    </label>
                    <textarea
                      id="hearAboutUs"
                      name="hearAboutUs"
                      rows={4}
                      maxLength={500}
                      value={formData.hearAboutUs}
                      onChange={handleChange}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  {failed && (
                    <p className="text-red-600 text-sm font-semibold">
                      Something went wrong. Please try again or email
                      kevin.combs@contractorgarage.com directly.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white py-4 hover:bg-[#A85228] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Sign Up'}
                  </button>
                </form>
              )}
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── SYLLABUS ─────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
              What You'll Learn
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-4xl lg:text-5xl mb-14">
              Full Syllabus
            </h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 gap-px bg-[#1A1A1A]/10">
            {syllabus.map(({ category, items }, i) => (
              <AnimateOnScroll key={category} delay={(i % 2) * 0.07} className="h-full">
                <div className="h-full bg-white p-8">
                  <h3 className="font-display font-black uppercase text-lg text-[#1A1A1A] mb-4 flex items-center gap-3">
                    <span className="w-6 h-0.5 bg-[#CC6633] flex-shrink-0" />
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-[#1A1A1A]/65 leading-relaxed">
                        <svg className="w-3.5 h-3.5 text-[#CC6633] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Bottom CTA */}
          <AnimateOnScroll delay={0.1}>
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#1A1A1A] p-8 lg:p-10">
              <div>
                <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-2">
                  Seats Are Limited to 20
                </p>
                <h3 className="font-display font-black text-white uppercase text-2xl lg:text-3xl">
                  Reserve Your Spot for April 2027
                </h3>
              </div>
              <div className="flex gap-4 flex-shrink-0">
                <a
                  href="#signup"
                  className="inline-block font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white px-8 py-3.5 hover:bg-[#A85228] transition-colors"
                >
                  Sign Up →
                </a>
                <Link
                  to="/development-services"
                  className="inline-block font-display font-bold uppercase tracking-wider text-sm border-2 border-white text-white px-8 py-3.5 hover:bg-white hover:text-[#1A1A1A] transition-colors"
                >
                  Other Options
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
