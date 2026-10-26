import { Fragment, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../utils/sectionNav';
import './dmp-faq.css';

const EASE = [0.22, 1, 0.36, 1];
const CONTACT_HREF = ROUTES.contact;

const FAQS = [
  { id: 'services', q: 'What digital marketing services do you offer?', a: 'We offer SEO, social media marketing, paid advertising, content marketing, email marketing, and performance analytics tailored to business goals.' },
  { id: 'strategy', q: 'How do you develop a digital marketing strategy?', a: 'We consider your goals, target audience, competitors, and current online presence before recommending suitable channels and campaign priorities.' },
  { id: 'seo', q: 'How long does SEO take to show results?', a: 'SEO typically takes several months to show meaningful progress. Timelines vary based on competition, website condition, and the work required.' },
  { id: 'social', q: 'Can you manage our social media accounts?', a: 'Yes. Depending on your requirements, we can help with content planning, creative assets, publishing, audience engagement, and performance tracking.' },
  { id: 'ads', q: 'Do you offer Google Ads and social media advertising?', a: 'Yes. Campaigns can be planned and optimized around your audience, objectives, budget, and conversion goals.' },
  { id: 'measure', q: 'How do you measure campaign performance?', a: 'We track relevant metrics such as traffic, engagement, leads, conversions, and campaign cost to evaluate progress against agreed goals.' },
  { id: 'reports', q: 'Will I receive regular reports?', a: 'Reporting frequency and format can be agreed upon at the beginning of the engagement, with insights into performance and recommended next steps.' },
  { id: 'start', q: 'How can I get started with Atriowings?', a: 'Contact our team to discuss your business goals, current challenges, and priorities. We can then recommend an appropriate approach.' },
];

const HEADING = ['Frequently', 'Asked', 'Questions'];

function Faq({ item, index, open, onToggle, base, reduce }) {
  const bid = `${base}-q-${item.id}`;
  const pid = `${base}-a-${item.id}`;
  return (
    <li className={`dmpf-item${open ? ' is-open' : ''}`}>
      <h3 className="dmpf-q">
        <button type="button" id={bid} className="dmpf-btn" aria-expanded={open} aria-controls={pid} onClick={() => onToggle(index)}>
          <span className="dmpf-idx" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="dmpf-text">{item.q}</span>
          <span className="dmpf-plus" aria-hidden="true"><i /><i /></span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="a"
            id={pid}
            role="region"
            aria-labelledby={bid}
            className="dmpf-panel"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
          >
            <p className="dmpf-a">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function QMark() {
  return (
    <svg className="dmpf-art" viewBox="0 0 460 230" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="dmpf-bub" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#06A3DA" />
          <stop offset="1" stopColor="#1E7FD4" />
        </linearGradient>
      </defs>
      <ellipse cx="230" cy="128" rx="214" ry="66" transform="rotate(-10 230 128)" fill="none" stroke="#BCD6EE" strokeWidth="1.2" />
      <ellipse cx="230" cy="128" rx="170" ry="48" transform="rotate(14 230 128)" fill="none" stroke="#D3E4F4" strokeWidth="1.2" />
      <g className="dmpf-fl dmpf-fl--a">
        <circle cx="106" cy="118" r="40" fill="#fff" stroke="#D6E6F6" strokeWidth="1.5" />
        <path d="M82 148l-10 26 32-14z" fill="#fff" stroke="#D6E6F6" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="106" cy="118" r="39" fill="#fff" />
        <text x="106" y="134" textAnchor="middle" fontSize="46" fontWeight="800" fill="#1E7FD4" fontFamily="inherit">?</text>
      </g>
      <g className="dmpf-fl dmpf-fl--b">
        <path d="M196 150l-22 34 46-20z" fill="url(#dmpf-bub)" />
        <circle cx="232" cy="104" r="62" fill="url(#dmpf-bub)" />
        <text x="232" y="128" textAnchor="middle" fontSize="72" fontWeight="800" fill="#fff" fontFamily="inherit">?</text>
      </g>
      <g className="dmpf-fl dmpf-fl--c">
        <circle cx="350" cy="150" r="42" fill="#fff" stroke="#D6E6F6" strokeWidth="1.5" />
        <path d="M376 182l16 24-38-12z" fill="#fff" stroke="#D6E6F6" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="350" cy="150" r="41" fill="#fff" />
        <text x="350" y="168" textAnchor="middle" fontSize="48" fontWeight="800" fill="#1E7FD4" fontFamily="inherit">?</text>
      </g>
      <circle cx="160" cy="62" r="5" fill="#1E7FD4" />
      <circle cx="120" cy="196" r="9" fill="#1E7FD4" />
      <g className="dmpf-fl dmpf-fl--c"><path d="M380 38l44-16-18 38-8-14-14-2z" fill="#1E7FD4" /><path d="M398 44l-4 16 10-10z" fill="#0E2A4E" fillOpacity="0.25" /></g>
    </svg>
  );
}

export default function DmpFaq() {
  const reduce = useReducedMotion();
  const base = useId().replace(/:/g, '');
  const [open, setOpen] = useState(0);
  const toggle = (i) => setOpen((o) => (o === i ? -1 : i));

  return (
    <section id="dmp-faq" className="dmpf" aria-labelledby="dmpf-title">
      <div className="dmpf-inner">
        <div className="dmpf-left">
          <motion.p className="dmpf-eyebrow" initial={reduce ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
            <span className="dmpf-eyebrow-line" aria-hidden="true" />
            NEED TO KNOW MORE?
          </motion.p>
          <motion.h2 className="dmpf-title" id="dmpf-title" initial={reduce ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.6 }}>
            {HEADING.map((w, i) => (
              <Fragment key={w}>
                {i > 0 ? ' ' : null}
                <span className="dmpf-word">
                  <motion.span className="dmpf-word-in" variants={{ hidden: { y: '110%' }, visible: { y: 0 } }} transition={{ duration: 0.7, ease: EASE, delay: 0.08 * i }}>{w}</motion.span>
                </span>
              </Fragment>
            ))}
          </motion.h2>
          <motion.p className="dmpf-desc" initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}>
            Find answers about our digital marketing services, campaigns, reporting, and collaboration.
          </motion.p>
          <div className="dmpf-contact">
            <QMark />
            <p className="dmpf-contact-line"><strong>Still have questions?</strong> Let&rsquo;s talk.</p>
            <a href={CONTACT_HREF} className="dmpf-cta">
              Contact Us <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <ul className="dmpf-list">
          {FAQS.map((f, i) => (
            <Faq key={f.id} item={f} index={i} open={open === i} onToggle={toggle} base={base} reduce={reduce} />
          ))}
        </ul>
      </div>
    </section>
  );
}