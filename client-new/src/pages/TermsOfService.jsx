import { Link } from 'react-router-dom'
import AnimateOnScroll from '../components/AnimateOnScroll'
import useMetaTags from '../hooks/useMetaTags'

const sections = [
  {
    title: 'Acceptance of Terms',
    body: 'By accessing and using this website (contractorgarage.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue use of this site immediately.',
  },
  {
    title: 'Use of Site',
    body: 'This site is provided for informational purposes regarding Contractor Garage™ locations and services. You agree to use it only for lawful purposes and in a manner consistent with all applicable laws and regulations.',
  },
  {
    title: 'Intellectual Property',
    body: 'All content on this site — including text, images, logos, and the Contractor Garage™ brand — is the property of Contractor Garage and is protected by applicable intellectual property laws. Unauthorized reproduction or distribution is prohibited.',
  },
  {
    title: 'Lease Agreements',
    body: 'Information displayed on this site regarding unit availability, pricing, and features is for general reference only and does not constitute a lease offer. All lease terms are subject to separate written agreements between tenants and location operators.',
  },
  {
    title: 'Payments',
    body: 'Online rent payments processed through this site are handled by PayPal. By using the payment feature, you agree to PayPal\'s terms of service in addition to these terms. Processing fees are disclosed at the time of payment.',
  },
  {
    title: 'Limitation of Liability',
    body: 'Contractor Garage™ provides this website "as is" without warranties of any kind. We are not liable for any damages arising from your use of this site or reliance on information presented here.',
  },
  {
    title: 'Third-Party Links',
    body: 'This site may contain links to third-party websites or services. We do not endorse or assume responsibility for the content or practices of any linked sites.',
  },
  {
    title: 'Modifications',
    body: 'We reserve the right to modify these terms at any time. Continued use of the site after changes are posted constitutes acceptance of the updated terms.',
  },
  {
    title: 'Contact',
    body: 'For questions regarding these Terms of Service, please contact info@contractorgarage.com.',
  },
]

export default function TermsOfService() {
  useMetaTags({
    title: 'Terms of Service',
    description: 'Terms of Service for contractorgarage.com — usage terms, intellectual property, liability, and governing law.',
  })

  return (
    <main>
      <section className="bg-[#1A1A1A] pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="font-display font-bold uppercase tracking-[0.22em] text-[#CC6633] text-xs mb-4">
              Legal
            </p>
            <h1 className="font-display font-black text-white uppercase leading-none text-[clamp(2.5rem,6vw,5rem)]">
              Terms of Service
            </h1>
            <p className="text-white/40 text-sm mt-4 font-display font-semibold uppercase tracking-widest">
              Last updated: {new Date().getFullYear()}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <AnimateOnScroll>
            <p className="text-[#1A1A1A]/70 leading-relaxed mb-12">
              These Terms of Service govern your use of the Contractor Garage™ website
              and related services. Please read them carefully.
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
                See Also
              </p>
              <Link
                to="/privacy-policy"
                className="inline-block font-display font-bold uppercase tracking-wider text-sm text-[#CC6633] border-b-2 border-[#CC6633] pb-0.5 hover:text-[#A85228] hover:border-[#A85228] transition-colors"
              >
                Privacy Policy →
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  )
}
