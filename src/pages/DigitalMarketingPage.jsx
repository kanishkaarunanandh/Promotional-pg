import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StickyCTA from '../components/StickyCTA';
import DigitalMarketinghero from '../components/Digitalmarketinghero.jsx';
import './DigitalMarketingPage.css';
import DmpServices, { DIGITAL_MARKETING_SERVICES } from '../components/DmpServices.jsx';
import Dmptools from '../components/Dmptools.jsx';
import Dmpfaq from '../components/Dmpfaq.jsx';
import Dmpwhy from '../components/Dmpwhy.jsx';
import { ROUTES } from '../utils/sectionNav';

const EASE = [0.22, 1, 0.36, 1];
const CONTACT_HREF = ROUTES.contact;


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

export default function DigitalMarketingPage() {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const heroRef = useRef(null);

  // restrained parallax on the hero image (large screens only, never with reduced motion)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '6%']);
  const useParallax = isDesktop && !reduce;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.11, delayChildren: 0.15 } },
  };
  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.15 : 0.7, ease: EASE } },
  };
  const reveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.15 : 0.6, ease: EASE, delay: reduce ? 0 : i * 0.08 },
    }),
  };
  const view = { once: true, amount: 0.25 };

  return (
    <div className="dmp-page">
      <Navbar email="info@Atriowings.in" activeLink="Services" />

      <main className="dmp-main">
        {/* ============================ HERO ============================ */}
        <DigitalMarketinghero />

        {/* ============================ SERVICES ============================ */}
        <DmpServices />

        {/* Why to choose */}
        <Dmpwhy />

        {/* Tools  */}
        <Dmptools />
        {/* ============================ FINAL CTA ============================ */}
        <section className="dmp-section dmp-final">
          <div className="dmp-container">
            <motion.div className="dmp-final-box" variants={reveal} initial="hidden" whileInView="visible" viewport={view}>
              <h2 className="dmp-final-title">Ready to turn your traffic into growth?</h2>
              <p className="dmp-final-text">
                Tell us about your business and goals, and we will map out the right digital marketing plan for you.
              </p>
              <a href={CONTACT_HREF} className="dmp-btn dmp-btn--primary">
                <span>Get a Free Consultation</span>
                <ArrowRight className="dmp-btn-arrow" size={19} strokeWidth={2.5} aria-hidden="true" />
              </a>
            </motion.div>
          </div>
        </section>
        {/* FAQ */}
        <Dmpfaq />
      </main>

      <StickyCTA />
      <Footer />
    </div>
  );
}