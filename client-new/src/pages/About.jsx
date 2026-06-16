/*
  About — Kevin Combs founder bio page.
  Sections: Hero → Bio (photo + text, with stats bar) → What Kevin Offers (3 cards) →
            Video placeholder → CTA band.

  The video section is a placeholder — replace the dark div with an actual <iframe>
  or video player when the video asset is ready.
*/
import { Link } from 'react-router-dom'
import AnimateOnScroll from '../components/AnimateOnScroll'
import kevinImage from '../assets/kevin.jpg'

const stats = [
  { value: '2008', label: 'First Project Built' },
  { value: '10+', label: 'Projects in KC Metro' },
  { value: 'CCIM', label: 'Designation' },
  { value: '15+', label: 'Years in the Market' },
]

const offerings = [
  {
    title: 'Development Consulting',
    desc: 'One-on-one guidance from site selection through lease-up. Kevin walks you through every step of building your own Contractor Garage.',
  },
  {
    title: 'Brand Subscription',
    desc: 'License the Contractor Garage™ brand, appear on contractorgarage.com, and access the national SEO and credibility that comes with it.',
  },
  {
    title: 'Online Course',
    desc: 'A self-paced 5-part course covering site selection, construction specs, lease-up strategy, and scaling — plus a bonus banker video.',
  },
]

export default function About() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-xs mb-4">
              The Founder
            </p>
            <h1 className="font-display font-black text-white uppercase leading-none text-[clamp(3rem,8vw,6.5rem)]">
              Built From<br />Experience.
            </h1>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── BIO SECTION ──────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Photo */}
            <AnimateOnScroll direction="right">
              <div
                className="aspect-[4/5] bg-gray-300"
                style={{
                  backgroundImage: `url(${kevinImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                }}
              />
              {/* Stats row */}
              <div className="grid grid-cols-4 gap-px bg-[#1A1A1A]/10 mt-px">
                {stats.map(({ value, label }) => (
                  <div key={label} className="bg-[#F7F6F4] py-5 px-4 text-center">
                    <div className="font-display font-black text-[#CC6633] text-2xl leading-none">{value}</div>
                    <div className="text-[#1A1A1A]/50 text-[10px] uppercase tracking-widest mt-1 font-display font-semibold">{label}</div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            {/* Bio */}
            <AnimateOnScroll delay={0.1}>
              <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
                Kevin Combs, CCIM
              </p>
              <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-tight text-4xl lg:text-5xl mb-8">
                He Left Engineering<br />to Build It Himself.
              </h2>
              <div className="space-y-5 text-[#1A1A1A]/70 leading-relaxed">
                <p>
                  Kevin Combs spent the early 2000s working as an engineer. By 2005 he
                  had spotted a gap in the market that nobody was filling: small trade
                  businesses — plumbers, electricians, landscapers, contractors — needed
                  750–1,500 SF of working space. Not storage. Not flex office. Something
                  in between that didn't exist.
                </p>
                <p>
                  He left engineering and set out to build it himself. The first
                  Contractor Garage opened in 2008 — right as the financial crisis hit.
                  He filled it using private funds before construction was even complete.
                  That proof of concept has since been repeated more than ten times
                  across the Kansas City metro.
                </p>
                <p>
                  Kevin holds the CCIM designation and has spent the last fifteen years
                  refining a model that is simple to build, simple to operate, and
                  repeatable in virtually any market. Now he shares it.
                </p>
                <p className="text-[#1A1A1A]/50 text-sm italic">
                  "I had no idea I was creating a product category. I just knew the
                  demand was there and nothing existed to serve it."
                </p>
              </div>
              <div className="mt-10">
                <Link
                  to="/development-services"
                  className="inline-block font-display font-bold uppercase tracking-wider text-sm bg-[#CC6633] text-white px-8 py-3.5 hover:bg-[#A85228] transition-colors"
                >
                  Work With Kevin
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ── WHAT KEVIN OFFERS ────────────────────────────────── */}
      <section className="bg-[#1A1A1A] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
              Knowledge Transfer
            </p>
            <h2 className="font-display font-black text-white uppercase leading-none text-5xl lg:text-6xl mb-14">
              What Kevin Offers
            </h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {offerings.map(({ title, desc }, i) => (
              <AnimateOnScroll key={title} delay={i * 0.1}>
                <div className="p-10 lg:p-12 bg-[#1A1A1A] border border-white/10 hover:border-[#CC6633]/60 transition-colors group">
                  <div className="w-8 h-0.5 bg-[#CC6633] mb-6" />
                  <h3 className="font-display font-black uppercase text-xl text-white mb-4 group-hover:text-[#CC6633] transition-colors">
                    {title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
          <AnimateOnScroll delay={0.2}>
            <div className="mt-10 text-center lg:text-left">
              <Link
                to="/development-services"
                className="inline-block font-display font-bold uppercase tracking-wider text-sm border-2 border-[#CC6633] text-[#CC6633] px-8 py-3.5 hover:bg-[#CC6633] hover:text-white transition-colors"
              >
                View All Offerings →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── VIDEO PLACEHOLDER ────────────────────────────────── */}
      <section className="bg-[#F7F6F4] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.2em] text-[#CC6633] text-xs mb-4">
              See It in Action
            </p>
            <h2 className="font-display font-black text-[#1A1A1A] uppercase leading-none text-4xl lg:text-5xl mb-12">
              What Is a Contractor Garage™?
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <div className="relative bg-[#1A1A1A] aspect-video flex items-center justify-center group cursor-pointer max-w-4xl">
              {/* Play button */}
              <div className="w-20 h-20 rounded-full bg-[#CC6633] flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                <svg className="w-7 h-7 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="absolute bottom-6 left-8 text-white/40 font-display font-semibold uppercase tracking-widest text-xs">
                Video — Coming Soon
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── CTA BAND ─────────────────────────────────────────── */}
      <section className="bg-[#CC6633] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div>
                <p className="font-display font-bold uppercase tracking-[0.2em] text-white/60 text-xs mb-3">
                  Ready to Build?
                </p>
                <h2 className="font-display font-black text-white uppercase leading-tight text-4xl lg:text-5xl">
                  Bring Contractor Garage™<br />to Your Market.
                </h2>
              </div>
              <Link
                to="/development-services"
                className="flex-shrink-0 inline-block font-display font-bold uppercase tracking-wider text-sm bg-white text-[#CC6633] px-10 py-4 hover:bg-[#1A1A1A] hover:text-white transition-colors"
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
