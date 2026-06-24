/*
  BrandWithUs — developer/investor pitch page with pricing cards and a contact form.
  Sections: Hero → Podcast banner → Pricing cards (3) → Live Seminar split → Contact form.

  CONTACT FORM NOTE: The form currently uses local React state only (handleSubmit just
  sets submitted=true). To wire it up, replace handleSubmit with an Axios POST to your
  backend or a form service (e.g. Formspree, EmailJS). The form fields are:
    name, email, market (city), message.
*/
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useMetaTags from '../hooks/useMetaTags'
import { API } from '../util/API'
import presentingImage from '../assets/presenting.png'

const consultingFeatures = [
  'Access to Online Course',
  'Access to historical plans and pro formas',
  'Access to lease',
  'Site selection criteria & market analysis',
  'Zoning and permitting guidance',
  'Construction specs & vendor recommendations',
  'Lease-up strategy from day one',
  'Direct access to Kevin Combs',
  'Lifetime follow-up questions included',
]

const subscriptionFeatures = [
  'Your own page on contractorgarage.com',
  'Lead generation & national SEO exposure',
  'Licensed use of the Contractor Garage™ trademark',
  'Self-manage your building\'s availability online',
  'PayPal payment integration for leads',
  'Credibility with lenders and investors',
]

const investmentCase = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Recession Resistant',
    body: 'Tradespeople are among the last to cut workspace. Demand held strong in 2008 and through every cycle since — by design.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M4.582 9A8 8 0 0119.419 15M19.418 15A8 8 0 014.581 9" />
      </svg>
    ),
    title: 'Repeatable by Design',
    body: 'The model is intentionally simple and standardized. Once you build one, you know exactly how to build the next — in any market.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: 'Simple to Build',
    body: 'No complex HVAC, no restrooms, no storefront build-out. Basic industrial construction with strong returns — developers love the economics.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
      </svg>
    ),
    title: 'Strong Occupancy',
    body: "Kevin's projects routinely fill before construction is complete. The demand is there — it's been underserved for decades.",
  },
]

export default function BrandWithUs() {
  useMetaTags({
    title: 'Development Consulting',
    description: 'Build a Contractor Garage™ in your market. One-on-one consulting with Kevin Combs, CCIM — site selection, construction specs, lease-up strategy, and brand licensing.',
  })
  const [form, setForm] = useState({ name: '', email: '', market: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(false)
    API.submitContactForm(form)
      .then(() => {
        setSubmitted(true)
        setSubmitting(false)
      })
      .catch(() => {
        setError(true)
        setSubmitting(false)
      })
  }

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] pt-40 pb-24 relative overflow-hidden">
        {/* Decorative orange bar */}
        <div className="absolute top-0 left-0 w-1 h-full bg-[#CC6633]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-xs mb-4">
              For Developers &amp; Investors
            </p>
            <h1 className="font-display font-black text-white uppercase leading-none text-[clamp(3rem,9vw,7rem)] mb-8">
              Build One<br />In Your<br />Market.
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.15}>
            <p className="text-white/65 text-lg lg:text-xl max-w-2xl leading-relaxed">
              Kevin Combs has built 10+ Contractor Garage™ projects in the Kansas City
              metro since 2008. Now he's sharing the model — so developers in other
              markets can replicate it.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── PODCAST BANNER ───────────────────────────────────── */}
      <div className="bg-[#F7F6F4] border-y border-[#1A1A1A]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#CC6633] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <div>
              <p className="font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/50 mb-0.5">
                Listen to Kevin
              </p>
              <p className="font-display font-black text-[#1A1A1A] text-base uppercase">
                The K Show — Hear the Full Story
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="https://open.spotify.com/episode/4kDKGfgYw4M9CHObCPEnY8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-display font-bold uppercase tracking-wider text-xs bg-[#1DB954] text-white px-5 py-2.5 hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Spotify
            </a>
            <a
              href="https://podcasts.apple.com/us/podcast/e14-kevin-combs-contractor-garages/id1740211062?i=1000670826834"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-display font-bold uppercase tracking-wider text-xs bg-[#872EC4] text-white px-5 py-2.5 hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm2.813 17.625c-.141.422-.516.656-.938.656-.093 0-.188-.016-.281-.047-1.781-.609-3.75-.609-5.531 0a.938.938 0 01-.563-1.781c2.25-.75 4.641-.75 6.891 0 .5.172.766.719.422 1.172zm.844-2.953a1.03 1.03 0 01-1.344.328c-2.156-.828-5.203-.828-7.359 0a1.031 1.031 0 01-.703-1.937c2.625-1 6.516-1 9.141 0 .5.188.734.75.265 1.609zm.703-3.047c-2.672-1.219-6.891-1.219-9.563 0a1.125 1.125 0 11-.969-2.016c3.219-1.453 8.281-1.453 11.5 0 .641.281.922 1.031.641 1.672-.281.641-1.031.922-1.609.344z"/>
              </svg>
              Apple
            </a>
          </div>
        </div>
      </div>

      {/* ── PRICING CARDS ────────────────────────────────────── */}
      <section className="bg-[#F7F6F4] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
              How to Work With Kevin
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-5xl lg:text-6xl mb-4">
              Choose Your Path
            </h2>
            <p className="text-[#1A1A1A]/55 font-body text-sm mb-14 max-w-lg">
              This is a brand license, not a franchise. No ongoing royalties, no territory fees.
              You own your project — Kevin shares the blueprint.
            </p>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {/* Card 1: Development Consulting — FEATURED */}
            <AnimateOnScroll delay={0.05}>
              <div className="relative bg-[#1A1A1A] text-white flex flex-col h-full border-t-4 border-[#CC6633] shadow-2xl shadow-[#1A1A1A]/20">
                <div className="absolute top-0 right-6 -translate-y-1/2">
                  <span className="inline-block font-display font-black uppercase tracking-widest text-xs bg-[#CC6633] text-white px-4 py-1.5">
                    Most Popular
                  </span>
                </div>
                <div className="p-8 lg:p-10 flex flex-col flex-1">
                  <div className="mb-6">
                    <p className="font-display font-bold uppercase tracking-widest text-[#CC6633] text-xs mb-2">
                      One-on-One
                    </p>
                    <h3 className="font-display font-black uppercase text-2xl lg:text-3xl mb-1">
                      Development Consulting
                    </h3>
                    <div className="flex items-end gap-2 mt-4">
                      <span className="font-display font-black text-4xl text-white">$3,000</span>
                      <span className="text-white/50 text-sm mb-1 font-body">one-time</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-white/10 mb-6" />

                  <ul className="space-y-3 flex-1">
                    {consultingFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-white/75">
                        <svg className="w-4 h-4 text-[#CC6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <a
                      href="#contact"
                      className="block w-full text-center font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white py-3.5 hover:bg-[#A85228] transition-colors"
                    >
                      Talk to Kevin
                    </a>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Card 2: Brand Subscription */}
            <AnimateOnScroll delay={0.1}>
              <div className="bg-white border border-[#1A1A1A]/12 flex flex-col h-full">
                <div className="p-8 lg:p-10 flex flex-col flex-1">
                  <div className="mb-6">
                    <p className="font-display font-bold uppercase tracking-widest text-[#CC6633] text-xs mb-2">
                      Annual License
                    </p>
                    <h3 className="font-display font-black uppercase text-2xl lg:text-3xl text-[#1A1A1A] mb-1">
                      Brand Subscription
                    </h3>
                    <div className="flex items-end gap-2 mt-4">
                      <span className="font-display font-black text-4xl text-[#1A1A1A]">$1–3K</span>
                      <span className="text-[#1A1A1A]/50 text-sm mb-1 font-body">/year · 10yr min.</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-[#1A1A1A]/10 mb-6" />

                  <ul className="space-y-3 flex-1">
                    {subscriptionFeatures.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-[#1A1A1A]/70">
                        <svg className="w-4 h-4 text-[#CC6633] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 p-4 bg-[#F7F6F4] border border-[#1A1A1A]/8 text-xs text-[#1A1A1A]/55 leading-relaxed">
                    Also available as a one-time lifetime membership — <strong className="text-[#1A1A1A]/80">$10K–$30K</strong> depending on market.
                  </div>

                  <div className="mt-6">
                    <a
                      href="#contact"
                      className="block w-full text-center font-display font-bold uppercase tracking-wider text-sm border-2 border-[#1A1A1A] text-[#1A1A1A] py-3.5 hover:bg-[#1A1A1A] hover:text-white transition-colors"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

          </div>

          {/* Not a franchise note */}
          <AnimateOnScroll delay={0.2}>
            <p className="mt-8 text-center text-[#1A1A1A]/45 text-xs font-body">
              ✦ This is a brand license, not a franchise. No royalties, no territory exclusivity, no corporate overhead.
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── ONLINE COURSE ────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-3xl">
            {/* Left: content */}
            <AnimateOnScroll>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                Self-Paced Learning
              </p>
              <h2 className="font-display font-black text-white uppercase leading-tight text-4xl lg:text-5xl mb-6">
                Online Course
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Can't make it to Kansas City? Kevin's 5-part online course covers the entire
                Contractor Garage model from site selection through lease-up — at your own pace,
                on your own schedule.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  { num: '01', title: 'Market Analysis & Site Selection', desc: 'How to identify the right market, evaluate sites, and assess demand before you commit.' },
                  { num: '02', title: 'Construction Specs & Cost Control', desc: 'What to build, what to skip, and how to hit the numbers that make the model work.' },
                  { num: '03', title: 'Zoning, Permitting & Legal Basics', desc: 'Navigate approvals without an attorney on retainer — what you need to know.' },
                  { num: '04', title: 'Lease-Up Strategy', desc: 'Pre-leasing tactics, tenant screening, and how to fill units before you open the doors.' },
                  { num: '05', title: 'Scaling to Multiple Locations', desc: 'Operations, management systems, and how Kevin built 10+ projects across one metro.' },
                ].map(({ num, title, desc }) => (
                  <div key={num} className="flex gap-4 group">
                    <span className="font-display font-black text-[#CC6633] text-xs w-6 flex-shrink-0 mt-0.5">{num}</span>
                    <div>
                      <p className="font-display font-bold uppercase text-white text-sm tracking-wide">{title}</p>
                      <p className="text-white/40 text-xs leading-relaxed mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 border-t border-white/10 pt-3 mt-2">
                  <span className="font-display font-black text-[#CC6633] text-xs w-6 flex-shrink-0 mt-0.5">★</span>
                  <div>
                    <p className="font-display font-bold uppercase text-white text-sm tracking-wide">Bonus: The Banker Video</p>
                    <p className="text-white/40 text-xs leading-relaxed mt-0.5">How Kevin finances these projects — what lenders look for and how to structure the deal.</p>
                  </div>
                </div>
              </div>

              <a
                href="https://contractorgarage.teachable.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white px-8 py-3.5 hover:bg-[#A85228] transition-colors"
              >
                Get Course Access →
              </a>
            </AnimateOnScroll>

            {/* Course preview hidden until a real preview clip exists — only the
                full-length course videos are available right now. The "Get Course
                Access" button above links to Teachable. Restore a preview embed
                here once a short preview video is produced. */}
          </div>
        </div>
      </section>

      {/* ── INVESTMENT CASE ──────────────────────────────────── */}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1A1A1A]/10">
            {investmentCase.map(({ icon, title, body }, i) => (
              <AnimateOnScroll key={title} delay={i * 0.07} className="h-full">
                <div className="h-full bg-white p-8 group hover:bg-[#1A1A1A] transition-colors duration-300">
                  <div className="text-[#CC6633] mb-5">{icon}</div>
                  <h3 className="font-display font-black uppercase text-lg text-[#1A1A1A] group-hover:text-white mb-3 transition-colors">
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

      {/* ── LIVE SEMINAR ─────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: content */}
            <AnimateOnScroll>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                Hands-On Training
              </p>
              <h2 className="font-display font-black text-white uppercase leading-tight text-4xl lg:text-5xl mb-8">
                Live 2-Day<br />Seminar in KC
              </h2>
              <p className="text-white/60 leading-relaxed mb-8">
                Come to Kansas City for an intensive two-day immersion. You'll tour active
                Contractor Garage locations, meet tenants, and walk through the full
                development process with Kevin in person.
              </p>

              <div className="space-y-6 mb-10">
                <div className="border-l-2 border-[#CC6633] pl-6">
                  <h4 className="font-display font-bold uppercase text-white text-sm tracking-widest mb-2">
                    Day 1 — The Model
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Market analysis, site selection, zoning and permitting, construction
                    specs, financing strategies, and the economics of the product type.
                  </p>
                </div>
                <div className="border-l-2 border-[#CC6633] pl-6">
                  <h4 className="font-display font-bold uppercase text-white text-sm tracking-widest mb-2">
                    Day 2 — The Execution
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Lease-up strategy, tenant screening, management systems, scaling to
                    multiple locations, and tours of active KC properties.
                  </p>
                </div>
              </div>

              <Link
                to="/seminar"
                className="inline-block font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white px-8 py-3.5 hover:bg-[#A85228] transition-colors"
              >
                Get Event Info
              </Link>
            </AnimateOnScroll>

            {/* Right: photo */}
            <AnimateOnScroll delay={0.1} direction="left">
              <div
                className="aspect-[4/3] bg-gray-700"
                style={{
                  backgroundImage: `url(${presentingImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ─────────────────────────────────────── */}
      <section id="contact" className="bg-[#F7F6F4] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: heading */}
            <AnimateOnScroll>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                Start the Conversation
              </p>
              <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-tight text-4xl lg:text-5xl mb-6">
                Talk to<br />Kevin
              </h2>
              <p className="text-[#1A1A1A]/60 leading-relaxed mb-8 max-w-md">
                Tell Kevin about your market and what you're trying to build. He'll follow
                up personally to see if the model is a fit for your location.
              </p>
              <div className="space-y-4 text-sm text-[#1A1A1A]/55">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#CC6633]" />
                  Response within 24–48 hours
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#CC6633]" />
                  No hard sell — just a real conversation
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#CC6633]" />
                  Kevin Combs, CCIM — personally
                </div>
              </div>
            </AnimateOnScroll>

            {/* Right: form */}
            <AnimateOnScroll delay={0.1}>
              {submitted ? (
                <div className="bg-white border border-[#1A1A1A]/10 p-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-5">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-display font-black uppercase text-[#1A1A1A] text-2xl mb-3">Message Sent</h3>
                  <p className="text-[#1A1A1A]/55 text-sm leading-relaxed">
                    Thanks for reaching out. Kevin will be in touch within 24–48 hours.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-white border border-[#1A1A1A]/10 p-8 lg:p-10 space-y-5"
                >
                  <input type="text" name="username" className="hidden" tabIndex={-1} autoComplete="off" />
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/50 mb-2">
                        Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="w-full border border-[#1A1A1A]/15 bg-[#F7F6F4] px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#CC6633] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/50 mb-2">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full border border-[#1A1A1A]/15 bg-[#F7F6F4] px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#CC6633] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/50 mb-2">
                      Your Market / City
                    </label>
                    <input
                      name="market"
                      type="text"
                      required
                      value={form.market}
                      onChange={handleChange}
                      placeholder="e.g. Nashville, TN or Denver, CO"
                      className="w-full border border-[#1A1A1A]/15 bg-[#F7F6F4] px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#CC6633] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-display font-bold uppercase tracking-widest text-xs text-[#1A1A1A]/50 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell Kevin what you're working with — land you're evaluating, stage you're at, what you want to know..."
                      className="w-full border border-[#1A1A1A]/15 bg-[#F7F6F4] px-4 py-3 text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:outline-none focus:border-[#CC6633] transition-colors resize-none"
                    />
                  </div>
                  {error && (
                    <p className="text-red-600 text-sm font-semibold">
                      Something went wrong. Please try again or email kevin.combs@contractorgarage.com directly.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white py-4 hover:bg-[#A85228] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </main>
  )
}
