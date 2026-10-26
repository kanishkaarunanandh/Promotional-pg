import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Mail, Plus } from 'lucide-react';
import { ROUTES } from '../utils/sectionNav';
import './faq-section.css';

const EASE = [0.22, 1, 0.36, 1];

const VIDEO_SRC = '/videos/atriowings-intro-animation.mp4';


const CATEGORIES = [
  {
    id: 'web',
    label: 'Web Development',
    items: [
      {
        q: 'What types of websites do you develop?',
        a: 'We build business and corporate websites, landing pages, portfolio and company profile sites, e-commerce stores, web portals and custom web applications. Each one is planned around your audience, brand and goals rather than a one-size-fits-all template.',
      },
      {
        q: 'How long does it take to build a website?',
        a: 'It depends on the number of pages, the complexity of the design, the features you need and how quickly content and feedback are shared. After understanding your requirements we give you a realistic timeline with clear milestones.',
      },
      {
        q: 'Will my website work on mobile, tablet, and desktop?',
        a: 'Yes. Every site we build is responsive and designed to look and work well across phones, tablets and desktop screens. We test layouts, navigation and performance on common devices and browsers before launch.',
      },
      {
        q: 'Can you redesign or improve my existing website?',
        a: 'Yes. We can review your current site and then refresh the design, improve speed, usability and mobile experience, or rebuild it on a modern foundation while keeping the content and structure that already work for you.',
      },
      //   {
      //     q: 'Will I be able to update the website content myself?',
      //     a: 'In most cases, yes. We can set up an easy content management approach so your team can update text, images and pages without writing code. We will agree what should be editable during planning.',
      //   },
      //   {
      //     q: 'Do you provide website maintenance and technical support?',
      //     a: 'Yes. We can help with updates, bug fixes, security checks, performance improvements and content changes after launch. The scope of ongoing support can be agreed based on what your website needs.',
      //   },
    ],
  },
  {
    id: 'software',
    label: 'Custom Software',
    items: [
      {
        q: 'What is custom software development?',
        a: 'It is software designed and built specifically for your business, instead of using an off-the-shelf product that you adapt your process to. It can automate manual work, connect your tools and fit the way your team actually operates.',
      },
      {
        q: 'Can you develop software tailored to my business workflow?',
        a: 'Yes. We start by understanding how your teams work today, then design a solution around those processes, roles and approvals so the software supports your workflow rather than forcing you to change it.',
      },
      {
        q: 'Can you integrate third-party APIs and existing business systems?',
        a: 'Yes. We can connect your solution with payment gateways, CRMs, ERPs, messaging and email services, analytics tools and other APIs, as long as the external system offers a suitable way to integrate.',
      },
      {
        q: 'How do you ensure software quality, security, and performance?',
        a: 'We follow structured development practices, review code, test functionality across devices and scenarios, validate inputs, protect access with appropriate authentication and permissions, and check performance before release.',
      },
    ],
  },
  {
    id: 'products',
    label: 'Digital Products',
    items: [
      {
        q: 'Can you help turn my product idea into a working application?',
        a: 'Yes. We can help you shape the idea, define the key features and user journey, design the interface and then develop and launch a working version. You do not need a complete technical specification to start the conversation.',
      },
      {
        q: 'What is the difference between an MVP and a complete product?',
        a: 'An MVP (minimum viable product) includes only the core features needed to test your idea with real users. A complete product expands on that with more features, polish and scale, based on what you learn from the MVP.',
      },
      {
        q: 'Can you add new features to an existing application?',
        a: 'Yes. After reviewing the current application and its codebase, we can add new features, improve existing ones or fix issues, while taking care not to disrupt what already works.',
      },
      {
        q: 'Can you develop dashboards, admin panels, and business management systems?',
        a: 'Yes. We can build dashboards, admin panels, reporting tools and management systems with role-based access, data tables, forms and charts that help your team monitor and run the business.',
      },
    ],
  },
  {
    id: 'process',
    label: 'Process & Pricing',
    items: [
      {
        q: 'How much does a website or software project cost?',
        a: 'Cost depends on scope, complexity, number of features, integrations, design requirements and timeline. Once we understand your requirements we can prepare a clear estimate, so every project is quoted individually.',
      },
      {
        q: 'What information do you need before starting a project?',
        a: 'It helps to know your goals, target audience, the features you have in mind, any existing branding or content, examples you like, and your preferred timeline and budget range. If you are unsure about any of these, we can work them out together.',
      },
      {
        q: 'How do you handle revisions and changes during development?',
        a: 'We share progress at key stages so you can give feedback early. Reasonable refinements are part of the process, and larger changes to the agreed scope are discussed openly so you understand any effect on timeline or cost.',
      },
      {
        q: 'Will I own the source code and project deliverables?',
        a: 'Ownership and handover terms are agreed in writing before the project begins. We will confirm clearly what is delivered to you, including code, design files and access, as part of the project agreement.',
      },
      {
        q: 'Do you provide support after the project launches?',
        a: 'Yes. We can provide post-launch support for fixes, monitoring, updates and improvements. The type and duration of support can be agreed with you based on the project.',
      },
      {
        q: 'How can I request a quote for my project?',
        a: 'Use the contact form or email us at info@Atriowings.in with a short description of what you need. We will review it, ask any follow-up questions and then get back to you with the next steps.',
      },
    ],
  },
];

function FaqItem({ item, index, isOpen, onToggle, reduce, baseId }) {
  const buttonId = `${baseId}-q-${index}`;
  const panelId = `${baseId}-a-${index}`;

  return (
    <motion.li
      className={`faq-item${isOpen ? ' is-open' : ''}`}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 22 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: reduce ? 0.15 : 0.55, ease: EASE, delay: reduce ? 0 : index * 0.07 },
        },
      }}
    >
      <h3 className="faq-q">
        <motion.button
          type="button"
          id={buttonId}
          className="faq-q-btn"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          whileTap={reduce ? undefined : { scale: 0.985 }}
        >
          <span className="faq-q-num" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="faq-q-text">{item.q}</span>
          <span className="faq-q-icon" aria-hidden="true">
            <Plus size={18} strokeWidth={2.4} />
          </span>
        </motion.button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className="faq-a-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
          >
            <p className="faq-a">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function FaqSection() {
  const reduce = useReducedMotion();
  const baseId = useId();
  const videoRef = useRef(null);
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [openIndex, setOpenIndex] = useState(0); // only one open at a time

  // Reduced motion: do not autoplay; show the finished frame instead
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduce) {
      v.pause();
      const still = () => { v.currentTime = 5.9; };
      if (v.readyState >= 1) still(); else v.addEventListener('loadedmetadata', still, { once: true });
    } else {
      v.play().catch(() => { });
    }
  }, [reduce]);

  const category = CATEGORIES.find((c) => c.id === categoryId);

  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 26 },
    visible: (d = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.15 : 0.7, ease: EASE, delay: reduce ? 0 : d },
    }),
  };
  const view = { once: true, amount: 0.25 };

  const selectCategory = (id) => {
    setCategoryId(id);
    setOpenIndex(0);
  };

  // arrow-key navigation for the category tabs
  const onTabKey = (e, i) => {
    let next = null;
    if (e.key === 'ArrowRight') next = (i + 1) % CATEGORIES.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + CATEGORIES.length) % CATEGORIES.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = CATEGORIES.length - 1;
    if (next === null) return;
    e.preventDefault();
    selectCategory(CATEGORIES[next].id);
    document.getElementById(`${baseId}-tab-${CATEGORIES[next].id}`)?.focus();
  };

  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="faq-bg" aria-hidden="true" />

      <div className="faq-inner">
        {/* ---------------- left column ---------------- */}
        <div className="faq-left">
          <motion.div
            className="faq-eyebrow"
            variants={rise}
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={view}
          >
            <span className="faq-eyebrow-line" aria-hidden="true" />
            <span className="faq-eyebrow-dot" aria-hidden="true" />
            <span>GOT QUESTIONS?</span>
          </motion.div>

          <motion.h2
            id="faq-title"
            className="faq-title"
            variants={rise}
            custom={0.1}
            initial="hidden"
            whileInView="visible"
            viewport={view}
          >
            Frequently Asked <span className="faq-accent">Questions</span>
          </motion.h2>

          <motion.p
            className="faq-desc"
            variants={rise}
            custom={0.2}
            initial="hidden"
            whileInView="visible"
            viewport={view}
          >
            Everything you need to know about our web development, custom software, and digital product
            solutions.
          </motion.p>

          {/* video visual: file lives in /public/videos/ and is served from /videos/... */}
          <motion.div
            className="faq-video"
            aria-hidden="true"
            variants={rise}
            custom={0.3}
            initial="hidden"
            whileInView="visible"
            viewport={view}
          >
            <div className="faq-video-glow" />
            <div className="faq-video-frame">
              <video
                ref={videoRef}
                className="faq-video-el"
                src={VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                tabIndex={-1}
              />
            </div>
            <span className="faq-video-light" />
          </motion.div>

          <motion.a
            href={ROUTES.contact}
            className="faq-link"
            variants={rise}
            custom={0.4}
            initial="hidden"
            whileInView="visible"
            viewport={view}
          >
            <span>Talk to our team</span>
            <ArrowRight size={16} strokeWidth={2.4} aria-hidden="true" />
          </motion.a>
        </div>

        {/* ---------------- right column ---------------- */}
        <div className="faq-right">
          <div className="faq-tabs" role="tablist" aria-label="FAQ categories">
            {CATEGORIES.map((c, i) => {
              const selected = c.id === categoryId;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${c.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-tabpanel`}
                  tabIndex={selected ? 0 : -1}
                  className={`faq-tab${selected ? ' is-selected' : ''}`}
                  onClick={() => selectCategory(c.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <div role="tabpanel" id={`${baseId}-tabpanel`} aria-labelledby={`${baseId}-tab-${categoryId}`}>
            <motion.ul
              key={categoryId}
              className="faq-list"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {category.items.map((item, i) => (
                <FaqItem
                  key={item.q}
                  item={item}
                  index={i}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                  reduce={reduce}
                  baseId={`${baseId}-${categoryId}`}
                />
              ))}
            </motion.ul>
          </div>

          <motion.div
            className="faq-cta"
            variants={rise}
            custom={0.1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="faq-cta-copy">
              <h3 className="faq-cta-title">Still have questions?</h3>
              <p className="faq-cta-text">
                Let&apos;s discuss your project and find the right solution for your business.
              </p>
            </div>
            <div className="faq-cta-actions">
              <a href={ROUTES.contact} className="faq-btn">
                <span>Let&apos;s Talk About Your Project</span>
                <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
              </a>
              <a href="mailto:info@Atriowings.in" className="faq-mail">
                <Mail size={16} strokeWidth={2.2} aria-hidden="true" />
                <span>info@Atriowings.in</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}