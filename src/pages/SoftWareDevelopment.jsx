import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowRight,
  Code2,
  Building2,
  Cloud,
  Plug,
  RefreshCw,
  Server,
  MessageSquare,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StickyCTA from '../components/StickyCTA';
import DevelopmentApproach from '../components/DevelopmentApproach';
import SoftwareServicesShowcase from '../components/SoftwareServicesOrbit';
import WhatWeBuild from '../components/WhatWeBuild';
import TechnologyStack from '../components/TechnologyStack';
import WhyChooseAtriowings from '../components/Whychooseatriowings';
import SoftwareFAQ from '../components/Softwarefaq';
import heroImg from '../assets/software-dev-hero.png';
import { ROUTES } from '../utils/sectionNav';
import './SoftwareDevelopmentPage.css';

const EASE = [0.22, 1, 0.36, 1];
const CONTACT_HREF = ROUTES.contact;

const WHAT_WE_BUILD = [
  {
    icon: Code2,
    title: 'Custom Software',
    text: 'Applications designed around your workflows, so your team stops working around the tools.',
  },
  {
    icon: Building2,
    title: 'Enterprise Solutions',
    text: 'Secure, role-based systems that connect departments, data and reporting in one place.',
  },
  {
    icon: Cloud,
    title: 'SaaS Applications',
    text: 'Multi-user subscription products built to onboard customers and grow with demand.',
  },
  {
    icon: Plug,
    title: 'API Integration',
    text: 'Reliable connections between your software, payment, CRM and third-party services.',
  },
  {
    icon: RefreshCw,
    title: 'Legacy Modernization',
    text: 'Upgrade ageing systems to modern, maintainable platforms without losing your data.',
  },
  {
    icon: Server,
    title: 'Backend Engineering',
    text: 'Fast, well-structured services and databases that stay dependable under load.',
  },
];

// true only when the viewport matches the query (used to keep parallax to large screens)
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [query]);
  return matches;
}

export default function SoftwareDevelopmentPage() {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const heroRef = useRef(null);

  // restrained parallax on the illustration (large screens only, never with reduced motion)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '7%']);
  const useParallax = isDesktop && !reduce;

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    } else {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    }
  }, [reduce]);

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.11, delayChildren: 0.15 } },
  };
  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.15 : 0.7, ease: EASE } },
  };

  return (
    <div className="sdp-page">
      <Navbar email="info@Atriowings.in" activeLink="Services" />

      <main className="sdp-main">
        {/* ============================ HERO ============================ */}
        <section className="sdp-hero" ref={heroRef} aria-labelledby="sdp-hero-title">
          {/* illustration in its own right-hand container (about 55% of the width) */}
          <motion.div
            className="sdp-hero-bg"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: reduce ? 0.2 : 1.2, ease: EASE }}
          >
            <motion.div className="sdp-hero-img-wrap" style={useParallax ? { y: parallaxY } : undefined}>
              <img
                src={heroImg}
                alt="Software development illustration: laptop, code editor, tablet and phone with coding and testing interfaces"
                className="sdp-hero-img"
                width="1920"
                height="1080"
                fetchPriority="high"
              />
            </motion.div>
          </motion.div>

          {/* content (about 45% of the width) */}
          <div className="sdp-hero-content-col">

            <motion.div className="sdp-hero-content" variants={stagger} initial="hidden" animate="visible">
              <motion.p className="sdp-eyebrow" variants={rise}>
                <span className="sdp-eyebrow-line" aria-hidden="true" />
                SOFTWARE DEVELOPMENT SERVICES
              </motion.p>

              <motion.h1 id="sdp-hero-title" className="sdp-title" variants={rise}>
                We Build <span className="sdp-grad">Powerful Software Solutions</span> That Move Your
                Business Forward.
              </motion.h1>

              <motion.p className="sdp-desc" variants={rise}>
                We build scalable software solutions that simplify operations, solve business challenges,
                and support long-term growth.
              </motion.p>



              <motion.div className="sdp-actions" variants={rise}>
                <a href={CONTACT_HREF} className="sdp-btn sdp-btn--primary">
                  <span>Contact Us</span>
                  <ArrowUpRight className="sdp-btn-arrow" size={19} strokeWidth={2.5} aria-hidden="true" />
                </a>

              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ============================ SERVICES WE OFFER (orbit) ============================ */}
        <SoftwareServicesShowcase />

        {/* ========================= WHAT WE BUILD (flowing capability path) ========================= */}
        <WhatWeBuild items={WHAT_WE_BUILD} />
        {/* ============================ TECHNOLOGY STACK ============================ */}
        <TechnologyStack />

        {/* ===================== DEVELOPMENT APPROACH (9-step conveyor) ===================== */}
        <DevelopmentApproach />

        {/* ===================== WHY CHOOSE Atriowings ===================== */}
        <WhyChooseAtriowings />

        {/* ===================== FAQ ===================== */}
        <SoftwareFAQ />

        {/* ============================ FINAL CTA ============================ */}
        <section className="webdev-cta-section" id="cta">
          <div className="webdev-container">
            <motion.div
              className="webdev-cta-box"
              initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="webdev-cta-ambient" aria-hidden="true" />
              <div className="cta-grid" aria-hidden="true" />
              <div className="cta-orb cta-orb-a" aria-hidden="true" />
              <div className="cta-orb cta-orb-b" aria-hidden="true" />

              <motion.div
                className="webdev-cta-inner"
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
              >
                <motion.span className="webdev-cta-pill" variants={rise}>START A CONVERSATION</motion.span>

                <motion.h2 className="webdev-cta-title" variants={rise}>
                  Ready to Build Your Next Software Solution?
                </motion.h2>

                <motion.p className="webdev-cta-desc" variants={rise}>
                  Tell us about your idea, and let's explore how the right software solution can support your business.
                </motion.p>

                <motion.div className="webdev-cta-button-group" variants={rise}>
                  <a href={CONTACT_HREF} className="webdev-cta-main-btn">
                    <span>Let's Talk About Your Project</span>
                    <ArrowRight size={18} strokeWidth={2.4} className="cta-arrow" />
                  </a>

                  <a href="mailto:info@Atriowings.in" className="webdev-cta-secondary-btn">
                    <MessageSquare size={17} />
                    <span>info@Atriowings.in</span>
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      <StickyCTA />
      <Footer />
    </div>
  );
}