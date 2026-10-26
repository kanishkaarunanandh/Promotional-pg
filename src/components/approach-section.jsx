import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { Compass, Layers, Zap, ArrowRight } from 'lucide-react';
import { ROUTES } from '../utils/sectionNav';
import './approach-section.css';

const AP_EASE = [0.22, 1, 0.36, 1];

// Stage = the illustration's design canvas. Desktop shows all of it; on
// tablet/mobile only the browser + phone are shown (cropped) and the three
// feature panels move into a normal list below.
const AP_STAGE = { w: 680, h: 750 };
const AP_CROP = { w: 460, h: 420, x: 20, y: 215 };

const APPROACH_FEATURES = [
  {
    id: 'planning',
    num: '01',
    icon: Compass,
    title: 'Website Planning & Strategy',
    label: 'Aligning technology with business goals',
    description:
      'Comprehensive competitor mapping, information architecture, and user journey outlines prior to writing any code.',
    visual: 'sitemap',
    slot: { left: 0, top: 0, width: 250 },
    enter: { x: -36, y: 0, delay: 1.0 },
  },
  {
    id: 'uiux',
    num: '02',
    icon: Layers,
    title: 'Human-Centered UI/UX',
    label: 'Thoughtful design, effortless usability',
    description:
      'Crisp typography, intuitive navigation trees, and accessible interaction patterns that elevate customer trust.',
    visual: 'system',
    slot: { left: 470, top: 260, width: 210 },
    enter: { x: 36, y: 0, delay: 1.2 },
  },
  {
    id: 'speed',
    num: '03',
    icon: Zap,
    title: 'Performance & Speed Tuning',
    label: 'Fast, responsive digital experiences',
    description:
      'Optimized asset delivery, server-side hygiene, and lightweight DOM footprints ensuring sub-second rendering.',
    visual: 'speed',
    slot: { left: 0, top: 570, width: 250 },
    enter: { x: 0, y: 36, delay: 1.4 },
  },
];

// Technical connection lines (stage coordinates) and their end nodes.
const AP_LINES = [
  'M250 90H300Q320 90 320 110V230',
  'M470 350H440',
  'M575 440V490H450',
  'M125 570V530',
  'M250 660H390V620',
];
const AP_NODES = [
  [250, 90], [320, 230], [470, 350], [440, 350], [575, 440],
  [450, 490], [125, 570], [125, 530], [250, 660], [390, 620],
];

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function makeApproachVariants(reduce) {
  const d = (s) => (reduce ? 0.01 : s);
  const t = (s) => (reduce ? 0 : s);
  const m = (v) => (reduce ? 0 : v);
  return {
    root: { hidden: {}, visible: {} },
    backdrop: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: d(1) } } },
    browser: {
      hidden: { opacity: 0, scale: reduce ? 1 : 0.94, y: m(16) },
      visible: { opacity: 1, scale: 1, y: 0, transition: { duration: d(0.8), ease: AP_EASE } },
    },
    browserBody: {
      hidden: {},
      visible: { transition: { staggerChildren: t(0.12), delayChildren: t(0.35) } },
    },
    partTop: {
      hidden: { opacity: 0, y: m(-14) },
      visible: { opacity: 1, y: 0, transition: { duration: d(0.6), ease: AP_EASE } },
    },
    partLeft: {
      hidden: { opacity: 0, x: m(-22) },
      visible: { opacity: 1, x: 0, transition: { duration: d(0.6), ease: AP_EASE } },
    },
    partUp: {
      hidden: { opacity: 0, y: m(16) },
      visible: { opacity: 1, y: 0, transition: { duration: d(0.6), ease: AP_EASE } },
    },
    bar: {
      hidden: { scaleY: reduce ? 1 : 0 },
      visible: (i = 0) => ({
        scaleY: 1,
        transition: { duration: d(0.6), delay: t(0.9 + i * 0.07), ease: AP_EASE },
      }),
    },
    phone: {
      hidden: { opacity: 0, x: m(36), y: m(12) },
      visible: { opacity: 1, x: 0, y: 0, transition: { duration: d(0.8), delay: t(0.75), ease: AP_EASE } },
    },
    panel: {
      hidden: (dir) => ({ opacity: 0, x: m(dir.x), y: m(dir.y) }),
      visible: (dir) => ({
        opacity: 1, x: 0, y: 0,
        transition: { duration: d(0.7), delay: t(dir.delay), ease: AP_EASE },
      }),
    },
    draw: {
      hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
      visible: (i = 0) => ({
        pathLength: 1, opacity: 1,
        transition: { duration: d(0.9), delay: t(1.3 + i * 0.12), ease: 'easeInOut' },
      }),
    },
    node: {
      hidden: { opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0 },
      visible: (i = 0) => ({
        opacity: 1, scale: 1,
        transition: { duration: d(0.4), delay: t(1.6 + i * 0.08) },
      }),
    },
    listItem: {
      hidden: { opacity: 0, y: m(24) },
      visible: { opacity: 1, y: 0, transition: { duration: d(0.6), ease: AP_EASE } },
    },
  };
}

// Fits the fixed-size illustration to its column and switches between the
// full composition (desktop) and the cropped one (tablet/mobile).
function useApproachLayout(wrapRef) {
  const [layout, setLayout] = useState({ scale: 0.8, compact: false, offset: 0 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const mq = window.matchMedia('(max-width: 1099px)');

    const update = () => {
      const width = el.clientWidth;
      const compact = mq.matches;
      const designW = compact ? AP_CROP.w : AP_STAGE.w;
      const scale = Math.min(1, width / designW);
      const offset = Math.max(0, (width - designW * scale) / 2);
      setLayout((prev) =>
        prev.compact === compact &&
          Math.abs(prev.scale - scale) < 0.004 &&
          Math.abs(prev.offset - offset) < 1
          ? prev
          : { scale, compact, offset }
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    mq.addEventListener('change', update);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', update);
    };
  }, [wrapRef]);

  return layout;
}

// A layer that drifts with the pointer. Springs are shared, so no re-renders.
function ApParallax({ sx, sy, depth = 8, className, style, children }) {
  const x = useTransform(sx, [-0.5, 0.5], [-depth, depth]);
  const y = useTransform(sy, [-0.5, 0.5], [-depth, depth]);
  return (
    <motion.div className={className} style={{ ...style, x, y }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* illustration parts                                                  */
/* ------------------------------------------------------------------ */

function ApImage({ id }) {
  return (
    <svg className="ap-img" viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0E2A4E" />
          <stop offset="1" stopColor="#00AEEF" />
        </linearGradient>
      </defs>
      <rect width="120" height="90" fill={`url(#${id})`} />
      <circle cx="88" cy="26" r="11" fill="#fff" opacity="0.85" />
      <path d="M0 90L38 44L64 72L84 54L120 90Z" fill="#fff" opacity="0.2" />
      <path d="M0 90L26 64L50 90Z" fill="#fff" opacity="0.28" />
    </svg>
  );
}

function ApBrowser({ v }) {
  const bars = [46, 70, 54, 86, 64];
  return (
    <motion.div className="ap-browser" variants={v.browser}>
      <div className="ap-browser-chrome">
        <span className="ap-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="ap-url">Atriowings.in</span>
      </div>

      <motion.div className="ap-browser-body" variants={v.browserBody}>
        <motion.div className="ap-site-nav" variants={v.partTop}>
          <span className="ap-logo"><i /><b /></span>
          <span className="ap-nav-links"><i /><i /><i /></span>
          <span className="ap-nav-btn" />
        </motion.div>

        <motion.div className="ap-site-hero" variants={v.partLeft}>
          <div className="ap-hero-copy">
            <span className="ap-line ap-line--lg" style={{ width: '92%' }} />
            <span className="ap-line ap-line--lg" style={{ width: '60%' }} />
            <span className="ap-line" style={{ width: '88%' }} />
            <span className="ap-line" style={{ width: '70%' }} />
            <span className="ap-hero-btns"><i className="is-solid" /><i /></span>
          </div>
          <div className="ap-hero-img"><ApImage id="apGradBrowser" /></div>
        </motion.div>

        <motion.div className="ap-site-blocks" variants={v.partUp}>
          <div className="ap-block"><i /><span /><span /></div>
          <div className="ap-block"><i className="is-navy" /><span /><span /></div>
          <div className="ap-block ap-block--chart">
            {bars.map((h, i) => (
              <motion.span key={i} style={{ height: `${h}%` }} variants={v.bar} custom={i} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function ApPhone({ v }) {
  return (
    <motion.div className="ap-phone" variants={v.phone}>
      <span className="ap-phone-notch" />
      <div className="ap-phone-screen">
        <div className="ap-phone-nav"><span><i /><i /><i /></span><b /></div>
        <div className="ap-phone-hero"><ApImage id="apGradPhone" /></div>
        <span className="ap-line ap-line--lg" style={{ width: '86%' }} />
        <span className="ap-line" style={{ width: '94%' }} />
        <span className="ap-line" style={{ width: '60%' }} />
        <span className="ap-phone-btn" />
        <div className="ap-phone-rows"><i /><i /></div>
      </div>
    </motion.div>
  );
}

function ApMiniVisual({ type, base }) {
  const reduce = useReducedMotion();
  const t = (s) => (reduce ? 0 : s);
  const d = (s) => (reduce ? 0.01 : s);

  const pop = {
    hidden: { opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.6 },
    visible: (i = 0) => ({ opacity: 1, scale: 1, transition: { duration: d(0.4), delay: t(base + i * 0.07) } }),
  };
  const rise = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: d(0.5), delay: t(base + i * 0.08), ease: AP_EASE } }),
  };
  const draw = {
    hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    visible: (i = 0) => ({ pathLength: 1, opacity: 1, transition: { duration: d(0.6), delay: t(base + i * 0.07), ease: 'easeInOut' } }),
  };
  const grow = {
    hidden: { scaleY: reduce ? 1 : 0 },
    visible: (i = 0) => ({ scaleY: 1, transition: { duration: d(0.6), delay: t(base + i * 0.06), ease: AP_EASE } }),
  };
  const ring = {
    hidden: { pathLength: reduce ? 0.88 : 0 },
    visible: { pathLength: 0.88, transition: { duration: d(1.2), delay: t(base), ease: 'easeOut' } },
  };

  if (type === 'sitemap') {
    const paths = ['M109 12V19', 'M28 19H190', 'M28 19V26', 'M109 19V26', 'M190 19V26', 'M28 37V42', 'M109 37V42'];
    const boxes = [
      [94, 0, 30, 12, 'is-root'], [14, 26, 28, 11, ''], [95, 26, 28, 11, 'is-accent'],
      [176, 26, 28, 11, ''], [20, 42, 16, 7, 'is-leaf'], [101, 42, 16, 7, 'is-leaf'],
    ];
    return (
      <svg className="ap-sitemap" viewBox="0 0 218 50" preserveAspectRatio="xMidYMid meet">
        {paths.map((p, i) => (
          <motion.path key={p} d={p} variants={draw} custom={i} />
        ))}
        {boxes.map(([x, y, w, h, cls], i) => (
          <motion.rect key={`${x}-${y}`} className={cls} x={x} y={y} width={w} height={h} rx="2.5" variants={pop} custom={i} />
        ))}
      </svg>
    );
  }

  if (type === 'system') {
    return (
      <div className="ap-system">
        <span className="ap-swatches">
          {['#0E2A4E', '#00AEEF', '#D9F2FD', '#8CA0B8'].map((c, i) => (
            <motion.i key={c} style={{ background: c }} variants={pop} custom={i} />
          ))}
        </span>
        <motion.span className="ap-type" variants={rise} custom={4}>
          <b>Aa</b><em>Aa</em>
        </motion.span>
        <motion.span className="ap-toggle" variants={rise} custom={5}><i /></motion.span>
        <motion.span className="ap-chip" variants={rise} custom={6}>Button</motion.span>
        <motion.span className="ap-input" variants={rise} custom={7} />
      </div>
    );
  }

  // speed
  const bars = [100, 88, 74, 64, 52, 44, 36, 30];
  return (
    <div className="ap-speed">
      <span className="ap-ring-wrap">
        <svg className="ap-ring" viewBox="0 0 48 48">
          <circle className="ap-ring-track" cx="24" cy="24" r="19" />
          <motion.circle className="ap-ring-arc" cx="24" cy="24" r="19" variants={ring} />
        </svg>
        <Zap className="ap-ring-icon" size={14} strokeWidth={2.2} />
      </span>
      <span className="ap-speed-bars">
        {bars.map((h, i) => (
          <motion.i key={i} style={{ height: `${h}%` }} variants={grow} custom={i} />
        ))}
      </span>
    </div>
  );
}

function ApPanelBody({ feature, mode, base }) {
  const Icon = feature.icon;
  return (
    <article className={`ap-panel ap-panel--${mode}`}>
      <header className="ap-panel-head">
        <span className="ap-panel-icon"><Icon size={18} strokeWidth={1.8} aria-hidden="true" /></span>
        <div>
          <span className="ap-panel-num" aria-hidden="true">{feature.num}</span>
          <h3 className="ap-panel-title">{feature.title}</h3>
        </div>
      </header>
      <p className="ap-panel-label">{feature.label}</p>
      <p className="ap-panel-desc">{feature.description}</p>
      <div className="ap-panel-visual" aria-hidden="true">
        <ApMiniVisual type={feature.visual} base={base} />
      </div>
    </article>
  );
}

const AP_FLOATS = [
  { cls: 'ap-float-ring', style: { left: 576, top: 140 }, dy: -10, dx: 4, dur: 7 },
  { cls: 'ap-float-plus', style: { left: 12, top: 300 }, dy: 8, dx: -3, dur: 9 },
  { cls: 'ap-float-diamond', style: { left: 604, top: 560 }, dy: -8, dx: 6, dur: 8 },
  { cls: 'ap-float-dots', style: { left: 500, top: 630 }, dy: 6, dx: -5, dur: 10 },
];

function ApproachVisual() {
  const reduce = useReducedMotion();
  const v = useMemo(() => makeApproachVariants(reduce), [reduce]);

  const wrapRef = useRef(null);
  const { scale, compact, offset } = useApproachLayout(wrapRef);

  // Pointer parallax: mouse only, off for reduced motion, no state updates.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 70, damping: 18, mass: 0.6 });

  const handlePointerMove = (e) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const designH = compact ? AP_CROP.h : AP_STAGE.h;
  const tx = compact ? -AP_CROP.x : 0;
  const ty = compact ? -AP_CROP.y : 0;

  return (
    <div className="ap-visual">
      <div
        ref={wrapRef}
        className="ap-stage-wrap"
        style={{ height: designH * scale, overflow: compact ? 'hidden' : 'visible' }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <motion.div
          className="ap-stage"
          style={{
            width: AP_STAGE.w,
            height: AP_STAGE.h,
            left: offset,
            transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          }}
          variants={v.root}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          role="img"
          aria-label="Illustration of a website layout on desktop and mobile, surrounded by planning, design and performance elements"
        >
          {/* backdrop */}
          <ApParallax sx={sx} sy={sy} depth={-10} className="ap-layer">
            <motion.div className="ap-backdrop" variants={v.backdrop}>
              <span className="ap-glow" />
              <svg viewBox="0 0 680 750" aria-hidden="true">
                <circle cx="240" cy="380" r="236" />
                <circle cx="240" cy="380" r="320" />
              </svg>
            </motion.div>
          </ApParallax>

          {/* core group: lines, browser, phone and panels move together */}
          <ApParallax sx={sx} sy={sy} depth={8} className="ap-layer">
            <svg className="ap-lines" viewBox="0 0 680 750" aria-hidden="true" focusable="false">
              {AP_LINES.map((d, i) => (
                <motion.path key={d} d={d} variants={v.draw} custom={i} />
              ))}
              {AP_NODES.map(([cx, cy], i) => (
                <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" variants={v.node} custom={i} />
              ))}
            </svg>

            <ApBrowser v={v} />
            <ApPhone v={v} />

            {APPROACH_FEATURES.map((feature, i) => (
              <div
                key={feature.id}
                className="ap-slot"
                style={{ left: feature.slot.left, top: feature.slot.top, width: feature.slot.width }}
              >
                <motion.div className="ap-slot-inner" variants={v.panel} custom={feature.enter}>
                  <ApPanelBody feature={feature} mode="stage" base={1.3 + i * 0.2} />
                </motion.div>
              </div>
            ))}
          </ApParallax>

          {/* floating decoration */}
          <ApParallax sx={sx} sy={sy} depth={22} className="ap-layer ap-layer--decor">
            {AP_FLOATS.map((f) => (
              <motion.span key={f.cls} className="ap-float" style={f.style} variants={v.backdrop}>
                <motion.span
                  className={f.cls}
                  animate={reduce ? undefined : { y: [0, f.dy, 0], x: [0, f.dx, 0] }}
                  transition={{ duration: f.dur, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.span>
            ))}
          </ApParallax>
        </motion.div>
      </div>

      {/* tablet + mobile: the three features as a clean list under the illustration */}
      <motion.ul
        className="ap-feature-list"
        role="list"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: reduce ? 0 : 0.12 } } }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {APPROACH_FEATURES.map((feature) => (
          <motion.li key={feature.id} variants={v.listItem}>
            <ApPanelBody feature={feature} mode="list" base={0.3} />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}



function ApproachSection() {
  const reduce = useReducedMotion();

  const copyStagger = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.05 } },
  };
  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.7, ease: AP_EASE } },
  };
  const ctaVariants = { hidden: rise.hidden, visible: rise.visible, hover: {} };
  const arrowVariants = { hidden: { x: 0 }, visible: { x: 0 }, hover: { x: reduce ? 0 : 6 } };

  return (
    <section
      className="webdev-overview-section ap-section"
      id="overview"
      aria-labelledby="approach-title"
    >
      <div className="webdev-container">
        <div className="ap-layout">
          <motion.div
            className="ap-copy"
            variants={copyStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div className="webdev-eyebrow-wrapper" variants={rise}>
              <span className="webdev-eyebrow-accent ap-blink-line" aria-hidden="true" />
              <span className="webdev-eyebrow ap-blink-eyebrow">OUR APPROACH</span>
            </motion.div>

            {/* The continuous "blink" classes (ap-blink-*) are pure CSS keyframes on
                inner spans, so they start on load and never depend on scroll, hover
                or focus. They sit on inner elements so they don't fight Framer
                Motion's entrance animation on the outer motion.* elements. */}
            <motion.h2 className="ap-heading" id="approach-title" variants={rise}>
              Digital Experiences Designed Around <span className="ap-grad-text">Your Business</span>
            </motion.h2>

            <motion.p className="ap-lead" variants={rise}>
              <span className="ap-blink-text ap-blink-text--1">
                Every business has different goals. We build tailored web experiences that combine
                thoughtful design, reliable technology, and intuitive functionality.
              </span>
            </motion.p>

            <motion.p className="ap-body" variants={rise}>
              <span className="ap-blink-text ap-blink-text--2">
                Our comprehensive development process begins with in-depth website planning and
                empathetic UI/UX research. We ensure every page journey is purposeful, reducing bounce
                rates and guiding users directly toward conversion.
              </span>
            </motion.p>

            <motion.p className="ap-body" variants={rise}>
              <span className="ap-blink-text ap-blink-text--3">
                Under the hood, we engineer responsive, high-performance codebases that load instantly
                across all devices. Combined with SEO-ready structures and ongoing maintenance, our
                websites deliver sustainable digital growth.
              </span>
            </motion.p>

            <motion.a
              href={ROUTES.contact}
              className="webdev-btn-inline ap-cta ap-blink-cta"
              variants={ctaVariants}
              whileHover="hover"
              whileFocus="hover"
            >
              <span>Speak with a Web Specialist</span>
              <motion.span className="ap-cta-arrow" variants={arrowVariants} transition={{ duration: 0.3, ease: AP_EASE }}>
                <ArrowRight size={16} aria-hidden="true" />
              </motion.span>
            </motion.a>
          </motion.div>

          <div className="ap-visual-col">
            <ApproachVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ApproachSection;