import { Fragment, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Building2, Receipt, Code2, Users } from 'lucide-react';
import { ROUTES } from '../utils/sectionNav';
import customImg from '../assets/custom software.jpg';
import billingImg from '../assets/billing sw.jpg';
import hrmsImg from '../assets/hrms.webp';
import hms from '../assets/hms.jpg';
import crmImg from '../assets/crm.jpg';
import tuition from '../assets/tuition.png';
import './software-services-orbit.css';

const EASE = [0.22, 1, 0.36, 1];
const CONTACT_HREF = ROUTES.contact;
const AUTO_MS = 3000;
const RESUME_MS = 7000;


const SERVICES = [
  { id: 'custom', icon: Code2, title: 'Custom Software Development', short: 'Custom Software', description: 'Purpose-built applications tailored to your business workflows and requirements.', tags: ['Business Logic', 'Custom Apps'], image: customImg, imageKind: 'photo' },
  
{
  id: 'billing',
  icon: Receipt,
  title: 'Billing Software Development',
  short: 'Billing Software',
  description: 'Smart billing and invoicing solutions with GST calculations, payment tracking, and sales management to streamline business operations.',
  tags: ['GST Billing', 'Invoicing'],
  image: billingImg,
  imageKind: 'cutout' // transparent artwork: no card, no background
},
{
  id: 'hrms',
  icon: Users,
  title: 'HRMS Software Development',
  short: 'HRMS Software',
  description: 'Comprehensive HR management solutions for employee records, attendance, leave management, payroll processing, and HR workflows.',
  tags: ['HR Management', 'Payroll'],
  image: hrmsImg,
  imageKind: 'photo'
},

{
  id: 'hms',
  icon: Building2,
  title: 'Hospital Management System Development',
  short: 'Hospital Management',
  description:
    'Smart hospital management solutions that streamline patient records, doctor appointments, medical billing, and hospital operations through one integrated platform.',
  tags: ['Patient Management', 'Appointments & Billing'],
  image: hms,
  imageKind: 'photo'
},
 {
  id: 'crm',
  icon: Users,
  title: 'CRM Software Development',
  short: 'CRM Software',
  description:
    'Custom CRM solutions that help businesses manage customer relationships, track leads, automate sales workflows, and improve customer engagement through a centralized platform.',
  tags: ['Lead Management', 'Sales Automation'],
  image: crmImg,
  imageKind: 'photo'
},
{
  id: 'Tuition',
  icon: Users,
  title: 'Tuition Software Development',
  short: 'Tuition Software',
  description:
    'Custom tuition management software that helps coaching centres and educational institutions manage student admissions, attendance, fee collection, class schedules, exams, and academic performance through a centralized platform.',
  tags: ['Student Management', 'Fee Automation'],
  image: tuition,
  imageKind: 'photo'
},
];

/* ------------------------------------------------------------------ *
 *  Fallback illustration for the service that has no photo (Backend & Database)
 * ------------------------------------------------------------------ */
const NAVY = '#0E2A4E';
const BLUE = '#1E7FD4';
const CYAN = '#06A3DA';
const LINE = '#C9DCEF';
const SOFT = '#E6F1FB';

const draw = (delay = 0, dur = 1) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: dur, ease: EASE, delay },
});

function Cylinder({ x, y, w = 76, h = 74, color = BLUE, delay = 0 }) {
  const ry = 10;
  return (
    <motion.g initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay }}>
      <path d={`M${x} ${y} v${h} c0 ${ry * 1.5} ${w} ${ry * 1.5} ${w} 0 v-${h}`} fill="#fff" stroke={color} strokeWidth="2.5" />
      <ellipse cx={x + w / 2} cy={y} rx={w / 2} ry={ry} fill={SOFT} stroke={color} strokeWidth="2.5" />
      <path d={`M${x} ${y + h / 2} c0 ${ry * 1.5} ${w} ${ry * 1.5} ${w} 0`} fill="none" stroke={color} strokeWidth="1.8" opacity="0.6" />
    </motion.g>
  );
}

function BackendArt() {
  const servers = [76, 140, 204];
  const db = [[360, 70], [360, 190]];
  const targets = [[360, 108], [360, 228]];
  return (
    <g>
      {/* server nodes */}
      {servers.map((y, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.1 + i * 0.1 }}>
          <rect x="40" y={y} width="104" height="46" rx="10" fill="#fff" stroke={i === 1 ? BLUE : CYAN} strokeWidth="2.5" />
          <rect x="54" y={y + 15} width="46" height="7" rx="3.5" fill={i === 1 ? BLUE : CYAN} />
          <rect x="54" y={y + 28} width="32" height="5" rx="2.5" fill={LINE} />
          <motion.circle cx="124" cy={y + 23} r="5" fill={CYAN} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4 }} />
        </motion.g>
      ))}
      {/* request paths: servers -> router -> databases */}
      {servers.map((y, i) => (
        <motion.path key={`a${i}`} d={`M144 ${y + 23} C 190 ${y + 23} 190 160 232 160`} fill="none" stroke={LINE} strokeWidth="2.5" {...draw(0.3 + i * 0.1, 0.8)} />
      ))}
      {targets.map(([x, y], i) => (
        <motion.path key={`b${i}`} d={`M248 160 C 300 160 300 ${y} ${x - 4} ${y}`} fill="none" stroke={LINE} strokeWidth="2.5" {...draw(0.6 + i * 0.1, 0.8)} />
      ))}
      {servers.map((y, i) => (
        <motion.circle key={`p${i}`} r="4.5" cx={144} cy={y + 23} fill={CYAN} initial={{ opacity: 0 }} animate={{ cx: [144, 232], cy: [y + 23, 160], opacity: [0, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 1 + i * 0.5, ease: 'easeInOut' }} />
      ))}
      {targets.map(([x, y], i) => (
        <motion.circle key={`q${i}`} r="4.5" cx={248} cy={160} fill={BLUE} initial={{ opacity: 0 }} animate={{ cx: [248, x - 4], cy: [160, y], opacity: [0, 1, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: 1.4 + i * 0.6, ease: 'easeInOut' }} />
      ))}
      <motion.circle cx="240" cy="160" r="16" fill={NAVY} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.5 }} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <path d="M233 160h14M242 154l6 6-6 6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* databases */}
      {db.map(([x, y], i) => (
        <Cylinder key={i} x={x} y={y} color={i ? BLUE : CYAN} delay={0.4 + i * 0.15} />
      ))}
    </g>
  );
}

const HEADING = 'Software Development Services'.split(' ');

function useMatch(query) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}

export default function SoftwareServicesShowcase() {
  const reduce = useReducedMotion();
  const isMobile = useMatch('(max-width: 1023px)');
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [held, setHeld] = useState(false);
  const holdRef = useRef(null);
  const paused = hovering || held;

  // ONE timer: moves to the next service; stops while hovered, recently clicked, or off screen
  useEffect(() => {
    if (reduce || paused || !inView) return undefined;
    const id = setTimeout(() => setActive((a) => (a + 1) % SERVICES.length), AUTO_MS);
    return () => clearTimeout(id);
  }, [active, reduce, paused, inView]);
  useEffect(() => () => clearTimeout(holdRef.current), []);

  const select = (i) => {
    setActive(i);
    setHeld(true);
    clearTimeout(holdRef.current);
    holdRef.current = setTimeout(() => setHeld(false), RESUME_MS);
  };

  const wordVars = {
    hidden: { y: reduce ? 0 : '110%', opacity: reduce ? 1 : 0 },
    visible: { y: 0, opacity: 1, transition: { duration: reduce ? 0.1 : 0.7, ease: EASE } },
  };
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 0.7, ease: EASE, delay: reduce ? 0 : delay },
  });

  const contentMotion = isMobile
    ? { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: reduce ? 0.1 : 0.45, ease: EASE } }
    : { initial: { opacity: 0, x: reduce ? 0 : 18 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, transition: { duration: 0.12 } }, transition: { duration: reduce ? 0.1 : 0.5, ease: EASE, delay: reduce ? 0 : 0.28 } };

  return (
    <section className="sdp-sv" id="our-services" ref={rootRef} aria-labelledby="sdp-sv-title">
      <div className="sdp-sv-grid-bg" aria-hidden="true" />
      <div className="sdp-sv-inner">
        <header className="sdp-sv-head">
          <motion.p className="sdp-sv-eyebrow" {...fadeUp(0)}>
            <span className="sdp-sv-eyebrow-line" aria-hidden="true" />
            SOFTWARE CAPABILITIES
          </motion.p>
          <motion.h2
            id="sdp-sv-title"
            className="sdp-sv-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.1 }}
          >
            {HEADING.map((w, i) => (
              <Fragment key={i}>
                <span className="sdp-sv-word">
                  <motion.span className="sdp-sv-word-in" variants={wordVars}>
                    {w}
                  </motion.span>
                </span>
                {i < HEADING.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </motion.h2>
          <motion.span
            className="sdp-sv-underline"
            aria-hidden="true"
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduce ? 0.1 : 1, ease: EASE, delay: reduce ? 0 : 0.6 }}
          />
          <motion.p className="sdp-sv-desc" {...fadeUp(0.3)}>
            From custom business applications to enterprise platforms, we engineer reliable software that
            simplifies workflows, connects systems, and scales with your business.
          </motion.p>
        </header>

        {/* six panels that open one at a time: the open panel expands, the others fold into slim strips */}
        <motion.ul
          className="sdp-sv-panels"
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: reduce ? 0.1 : 0.8, ease: EASE, delay: reduce ? 0 : 0.2 }}
        >
          {SERVICES.map((s, i) => {
            const on = i === active;
            const Icon = s.icon;
            return (
              <li key={s.id} className={`sdp-sv-panel${on ? ' is-on' : ''}`}>
                <button
                  type="button"
                  className="sdp-sv-head-btn"
                  aria-expanded={on}
                  aria-controls={`sdp-sv-body-${s.id}`}
                  aria-label={s.title}
                  onClick={() => select(i)}
                >
                  <span className="sdp-sv-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="sdp-sv-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={2.1} />
                  </span>
                  <span className="sdp-sv-short" aria-hidden="true">{s.short}</span>
                </button>

                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div key="body" id={`sdp-sv-body-${s.id}`} className="sdp-sv-body" {...contentMotion}>
                      <div className="sdp-sv-body-inner">
                        <div className="sdp-sv-text">
                          <h3 className="sdp-sv-name">{s.title}</h3>
                          <p className="sdp-sv-copy">{s.description}</p>
                          <ul className="sdp-sv-tags">
                            {s.tags.map((t) => (
                              <li key={t}>{t}</li>
                            ))}
                          </ul>
                          <a href={CONTACT_HREF} className="sdp-sv-link">
                            <span>Discuss this service</span>
                            <ArrowUpRight size={17} strokeWidth={2.5} aria-hidden="true" />
                          </a>
                        </div>
                        <div className={`sdp-sv-art${s.image ? ` has-img is-${s.imageKind}` : ''}`}>
                          {s.image ? (
                            <motion.img
                              src={s.image}
                              alt={`${s.title} illustration`}
                              className="sdp-sv-img"
                              loading="lazy"
                              decoding="async"
                              draggable="false"
                              initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: reduce ? 0.1 : 0.6, ease: EASE, delay: reduce ? 0 : 0.4 }}
                            />
                          ) : (
                            <svg viewBox="0 0 480 320" role="img" aria-label={`${s.title} illustration`} focusable="false">
                              <BackendArt />
                            </svg>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {on && (
                  <span className="sdp-sv-progress" aria-hidden="true">
                    <motion.span
                      key={`${active}-${paused}-${inView}`}
                      className="sdp-sv-progress-fill"
                      initial={{ scaleX: reduce || paused ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: reduce || paused ? 0.01 : AUTO_MS / 1000, ease: 'linear' }}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}