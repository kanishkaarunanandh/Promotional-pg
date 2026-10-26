import { Fragment, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock, Cloud, Code2, Headphones, Link2, Settings, ShieldCheck, Users } from 'lucide-react';
import { ROUTES } from '../utils/sectionNav';
import './software-faq.css';

const EASE = [0.22, 1, 0.36, 1];
const CONTACT_HREF = ROUTES.contact;

const FAQS = [
  { id: 'types', icon: Code2, q: 'What types of software do you develop?', a: 'We develop custom business applications, enterprise systems, SaaS products, backend services, and API integrations based on your business requirements.' },
  { id: 'workflow', icon: Settings, q: 'Can you build software tailored to our existing workflow?', a: 'Yes. We first understand your workflows and requirements, then plan and develop software around your operational needs.' },
  { id: 'time', icon: Clock, q: 'How long does a software development project take?', a: 'Timelines depend on the project scope, complexity, integrations, and requirements. After an initial discussion, we can define a suitable scope and estimated timeline.' },
  { id: 'integrate', icon: Link2, q: 'Can you integrate with our existing systems?', a: 'Yes. Where technically feasible, we can integrate software with existing databases, APIs, payment gateways, CRMs, and other business systems.' },
  { id: 'secure', icon: ShieldCheck, q: 'Will the software be scalable and secure?', a: 'We consider architecture, access control, data protection, performance, and maintainability throughout development. The specific approach depends on the solution and its requirements.' },
  { id: 'support', icon: Headphones, q: 'Do you provide maintenance and support after launch?', a: "We can discuss post-launch maintenance, troubleshooting, improvements, and ongoing support based on your project's needs and agreed scope." },
  { id: 'legacy', icon: Cloud, q: 'Can you modernize our existing legacy application?', a: 'Yes. We can assess your existing system and identify opportunities to improve its architecture, usability, maintainability, and performance while considering data and integration requirements.' },
  { id: 'start', icon: Users, q: 'How do we get started?', a: 'Contact us with your idea, current challenges, or project requirements. We can discuss your goals and determine the next steps.' },
];

const HEADING = ['Frequently', 'Asked', 'Questions'];

function Faq({ item, index, open, onToggle, base, reduce }) {
  const Icon = item.icon;
  const bid = `${base}-q-${item.id}`;
  const pid = `${base}-a-${item.id}`;
  return (
    <li className={`sdp-faq-item${open ? ' is-open' : ''}`}>
      <h3 className="sdp-faq-q">
        <button type="button" id={bid} className="sdp-faq-btn" aria-expanded={open} aria-controls={pid} onClick={() => onToggle(index)}>
          <span className="sdp-faq-idx" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="sdp-faq-ico" aria-hidden="true"><Icon size={20} strokeWidth={1.8} /></span>
          <span className="sdp-faq-text">{item.q}</span>
          <span className="sdp-faq-plus" aria-hidden="true"><i /><i /></span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="a"
            id={pid}
            role="region"
            aria-labelledby={bid}
            className="sdp-faq-panel"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
          >
            <p className="sdp-faq-a">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function QMark() {
  return (
    <svg className="sdp-faq-art" viewBox="0 0 460 230" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sdp-faq-bub" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#06A3DA" />
          <stop offset="1" stopColor="#1E7FD4" />
        </linearGradient>
      </defs>
      <ellipse cx="230" cy="128" rx="214" ry="66" transform="rotate(-10 230 128)" fill="none" stroke="#BCD6EE" strokeWidth="1.2" />
      <ellipse cx="230" cy="128" rx="170" ry="48" transform="rotate(14 230 128)" fill="none" stroke="#D3E4F4" strokeWidth="1.2" />
      <g className="sdp-faq-fl sdp-faq-fl--a">
        <circle cx="106" cy="118" r="40" fill="#fff" stroke="#D6E6F6" strokeWidth="1.5" />
        <path d="M82 148l-10 26 32-14z" fill="#fff" stroke="#D6E6F6" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="106" cy="118" r="39" fill="#fff" />
        <text x="106" y="134" textAnchor="middle" fontSize="46" fontWeight="800" fill="#1E7FD4" fontFamily="inherit">?</text>
      </g>
      <g className="sdp-faq-fl sdp-faq-fl--b">
        <path d="M196 150l-22 34 46-20z" fill="url(#sdp-faq-bub)" />
        <circle cx="232" cy="104" r="62" fill="url(#sdp-faq-bub)" />
        <text x="232" y="128" textAnchor="middle" fontSize="72" fontWeight="800" fill="#fff" fontFamily="inherit">?</text>
      </g>
      <g className="sdp-faq-fl sdp-faq-fl--c">
        <circle cx="350" cy="150" r="42" fill="#fff" stroke="#D6E6F6" strokeWidth="1.5" />
        <path d="M376 182l16 24-38-12z" fill="#fff" stroke="#D6E6F6" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="350" cy="150" r="41" fill="#fff" />
        <text x="350" y="168" textAnchor="middle" fontSize="48" fontWeight="800" fill="#1E7FD4" fontFamily="inherit">?</text>
      </g>
      <circle cx="160" cy="62" r="5" fill="#1E7FD4" />
      <circle cx="120" cy="196" r="9" fill="#1E7FD4" />
      <g className="sdp-faq-fl sdp-faq-fl--c"><path d="M380 38l44-16-18 38-8-14-14-2z" fill="#1E7FD4" /><path d="M398 44l-4 16 10-10z" fill="#0E2A4E" fillOpacity="0.25" /></g>
    </svg>
  );
}

export default function SoftwareFAQ() {
  const reduce = useReducedMotion();
  const base = useId().replace(/:/g, '');
  const [open, setOpen] = useState(0);
  const toggle = (i) => setOpen((o) => (o === i ? -1 : i));

  return (
    <section className="sdp-faq" aria-labelledby="sdp-faq-title">
      <div className="sdp-faq-inner">
        <div className="sdp-faq-left">
          <motion.p className="sdp-faq-eyebrow" initial={reduce ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
            <span className="sdp-faq-eyebrow-line" aria-hidden="true" />
            NEED TO KNOW MORE?
          </motion.p>
          <motion.h2 className="sdp-faq-title" id="sdp-faq-title" initial={reduce ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.6 }}>
            {HEADING.map((w, i) => (
              <Fragment key={w}>
                {i > 0 ? ' ' : null}
                <span className="sdp-faq-word">
                  <motion.span className="sdp-faq-word-in" variants={{ hidden: { y: '110%' }, visible: { y: 0 } }} transition={{ duration: 0.7, ease: EASE, delay: 0.08 * i }}>{w}</motion.span>
                </span>
              </Fragment>
            ))}
          </motion.h2>
          <motion.p className="sdp-faq-desc" initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}>
            Find answers to common questions about our software development services, process, and collaboration.
          </motion.p>
          <div className="sdp-faq-contact">
            <QMark />
            <p className="sdp-faq-contact-line"><strong>Still have questions?</strong> Let&rsquo;s talk.</p>
            <a href={CONTACT_HREF} className="sdp-faq-cta">
              Contact Us <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <ul className="sdp-faq-list">
          {FAQS.map((f, i) => (
            <Faq key={f.id} item={f} index={i} open={open === i} onToggle={toggle} base={base} reduce={reduce} />
          ))}
        </ul>
      </div>
    </section>
  );
}