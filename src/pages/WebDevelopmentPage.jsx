import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import WebDevHero from '../components/WebDevHero';
import {
  Globe,
  ShoppingBag,
  Smartphone,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Code2,
  MessageSquare,
  Gauge,
  Target,
  LifeBuoy
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ROUTES } from '../utils/sectionNav';
import './WebDevelopmentPage.css';
import '../components/capabilities-orbit.css';
import '../components/why-choose-cta.css';
import capabilitiesTeamImg from '../assets/web-dev-capabilities-team.png';
import ApproachSection from '../components/approach-section';
import DevelopmentPhases from '../components/DevelopmentPhases';
import StickyCTA from '../components/StickyCTA';
import FaqSection from '../components/FaqSection';
import TechnologyShowcase from '../components/Technologyshowcase'

// Six cards, 60° apart, starting at 12 o'clock and going clockwise.
const ORBIT_ANGLES = [-90, -30, 30, 90, 150, 210];
const ORBIT_RX = 41; // horizontal radius, % of container width
const ORBIT_RY = 37; // vertical radius, % of container height

const getOrbitPosition = (index) => {
  const rad = (ORBIT_ANGLES[index] * Math.PI) / 180;
  return {
    '--x': `${50 + ORBIT_RX * Math.cos(rad)}%`,
    '--y': `${50 + ORBIT_RY * Math.sin(rad)}%`,
  };
};


const ORBIT_ENTRANCE_S = 0.4;  // each card's fade / scale duration
const ORBIT_GAP_S = 0.35;      // pause between one card finishing and the next starting
const ORBIT_STAGGER_S = ORBIT_ENTRANCE_S + ORBIT_GAP_S; // start-to-start spacing
const ORBIT_HOLD_MS = 6000;   // all six stay visible this long after card 6 has fully appeared
const ORBIT_HIDE_S = 0.5;      // all cards fade out together
const ORBIT_EMPTY_MS = 400;    // nothing visible before the next cycle
const ORBIT_RESET_MS = ORBIT_HIDE_S * 1000 + ORBIT_EMPTY_MS;
// time from "cycle starts" to "sixth card shown and held"
const ORBIT_CYCLE_SHOW_MS =
  Math.round(((6 - 1) * ORBIT_STAGGER_S + ORBIT_ENTRANCE_S) * 1000) + ORBIT_HOLD_MS;

const makeOrbitCardVariants = (reduce) => ({
  hidden: {
    opacity: reduce ? 1 : 0,
    scale: reduce ? 1 : 0.95,
    transition: { duration: reduce ? 0 : ORBIT_HIDE_S, ease: 'easeInOut' },
  },
  visible: (index) => ({
    opacity: 1,
    scale: 1,
    transition: reduce
      ? { duration: 0 }
      : { duration: ORBIT_ENTRANCE_S, delay: index * ORBIT_STAGGER_S, ease: [0.22, 1, 0.36, 1] },
  }),
});


// 6 Dedicated Services
const SERVICES_OFFERED = [
  {
    icon: Globe,
    title: 'Business Website Development',
    description: 'Professional, bespoke websites engineered to establish high authority, communicate your services clearly, and turn visitors into qualified inquiries.',
    tags: ['Brand Credibility', 'Custom CMS', 'Lead Generation'],
  },
  {
    icon: Code2,
    title: 'Custom Web Applications',
    description: 'Interactive web applications tailored directly to your business workflows, cloud systems, and real-time operational demands.',
    tags: ['React Architecture', 'Cloud APIs', 'Dynamic Dashboards'],
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Development',
    description: 'Scalable online shopping experiences built with smooth product discovery, secure checkout workflows, and automated inventory sync.',
    tags: ['Payment Gateways', 'Inventory Sync', 'Conversion Focused'],
  },
  {
    icon: Smartphone,
    title: 'Responsive Web Design',
    description: 'Fluid, multi-breakpoint interfaces that adapt smoothly and intuitively across smartphones, tablets, laptops, and ultra-wide desktop monitors.',
    tags: ['Mobile-First', 'Touch-Optimized', 'Pixel Perfection'],
  },
  {
    icon: Sparkles,
    title: 'Website Redesign',
    description: 'Comprehensive modernization of legacy websites to elevate visual aesthetics, streamline navigation, and drastically boost performance and UX.',
    tags: ['UI/UX Overhaul', 'Speed Boost', 'Brand Refresh'],
  },
  {
    icon: ShieldCheck,
    title: 'Website Maintenance',
    description: 'Dedicated ongoing technical support, security hardening, dependency updates, and continuous speed optimization to keep your site pristine.',
    tags: ['Security Patches', 'Speed Audits', 'Uptime Monitoring'],
  },
];

// Why Choose Atriowings Highlights (Bento Grid)
const WHY_CHOOSE_ITEMS = [
  {
    icon: Smartphone,
    size: 'wide',
    visual: 'devices',
    title: 'Responsive & User-Friendly Experiences',
    description: 'Every interface is engineered for frictionless navigation and accessible interactions on every device size.',
  },
  {
    icon: Gauge,
    visual: 'meter',
    title: 'Performance-Focused Development',
    description: 'Speed is a feature. We optimize assets, code-splitting, and load times to achieve stellar Core Web Vitals.',
  },
  {
    icon: Target,
    title: 'Solutions Aligned with Business Goals',
    description: 'We do not build generic templates; every module is tailored to drive measurable business traction and retention.',
  },
  {
    icon: Code2,
    title: 'Maintainable and Scalable Code',
    description: 'Clean, documented component architectures that can easily grow alongside your evolving business roadmap.',
  },
  {
    icon: MessageSquare,
    title: 'Clear Communication Throughout',
    description: 'Transparent milestone reporting, collaborative design reviews, and proactive project management at every step.',
  },
  {
    icon: LifeBuoy,
    size: 'wide',
    visual: 'pulse',
    title: 'Ongoing Support and Improvements',
    description: 'Long-term partnership with proactive maintenance, security patches, and iterative enhancements post-launch.',
  },
];

function BenefitVisual({ type }) {
  if (type === 'devices') {
    return (
      <div className="viz-devices" aria-hidden="true">
        <span className="viz-dev viz-dev-phone" />
        <span className="viz-dev viz-dev-tablet" />
        <span className="viz-dev viz-dev-desktop" />
      </div>
    );
  }
  if (type === 'meter') {
    return (
      <div className="viz-meter" aria-hidden="true">
        <span className="viz-meter-fill" />
      </div>
    );
  }
  if (type === 'pulse') {
    return (
      <svg className="viz-pulse" viewBox="0 0 240 48" preserveAspectRatio="none" aria-hidden="true">
        <path className="viz-pulse-track" d="M0 24 H70 L82 24 L92 6 L104 42 L114 14 L122 24 H240" pathLength="100" />
        <path className="viz-pulse-line" d="M0 24 H70 L82 24 L92 6 L104 42 L114 14 L122 24 H240" pathLength="100" />
      </svg>
    );
  }
  return null;
}

function BenefitCard({ item, variants }) {
  const Icon = item.icon;

  // Cursor-follow spotlight: writes CSS variables directly, no re-render.
  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <motion.article
      className={`bento-card${item.size === 'wide' ? ' is-wide' : ''}`}
      variants={variants}
      onPointerMove={handlePointerMove}
    >
      <div className="bento-icon">
        <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
      </div>
      <h3 className="bento-title">{item.title}</h3>
      <p className="bento-desc">{item.description}</p>
      {item.visual && <BenefitVisual type={item.visual} />}
    </motion.article>
  );
}

export default function WebDevelopmentPage() {
  const shouldReduceMotion = useReducedMotion();

  // Deep links such as /services/web-development#services-we-offer: when the page is opened
  // from another page the section does not exist yet at load time, so wait for it, then scroll.
  useEffect(() => {
    let timer;
    const scrollToHash = () => {
      clearInterval(timer);
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      let tries = 0;
      timer = setInterval(() => {
        const el = document.getElementById(id);
        tries += 1;
        if (el || tries > 30) {
          clearInterval(timer);
          el?.scrollIntoView({ behavior: shouldReduceMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }, 100);
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      clearInterval(timer);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, [shouldReduceMotion]);

  // Services orbit: viewport detection + repeating entrance cycle
  const orbitRef = useRef(null);
  const orbitInView = useInView(orbitRef, { amount: 0.25 }); // not "once": it resets on leave
  const [orbitShown, setOrbitShown] = useState(false);
  const orbitCardVariants = makeOrbitCardVariants(shouldReduceMotion);

  useEffect(() => {
    // Off screen: hide the cards and run nothing. Reduced motion: static, no loop.
    if (!orbitInView || shouldReduceMotion) {
      return undefined;
    }
    let timerId;
    const runCycle = () => {
      setOrbitShown(true); // cards 1..6 appear one by one (stagger set in the variants)
      timerId = setTimeout(() => {
        setOrbitShown(false); // all six hide together...
        timerId = setTimeout(runCycle, ORBIT_RESET_MS); // ...then restart from card 1
      }, ORBIT_CYCLE_SHOW_MS);
    };
    runCycle();
    return () => {
      clearTimeout(timerId);
      setOrbitShown(false);
    };
  }, [orbitInView, shouldReduceMotion]);

  // Scroll to top on page mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reusable animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
      },
    },
  };

  const bentoContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.1 } },
  };

  const bentoItem = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 32, scale: shouldReduceMotion ? 1 : 0.97 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="webdev-page">
      {/* Sticky Rounded White Navbar */}
      <Navbar email="info@Atriowings.in" activeLink="Home" />

      <main className="webdev-main">
        {/*  1. HERO SECTION */}
        <WebDevHero />

        {/*  2. WEB DEVELOPMENT OVERVIEW */}
        <ApproachSection />

        {/*  3. SERVICES WE OFFER */}
        <section
          className="webdev-services-section"
          id="services-we-offer"
          style={{ scrollMarginTop: '110px' }} /* keeps the heading clear of the sticky navbar */
        >
          <div className="webdev-container">
            <div className="section-header-centered">
              <div className="webdev-eyebrow-wrapper">
                <span className="webdev-eyebrow-accent" aria-hidden="true" />
                <span className="webdev-eyebrow">CAPABILITIES</span>
              </div>
              <h2 className="section-heading">Services We Offer</h2>
              <p className="section-subheading">
                End-to-end web engineering capabilities designed to satisfy diverse commercial requirements, from lean company portals to complex web applications.
              </p>
            </div>

            <div className="capabilities-orbit" ref={orbitRef}>
              <div className="capabilities-orbit-ring" aria-hidden="true" />

              {/* Centre: circular team photo with a continuously rotating gradient ring.
      The outer div only centres it with CSS; the inner motion.div handles the
      entrance, so the two transforms never conflict. */}
              <div className="capabilities-core">
                <motion.div
                  className="capabilities-core-inner"
                  initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="capabilities-core-glow" aria-hidden="true" />
                  <span className="capabilities-core-ring" aria-hidden="true" />
                  <div className="capabilities-core-photo">
                    <img
                      src={capabilitiesTeamImg}
                      alt="Two Atriowings developers collaborating at a computer"
                      className="capabilities-core-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </motion.div>
              </div>

              {SERVICES_OFFERED.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="orbit-slot"
                    style={getOrbitPosition(index)}
                  >
                    <motion.article
                      className="service-offer-card"
                      variants={orbitCardVariants}
                      custom={index}
                      initial="hidden"
                      animate={shouldReduceMotion || orbitShown ? 'visible' : 'hidden'}
                    >
                      <div className="service-offer-header">
                        <div className="service-offer-icon-box">
                          <IconComponent size={24} strokeWidth={2.2} />
                        </div>
                        <span className="service-offer-indicator" aria-hidden="true" />
                      </div>
                      <h3 className="service-offer-title">{item.title}</h3>
                      <p className="service-offer-desc">{item.description}</p>
                      <div className="service-offer-tags">
                        {item.tags.map((tag) => (
                          <span key={tag} className="service-tag">{tag}</span>
                        ))}
                      </div>
                    </motion.article>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. DEVELOPMENT PHASES: OUR METHODOLOGY (7-step animated timeline) */}
        <DevelopmentPhases />

        {/*  5. WHY CHOOSE Atriowings? */}
        <section
          className="webdev-benefits-section"
          id="why-choose"
          style={{ scrollMarginTop: '110px' }} /* keeps the heading clear of the sticky navbar */
        >
          <div className="webdev-container">
            <div className="section-header-centered">
              <div className="webdev-eyebrow-wrapper">
                <span className="webdev-eyebrow-accent" aria-hidden="true" />
                <span className="webdev-eyebrow">VALUE PROPOSITION</span>
              </div>
              <h2 className="section-heading">Why Choose Atriowings?</h2>
              <p className="section-subheading">
                We combine deep technical rigor with commercial pragmatism to deliver websites that perform consistently and scale effortlessly.
              </p>
            </div>

            <motion.div
              className="benefits-bento"
              variants={bentoContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {WHY_CHOOSE_ITEMS.map((item) => (
                <BenefitCard key={item.title} item={item} variants={bentoItem} />
              ))}
            </motion.div>
          </div>
        </section>
        {/* Tech Stack */}
        <TechnologyShowcase />
        {/*  6. FINAL CALL TO ACTION */}
        <section className="webdev-cta-section" id="cta">
          <div className="webdev-container">
            <motion.div
              className="webdev-cta-box"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40, scale: shouldReduceMotion ? 1 : 0.97 }}
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
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
              >
                <motion.span className="webdev-cta-pill" variants={fadeIn}>START A CONVERSATION</motion.span>

                <motion.h2 className="webdev-cta-title" variants={fadeIn}>
                  Ready to Build Your Next Website?
                </motion.h2>

                <motion.p className="webdev-cta-desc" variants={fadeIn}>
                  Tell us about your idea, and let's explore how the right web solution can support your business.
                </motion.p>

                <motion.div className="webdev-cta-button-group" variants={fadeIn}>
                  <a href={ROUTES.contact} className="webdev-cta-main-btn">
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
        <FaqSection />
      </main>

      <Footer />
      <StickyCTA />
    </div>
  );
}