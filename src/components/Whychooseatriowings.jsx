import { Fragment, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, useScroll } from 'framer-motion';
import { ArrowRight, BadgeCheck, MessagesSquare, ShieldCheck, Target, TrendingUp, Users } from 'lucide-react';
import { ROUTES } from '../utils/sectionNav';
import './why-choose-atriowings.css';

const EASE = [0.22, 1, 0.36, 1];
const CONTACT_HREF = ROUTES.contact;

const POINTS = [
  { id: 'business', icon: Target, title: 'Business-First Engineering', text: 'We begin with your business goals and workflows to build solutions that solve real problems.' },
  { id: 'scale', icon: TrendingUp, title: 'Built to Scale', text: 'We design flexible architectures that can evolve as your users, data, and requirements grow.' },
  { id: 'quality', icon: BadgeCheck, title: 'Quality at Every Stage', text: 'We integrate testing, code quality, and validation throughout the development lifecycle.' },
  { id: 'collab', icon: MessagesSquare, title: 'Transparent Collaboration', text: 'We maintain clear communication, shared priorities, and visibility throughout the project.' },
  { id: 'secure', icon: ShieldCheck, title: 'Secure by Design', text: 'We consider data protection, access control, and security from the beginning of development.' },
  { id: 'partner', icon: Users, title: 'Long-Term Partnership', text: 'We build maintainable solutions and help you plan for future improvements and evolving needs.' },
];

const HEADING = ['Why Choose', 'Atriowings?'];

/* ---------------- isometric "software core" illustration (inline SVG) ---------------- */
const TILE = { fill: '#fff', stroke: '#E1ECF8', strokeWidth: 1.2 };

function Tile({ x, y, cls, children }) {
  return (
    <g className={`sdp-why-tile ${cls}`}>
      <g transform={`translate(${x} ${y})`}>
        <rect x="-30" y="-30" width="60" height="60" rx="15" {...TILE} filter="url(#sdp-why-sh)" />
        {children}
      </g>
    </g>
  );
}

function SystemDiagram() {
  const gear = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg className="sdp-why-svg" viewBox="0 0 480 400" role="img" aria-label="A software core surrounded by connected modules: interface, security, cloud, database and configuration">
      <defs>
        <linearGradient id="sdp-why-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#06A3DA" />
          <stop offset="1" stopColor="#1E7FD4" />
        </linearGradient>
        <radialGradient id="sdp-why-aura" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#06A3DA" stopOpacity="0.28" />
          <stop offset="1" stopColor="#06A3DA" stopOpacity="0" />
        </radialGradient>
        <filter id="sdp-why-sh" x="-40%" y="-40%" width="180%" height="190%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#1E7FD4" floodOpacity="0.18" />
        </filter>
      </defs>

      <ellipse cx="240" cy="215" rx="215" ry="150" fill="url(#sdp-why-aura)" />
      <ellipse cx="240" cy="212" rx="196" ry="118" transform="rotate(-8 240 212)" fill="none" stroke="#BCD6EE" strokeWidth="1.2" />
      <ellipse cx="240" cy="212" rx="160" ry="92" transform="rotate(10 240 212)" fill="none" stroke="#D5E5F5" strokeWidth="1.1" strokeDasharray="2 6" />
      {[[110, 128], [292, 104], [396, 228], [76, 282], [262, 322]].map(([x, y], i) => (
        <circle key={`d${i}`} className="sdp-why-spark" cx={x} cy={y} r={i % 2 ? 5 : 4} fill="#1E7FD4" style={{ animationDelay: `${-i * 0.9}s` }} />
      ))}

      {/* glowing platform */}
      <ellipse cx="240" cy="262" rx="112" ry="38" fill="#DCEBF9" />
      <ellipse cx="240" cy="254" rx="104" ry="35" fill="#fff" stroke="#D3E4F5" />
      <ellipse cx="240" cy="246" rx="84" ry="28" fill="#EAF3FC" stroke="#CFE2F4" />
      <g className="sdp-why-core">
        <ellipse cx="240" cy="236" rx="66" ry="46" fill="#06A3DA" opacity="0.22" className="sdp-why-pulse" />
        <ellipse cx="240" cy="232" rx="58" ry="40" fill="url(#sdp-why-g)" />
        <ellipse cx="240" cy="220" rx="46" ry="24" fill="#fff" opacity="0.14" />
        <text x="240" y="244" textAnchor="middle" fontSize="34" fontWeight="800" fill="#fff" fontFamily="ui-monospace, Menlo, Consolas, monospace">{'</>'}</text>
      </g>

      <Tile x={238} y={62} cls="sdp-why-tile--a">
        <rect x="-16" y="-13" width="32" height="26" rx="4" fill="#fff" stroke="#1E7FD4" strokeWidth="2" />
        <rect x="-16" y="-13" width="32" height="7" rx="3" fill="#1E7FD4" />
        <rect x="-11" y="-1" width="9" height="3" rx="1.5" fill="#06A3DA" />
        <rect x="-11" y="5" width="22" height="3" rx="1.5" fill="#9FC3E6" />
      </Tile>
      <Tile x={86} y={168} cls="sdp-why-tile--b">
        <path d="M0 -17 L15 -11 V3 C15 11 8 16 0 19 C-8 16 -15 11 -15 3 V-11 Z" fill="#1E7FD4" />
        <path d="M0 -17 L15 -11 V3 C15 11 8 16 0 19 Z" fill="#0E2A4E" opacity="0.28" />
        <path d="M-6 1 L-1 6 L7 -4" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </Tile>
      <Tile x={394} y={146} cls="sdp-why-tile--c">
        <path d="M-14 11 a8 8 0 0 1 1-16 a11 11 0 0 1 21-2 a9 9 0 0 1 3 18 z" fill="#1E7FD4" />
        <path d="M-14 11 a8 8 0 0 1 1-16 a11 11 0 0 1 8-4 v20 z" fill="#06A3DA" opacity="0.55" />
      </Tile>
      <Tile x={140} y={326} cls="sdp-why-tile--d">
        <ellipse cx="0" cy="-12" rx="14" ry="5.5" fill="#06A3DA" />
        <path d="M-14 -12 V0 a14 5.5 0 0 0 28 0 V-12 a14 5.5 0 0 1 -28 0z" fill="#1E7FD4" />
        <path d="M-14 0 V12 a14 5.5 0 0 0 28 0 V0 a14 5.5 0 0 1 -28 0z" fill="#1E7FD4" />
        <path d="M-14 -6 a14 5.5 0 0 0 28 0 M-14 6 a14 5.5 0 0 0 28 0" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.4" />
      </Tile>
      <Tile x={344} y={318} cls="sdp-why-tile--e">
        <g className="sdp-why-gear">
          {gear.map((a) => <rect key={a} x="-3" y="-17" width="6" height="8" rx="1.5" fill="#1E7FD4" transform={`rotate(${a})`} />)}
          <circle r="12" fill="#1E7FD4" />
          <circle r="5" fill="#fff" />
        </g>
      </Tile>
    </svg>
  );
}

function Point({ point, index, active, onActive, reduce }) {
  const ref = useRef(null);
  const Icon = point.icon;
  // an entry becomes "active" when it crosses the middle band of the viewport
  const inMiddle = useInView(ref, { margin: '-42% 0px -42% 0px' });
  return (
    <motion.li
      ref={ref}
      className={`sdp-why-item${active === index ? ' is-on' : ''}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.04 }}
      tabIndex={0}
      onMouseEnter={() => onActive(index)}
      onFocus={() => onActive(index)}
    >
      <InMiddle flag={inMiddle} onHit={() => onActive(index)} />
      <span className="sdp-why-dot" aria-hidden="true" />
      <span className="sdp-why-num">{String(index + 1).padStart(2, '0')}</span>
      <span className="sdp-why-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.8} /></span>
      <div className="sdp-why-copy">
        <h3 className="sdp-why-name">{point.title}</h3>
        <p className="sdp-why-text">{point.text}</p>
      </div>
    </motion.li>
  );
}

// tiny helper so the scroll-driven activation runs inside an effect, not during render
function InMiddle({ flag, onHit }) {
  useEffect(() => { if (flag) onHit(); }, [flag]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function WhyChooseAtriowings() {
  const reduce = useReducedMotion();
  const listRef = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 65%', 'end 55%'] });

  return (
    <section className="sdp-why" id="why-choose" aria-labelledby="sdp-why-title" style={{ scrollMarginTop: '110px' }}>
      <div className="sdp-why-inner">
        <div className="sdp-why-left">
          <motion.p className="sdp-why-eyebrow" initial={reduce ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
            <span className="sdp-why-eyebrow-line" aria-hidden="true" />
            THE Atriowings ADVANTAGE
          </motion.p>
          <motion.h2 className="sdp-why-title" id="sdp-why-title" initial={reduce ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {HEADING.map((w, i) => (
              <Fragment key={w}>
                <span className={`sdp-why-word sdp-why-word--${i}`}>
                  <motion.span className="sdp-why-word-in" variants={{ hidden: { y: '110%' }, visible: { y: 0 } }} transition={{ duration: 0.7, ease: EASE, delay: 0.08 * i }}>{w}</motion.span>
                </span>
              </Fragment>
            ))}
          </motion.h2>
          <motion.p className="sdp-why-desc" initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}>
            We combine technical expertise with a practical understanding of business needs to deliver software that works reliably today and grows with you tomorrow.
          </motion.p>
          <div className="sdp-why-visual"><SystemDiagram /></div>
          <motion.div className="sdp-why-cta-wrap" initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}>
            <a href={CONTACT_HREF} className="sdp-why-cta">
              <span className="sdp-why-cta-label">Discuss Your Project</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </motion.div>
        </div>

        <ol className="sdp-why-list" ref={listRef}>
          <span className="sdp-why-track" aria-hidden="true">
            <motion.span className="sdp-why-fill" style={reduce ? { transform: 'scaleY(1)' } : { scaleY: scrollYProgress }} />
          </span>
          {POINTS.map((p, i) => (
            <Point key={p.id} point={p} index={i} active={active} onActive={setActive} reduce={reduce} />
          ))}
        </ol>
      </div>
    </section>
  );
}