/*
  PrivacyPolicy — placeholder layout. Replace content with final legal copy before launch.
*/
import { Link } from 'react-router-dom'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useMetaTags from '../hooks/useMetaTags'

const sections = [
  {
    title: 'Information We Collect',
    body: 'When you submit the contact form on this site, we collect your name, email address, and the information you choose to include in your message. We do not automatically collect tracking data beyond standard web analytics.',
  },
  {
    title: 'How We Use Your Information',
    body: 'The information you provide is used solely to respond to your inquiry. We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.',
  },
  {
    title: 'Cookies',
    body: 'This site may use basic session cookies to ensure proper functionality. No third-party advertising cookies are used. You may disable cookies in your browser settings at any time.',
  },
  {
    title: 'Third-Party Services',
    body: 'This site may link to third-party services such as Spotify, Apple Podcasts, or PayPal. Those services have their own privacy policies, which we encourage you to review.',
  },
  {
    title: 'Data Retention',
    body: 'Contact form submissions are retained only as long as necessary to respond to your inquiry. You may request deletion of your data at any time by contacting us directly.',
  },
  {
    title: 'Contact Us',
    body: 'If you have questions about this privacy policy or how your data is handled, please reach out to info@contractorgarage.com.',
  },
]

export default function PrivacyPolicy() {
  useMetaTags({
    title: 'Privacy Policy',
    description: 'Contractor Garage™ privacy policy — how we collect, use, and protect your personal information.',
  })
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#1A1A1A] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-xs mb-4">
              Legal
            </p>
            <h1 className="font-display font-black text-white uppercase leading-none text-[clamp(2.5rem,6vw,5rem)]">
              Privacy Policy
            </h1>
            <p className="text-white/40 text-sm mt-4 font-display font-semibold uppercase tracking-widest">
              Last updated: {new Date().getFullYear()}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="text-[#1A1A1A]/70 leading-relaxed mb-12">
              Contractor Garage™ is committed to protecting your privacy. This policy
              describes how we handle the limited personal information collected through
              this website.
            </p>
          </AnimateOnScroll>

          <div className="space-y-10">
            {sections.map(({ title, body }, i) => (
              <AnimateOnScroll key={title} delay={i * 0.05}>
                <div className="border-l-2 border-[#CC6633] pl-6">
                  <h2 className="font-display font-black uppercase text-xl text-[#1A1A1A] mb-3">
                    {title}
                  </h2>
                  <p className="text-[#1A1A1A]/65 leading-relaxed text-sm">{body}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll delay={0.2}>
            <div className="mt-16 pt-10 border-t border-[#1A1A1A]/10">
              <p className="text-[#1A1A1A]/45 text-xs font-display font-semibold uppercase tracking-widest mb-4">
                Questions?
              </p>
              <Link
                to="/development-services#contact"
                className="inline-block font-display font-bold uppercase tracking-wider text-sm text-[#CC6633] border-b-2 border-[#CC6633] pb-0.5 hover:text-[#A85228] hover:border-[#A85228] transition-colors"
              >
                Contact Us →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
