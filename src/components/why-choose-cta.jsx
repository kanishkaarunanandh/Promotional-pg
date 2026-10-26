
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

// ---------- 3) Add this component ABOVE `export default function WebDevelopmentPage()` ----------
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

// ---------- 4) Inside WebDevelopmentPage(), after `staggerContainer`, add ----------
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

// ---------- 5) Replace the <div className="benefits-grid"> ... </div> with ----------
/*
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
*/

// ---------- 6) Replace the CTA section (<section className="webdev-cta-section"> ... </section>) with ----------


