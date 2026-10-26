import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroImg from '../assets/digital-marketing-hero.png'; // transparent PNG, copy into src/assets
import { ROUTES } from '../utils/sectionNav';
import './digital-marketing-hero.css';

const EASE = [0.22, 1, 0.36, 1];
const CONTACT_HREF = ROUTES.contact;

// true only when the viewport matches (keeps the parallax to large screens)
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

/**
 * Props:
 *  servicesId: the id of the services section on the Digital Marketing page (default "dmp-services")
 */
export default function DigitalMarketingHero({ servicesId = 'dmp-services' }) {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const heroRef = useRef(null);

  // restrained parallax on the picture (large screens only, never with reduced motion)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '7%']);
  const useParallax = isDesktop && !reduce;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.14, delayChildren: reduce ? 0 : 0.2 } },
  };
  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.15 : 0.75, ease: EASE } },
  };

  // kept for pages that still link to the services section from here
  // eslint-disable-next-line no-unused-vars
  const goServices = (e) => {
    const el = document.getElementById(servicesId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <section className="dmh" ref={heroRef} aria-labelledby="dmh-title">
      <div className="dmh-glow" aria-hidden="true" />

      {/* Picture at the left end of the hero (not a background), transparent PNG on the navy gradient */}
      <motion.div
        className="dmh-visual"
        initial={{ opacity: 0, scale: reduce ? 1 : 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0.2 : 1.2, ease: EASE }}
      >
        <motion.div className="dmh-visual-wrap" style={useParallax ? { y: parallaxY } : undefined}>
          <img
            src={heroImg}
            alt="Marketing professional using a tablet with social media icons floating above it"
            className="dmh-visual-img"
            width="2504"
            height="1672"
            fetchPriority="high"
          />
        </motion.div>
      </motion.div>

      <div className="dmh-inner">
        <motion.div className="dmh-content" variants={container} initial="hidden" animate="visible">
          <motion.p className="dmh-eyebrow" variants={rise}>
            <span className="dmh-eyebrow-line" aria-hidden="true" />
            DIGITAL MARKETING THAT DRIVES GROWTH
          </motion.p>

          <motion.h1 className="dmh-title" id="dmh-title" variants={rise}>
            Turn Your Digital Presence Into <span className="dmh-grad">Real Business Growth</span>
          </motion.h1>

          <motion.span className="dmh-rule" variants={rise} aria-hidden="true" />

          <motion.p className="dmh-desc" variants={rise}>
            We combine creative strategy, data-driven insights, and performance-focused campaigns to help your brand reach the right audience, generate quality leads, and grow online.
          </motion.p>

          <motion.div className="dmh-actions" variants={rise}>
            <a href={CONTACT_HREF} className="dmh-btn dmh-btn--primary">
              <span>Let&rsquo;s Grow Your Business</span>
              <ArrowRight className="dmh-arrow" size={19} strokeWidth={2.5} aria-hidden="true" />
            </a>
          </motion.div>

          <motion.p className="dmh-trust" variants={rise}>Strategy &bull; Creativity &bull; Performance</motion.p>
        </motion.div>
      </div>
    </section>
  );
}