import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, BarChart3, Lightbulb, MessageSquare, Settings, Target, TrendingUp } from 'lucide-react';
import { ROUTES } from '../utils/sectionNav';
import './dmp-why.css'; // import AFTER the page stylesheet

const EASE = [0.22, 1, 0.36, 1];
const CONTACT_HREF = ROUTES.contact;
const CYCLE_MS = 3600;

const REASONS = [
  { id: 'strategy', icon: Target, title: 'Strategy Built Around Your Goals', text: 'Every campaign starts with your business objectives, target audience, and growth priorities.' },
  { id: 'data', icon: BarChart3, title: 'Data-Driven Decisions', text: 'We use meaningful performance insights to guide campaign improvements and smarter investments.' },
  { id: 'creative', icon: Lightbulb, title: 'Creative That Captures Attention', text: 'We develop engaging content and campaign concepts that help your brand stand out.' },
  { id: 'performance', icon: TrendingUp, title: 'Performance-Focused Campaigns', text: 'We focus on relevant traffic, quality leads, conversions, and progress toward your goals.' },
  { id: 'comms', icon: MessageSquare, title: 'Transparent Communication', text: 'We provide clear updates, explain performance, and align our work with your priorities.' },
  { id: 'optimize', icon: Settings, title: 'Continuous Optimization', text: 'We review campaign results and refine our approach as audience behavior and business needs evolve.' },
];

const HEAD = ['Why Choose Atriowings for', 'Digital Marketing?'];

export default function DmpWhy() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // one gentle timer walks the highlight along the timeline; hover/focus takes over
  useEffect(() => {
    if (reduce || paused || !inView) return undefined;
    const id = setTimeout(() => setActive((a) => (a + 1) % REASONS.length), CYCLE_MS);
    return () => clearTimeout(id);
  }, [active, paused, inView, reduce]);

  const take = (i) => { setActive(i); setPaused(true); };

  return (
    <section id="why-choose" className="dmpw" aria-labelledby="dmp-why-title" ref={ref} style={{ scrollMarginTop: '110px' }}>
      <span id="dmp-why" style={{ position: 'absolute', top: 0 }} aria-hidden="true" />
      <div className="dmpw-bg" aria-hidden="true">
        <span className="dmpw-arc dmpw-arc--a" /><span className="dmpw-arc dmpw-arc--b" />
        <span className="dmpw-dots dmpw-dots--a" /><span className="dmpw-dots dmpw-dots--b" />
        <motion.span className="dmpw-glow" animate={reduce ? undefined : { x: ['-6%', '8%', '-6%'] }} transition={reduce ? undefined : { duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      </div>

      <div className="dmpw-inner">
        <div className="dmpw-head">
          <motion.p className="dmpw-kicker" initial={reduce ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
            <span className="dmpw-kicker-line" aria-hidden="true" />THE Atriowings ADVANTAGE
          </motion.p>
          <motion.h2 id="dmp-why-title" className="dmpw-title" initial={reduce ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.6 }}>
            {HEAD.map((l, i) => (
              <Fragment key={l}>
                <span className="dmpw-line">
                  <motion.span className={`dmpw-line-in${i ? ' dmpw-grad' : ''}`} variants={{ hidden: { y: '110%' }, visible: { y: 0 } }} transition={{ duration: 0.75, ease: EASE, delay: 0.1 * i }}>{l}</motion.span>
                </span>
              </Fragment>
            ))}
          </motion.h2>
          <motion.span className="dmpw-underline" aria-hidden="true" initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE, delay: 0.3 }} />
          <motion.p className="dmpw-sub" initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: 0.25 }}>
            We combine creative thinking, data-driven decisions, and continuous optimization to turn your digital presence into measurable business growth.
          </motion.p>
        </div>

        <div className="dmpw-timeline" onMouseLeave={() => setPaused(false)}>
          {/* horizontal track (desktop) */}
          <span className="dmpw-track" aria-hidden="true">
            <motion.span className="dmpw-fill" initial={reduce ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1.6, ease: EASE, delay: 0.3 }} />
            {!reduce && (
              <motion.span className="dmpw-pulse" animate={{ left: ['0%', '100%'] }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} />
            )}
          </span>

          <ol className="dmpw-list">
            {REASONS.map((r, i) => {
              const Icon = r.icon;
              const on = i === active;
              return (
                <motion.li
                  key={r.id}
                  className={`dmpw-item${on ? ' is-on' : ''}`}
                  initial={reduce ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.1 * i }}
                  tabIndex={0}
                  onMouseEnter={() => take(i)}
                  onFocus={() => take(i)}
                  onBlur={() => setPaused(false)}
                >
                  <span className="dmpw-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="dmpw-icon" aria-hidden="true"><Icon size={26} strokeWidth={1.8} /></span>
                  <h3 className="dmpw-name">{r.title}</h3>
                  <p className="dmpw-text">{r.text}</p>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <motion.div className="dmpw-cta-wrap" initial={reduce ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}>
          <a href={CONTACT_HREF} className="dmpw-cta">
            <span className="dmpw-cta-label">Let&rsquo;s Grow Your Business</span>
            <ArrowRight className="dmpw-cta-arrow" size={19} strokeWidth={2.5} aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}