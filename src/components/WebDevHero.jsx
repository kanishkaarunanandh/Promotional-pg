import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroImg from '../assets/web-dev-hero.png'; 
import { ROUTES } from '../utils/sectionNav';
import './webdev-hero.css';

const EASE = [0.22, 1, 0.36, 1];

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

export default function WebDevHero() {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const heroRef = useRef(null);

  // restrained parallax on the picture (large screens only, never with reduced motion)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['0%', '7%']);
  const useParallax = isDesktop && !reduce;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.1 } },
  };
  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.75, ease: EASE } },
  };
  const group = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
  };
  const pop = {
    hidden: { opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: reduce ? 0.2 : 0.6, ease: EASE } },
  };

  return (
    <section className="wdh" id="hero" ref={heroRef} aria-labelledby="wdh-title">
      {/* Picture at the right end of the hero (not a background). Transparent PNG on the navy gradient. */}
      <motion.div
        className="wdh-visual"
        initial={{ opacity: 0, scale: reduce ? 1 : 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduce ? 0.2 : 1.2, ease: EASE }}
      >
        <motion.div className="wdh-visual-wrap" style={useParallax ? { y: parallaxY } : undefined}>
          <img
            src={heroImg}
            alt="Web developer presenting a responsive website design on a tablet"
            className="wdh-visual-img"
            width="1920"
            height="1080"
            fetchPriority="high"
          />
        </motion.div>
      </motion.div>

      <div className="wdh-inner">
        <motion.div className="wdh-content" variants={container} initial="hidden" animate="visible">
          <motion.div className="wdh-eyebrow" variants={rise}>
            <span className="wdh-eyebrow-line" aria-hidden="true" />
            <span>WEB DEVELOPMENT SERVICES</span>
          </motion.div>

          <motion.h1 className="wdh-title" id="wdh-title" variants={rise}>
            Websites Built to Turn Your Ideas Into <span className="wdh-accent">Digital Growth</span>
          </motion.h1>

          <motion.p className="wdh-desc" variants={rise}>
            We design and develop fast, responsive, and user-focused websites that strengthen your brand,
            engage your audience, and support your business goals.
          </motion.p>

          <motion.div className="wdh-actions" variants={group}>
            <motion.a href={ROUTES.contact} className="wdh-btn wdh-btn--primary" variants={pop}>
              <span>Contact Us</span>
              <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}