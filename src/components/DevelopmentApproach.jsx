import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Search,
  ClipboardCheck,
  Network,
  PenTool,
  Code2,
  Plug,
  ShieldCheck,
  Rocket,
  LifeBuoy,
} from 'lucide-react';
import './development-approach.css';

const EASE = [0.22, 1, 0.36, 1];

const STEPS = [
  { id: 1, icon: Search, title: 'Requirement Analysis', text: 'Understand business goals, user needs, and project requirements.' },
  { id: 2, icon: ClipboardCheck, title: 'Feasibility Study', text: 'Evaluate technical feasibility, resources, scope, and constraints.' },
  { id: 3, icon: Network, title: 'System Architecture', text: 'Plan the architecture, technologies, integrations, and data flow.' },
  { id: 4, icon: PenTool, title: 'UI/UX Design', text: 'Design intuitive interfaces and user journeys.' },
  { id: 5, icon: Code2, title: 'Development', text: 'Build reliable frontend and backend functionality.' },
  { id: 6, icon: Plug, title: 'API Integration', text: 'Connect services, databases, and external systems.' },
  { id: 7, icon: ShieldCheck, title: 'Testing & QA', text: 'Validate functionality, performance, and reliability.' },
  { id: 8, icon: Rocket, title: 'Deployment', text: 'Release the solution into the target environment.' },
  { id: 9, icon: LifeBuoy, title: 'Maintenance & Support', text: 'Monitor, improve, and maintain the software.' },
];

const N = STEPS.length;
const VISIBLE = 4;          // steps on the track while the sequence is running
const TICK_MS = 2600;       // every step advances one slot this often
const TRAVEL_S = 0.9;       // duration of a move
const ZOOM = 1.3;           // scale of the active step
const OVERVIEW_MS = 3600;   // how long the nine-step overview stays on screen
const RESET_MS = 1000;      // time given to the overview -> step 1 transition
const OV_SCALE = 0.9;       // circle scale in the overview

// ---- semi-circular track, drawn in a 1000 x 560 coordinate space ----
const VB_W = 1000;
const VB_H = 560;
const CX = 500;
const CY = 470;
const R = 380;
const SLOT_DEG = 180 / (VISIBLE - 1); // 60 degrees between the 4 running slots
const OV_DEG = 180 / (N - 1);         // 22.5 degrees between the 9 overview positions
const OFF_DEG = 16;                   // how far beyond each end a step slides while fading
const rad = (d) => (d * Math.PI) / 180;
const xa = (a) => ((CX + R * Math.cos(rad(a))) / VB_W) * 100;
const ya = (a) => ((CY - R * Math.sin(rad(a))) / VB_H) * 100;
// running slots: 0 = far LEFT (highlighted), 3 = far right. -1 = just off the left end, 4 = just off the right end
const ang = (slot) => {
  if (slot <= -1) return 180 + OFF_DEG;
  if (slot >= VISIBLE) return -OFF_DEG;
  return 180 - slot * SLOT_DEG;
};
const px = (slot) => xa(ang(slot));
const py = (slot) => ya(ang(slot));
// overview positions: all nine steps spread evenly over the whole track
const ovAng = (k) => 180 - k * OV_DEG;
const pct = (v) => `${v.toFixed(3)}%`;

const segPoint = (deg) => [CX + R * Math.cos(rad(deg)), CY - R * Math.sin(rad(deg))];
const makeSegments = (count, angOf, gap) =>
  Array.from({ length: count }, (_, k) => {
    const [x0, y0] = segPoint(angOf(k) - gap);
    const [x1, y1] = segPoint(angOf(k + 1) + gap);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  });
const SEG_RUN = makeSegments(VISIBLE - 1, ang, 9);
const SEG_OV = makeSegments(N - 1, ovAng, 8.5);
// small chevrons midway between running slots, pointing toward the left end
const ARROWS = Array.from({ length: VISIBLE - 1 }, (_, k) => {
  const a = ang(k + 0.5);
  const [x, y] = segPoint(a);
  return { x, y, rot: (Math.atan2(-Math.cos(rad(a)), -Math.sin(rad(a))) * 180) / Math.PI };
});

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

export default function DevelopmentApproach() {
  const reduce = useReducedMotion();
  const isMobile = useMatch('(max-width: 767px)');
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.3 });

  // ONE shared controller: phase + tick, advanced by ONE timeout at a time.
  //   running   - four steps travel along the track, Step 1 -> Step 9
  //   overview  - all nine steps are shown together
  //   resetting - the overview folds back into Steps 1-4 (then running starts again)
  const [phase, setPhase] = useState('running');
  const [tick, setTick] = useState(0);           // running: index of the step in the highlighted slot
  const overview = phase === 'overview';
  const activeIndex = tick;

  useEffect(() => {
    if (reduce || !inView) return undefined;
    let delay = TICK_MS;
    let next = () => (tick >= N - 1 ? setPhase('overview') : setTick((t) => t + 1));
    if (phase === 'overview') {
      delay = OVERVIEW_MS;
      next = () => {
        setTick(0);
        setPhase('resetting');
      };
    } else if (phase === 'resetting') {
      delay = RESET_MS;
      next = () => setPhase('running');
    }
    const id = setTimeout(next, delay);
    return () => clearTimeout(id);
  }, [phase, tick, reduce, inView]);

  // steps on the track: all nine in the overview, otherwise (at most) four, never wrapped
  const windowSteps = STEPS.map((s, k) => ({ step: s, k }))
    .filter(({ k }) => overview || (k >= tick && k < tick + VISIBLE));
  // outgoing steps slide off to the left while running, but simply fade when the overview folds away
  const exitMode = phase === 'resetting' ? 'fade' : 'left';

  const rise = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: (d = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.15 : 0.7, ease: EASE, delay: reduce ? 0 : d },
    }),
  };
  const view = { once: true, amount: 0.3 };

  const activeStep = STEPS[activeIndex];
  const ActiveIcon = activeStep.icon;
  const showList = reduce || isMobile; // vertical timeline for phones and for reduced motion

  return (
    <section className="da" id="our-approach" ref={rootRef} aria-labelledby="da-title">
      <div className="da-grid-bg" aria-hidden="true" />

      <div className="da-inner">
        <header className="da-head">
          <motion.p className="da-eyebrow" variants={rise} custom={0} initial="hidden" whileInView="visible" viewport={view}>
            <span className="da-eyebrow-line" aria-hidden="true" />
            OUR PROCESS
          </motion.p>
          <motion.h2 id="da-title" className="da-title" variants={rise} custom={0.1} initial="hidden" whileInView="visible" viewport={view}>
            DEVELOPMENT <span className="da-accent">APPROACH</span>
          </motion.h2>
          <motion.p className="da-desc" variants={rise} custom={0.2} initial="hidden" whileInView="visible" viewport={view}>
            A structured, transparent process that transforms your ideas into reliable, scalable software
            solutions.
          </motion.p>
        </header>

        {showList ? (
          /* ---------------- phones / reduced motion: vertical timeline ---------------- */
          <ol className="da-list">
            <span className="da-list-line" aria-hidden="true" />
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = !reduce && !overview && i === activeIndex;
              return (
                <li key={s.id} className={`da-list-item${isActive ? ' is-active' : ''}${!reduce && overview ? ' is-all' : ''}`} aria-current={isActive ? 'step' : undefined}>
                  <span className="da-list-dot" aria-hidden="true">
                    <Icon strokeWidth={2.3} />
                  </span>
                  <div className="da-list-card">
                    <span className="da-list-num">{String(s.id).padStart(2, '0')}</span>
                    <h3 className="da-list-title">{s.title}</h3>
                    <p className="da-list-text">{s.text}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          /* ---------------- desktop / tablet: conveyor on a semi-circular track ---------------- */
          <div className={`da-stage${overview ? ' is-overview' : ''}`}>
            <svg className="da-track" viewBox={`0 0 ${VB_W} ${VB_H}`} aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="da-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#06a3da" />
                  <stop offset="1" stopColor="#1e7fd4" />
                </linearGradient>
              </defs>
              {/* faint full arc underneath */}
              <path className="da-arc-base" d={`M${CX - R} ${CY} A${R} ${R} 0 0 1 ${CX + R} ${CY}`} />
              {/* flowing dashes: they travel toward the highlighted slot */}
              <path className="da-arc-flow" d={`M${CX + R} ${CY} A${R} ${R} 0 0 0 ${CX - R} ${CY}`} />
              {/* connectors: three while running, eight in the overview (cross-faded) */}
              <g className="da-segs-run">
                {SEG_RUN.map((d, i) => (
                  <path key={i} className="da-seg" d={d} />
                ))}
              </g>
              <g className="da-segs-ov">
                {SEG_OV.map((d, i) => (
                  <path key={i} className="da-seg" d={d} />
                ))}
              </g>
              {/* direction chevrons */}
              {ARROWS.map((a, i) => (
                <path
                  key={i}
                  className="da-chevron"
                  d="M-5 -6 L3 0 L-5 6"
                  transform={`translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${a.rot.toFixed(1)})`}
                />
              ))}
            </svg>

            {/* the highlighted slot (position 1) */}
            <span className="da-slot" style={{ left: pct(px(0)), top: pct(py(0)) }} aria-hidden="true" />

            {/* centre: progress ring + detail of the active step */}
            <div className="da-center">
              <div className="da-ring">
                <svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
                  <circle className="da-ring-track" cx="60" cy="60" r="54" />
                  <motion.circle
                    key={phase === 'running' ? `r${tick}` : 'static'}
                    className="da-ring-progress"
                    cx="60"
                    cy="60"
                    r="54"
                    pathLength="1"
                    initial={phase === 'running' ? { pathLength: 0 } : false}
                    animate={{ pathLength: phase === 'resetting' ? 0 : 1 }}
                    transition={{ duration: phase === 'running' ? TICK_MS / 1000 : 0.7, ease: phase === 'running' ? 'linear' : EASE }}
                  />
                </svg>
                <div className="da-ring-text">
                  <span className="da-ring-count">
                    {String(overview ? N : activeIndex + 1).padStart(2, '0')}
                    <small> / 09</small>
                  </span>
                  <span className="da-ring-label">Our Development Process</span>
                </div>
              </div>

              <div className="da-detail" aria-live="off">
                <AnimatePresence mode="wait" initial={false}>
                  {overview ? (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <h3 className="da-detail-title">All Steps Complete</h3>
                      <p className="da-detail-text">From requirements to ongoing support, all nine steps of our process.</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeStep.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <span className="da-detail-icon" aria-hidden="true">
                        <ActiveIcon size={18} strokeWidth={2.3} />
                      </span>
                      <h3 className="da-detail-title">
                        <span>{String(activeStep.id).padStart(2, '0')}</span> {activeStep.title}
                      </h3>
                      <p className="da-detail-text">{activeStep.text}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Only the (up to) four steps in the window are rendered. A step that leaves on the left is
                removed from the list (AnimatePresence plays its exit), and a new one is added on the right. */}
            <AnimatePresence initial={false} custom={exitMode}>
              {windowSteps.map(({ step: s, k }) => {
                const Icon = s.icon;
                const slot = k - tick;                       // running: 0 (highlighted, left) ... 3 (right)
                const isActive = !overview && slot === 0;
                const target = overview
                  ? { left: pct(xa(ovAng(k))), top: pct(ya(ovAng(k))), scale: OV_SCALE }
                  : { left: pct(px(slot)), top: pct(py(slot)), scale: isActive ? ZOOM : 1 };
                return (
                  <motion.div
                    key={s.id}
                    custom={exitMode}
                    className={`da-node${isActive ? ' is-active' : ''}${overview ? ' is-overview' : ''}`}
                    style={{ x: '-50%', y: '-50%' }}
                    initial={{ left: pct(px(VISIBLE)), top: pct(py(VISIBLE)), opacity: 0, scale: 0.75 }}
                    animate={{
                      ...target,
                      opacity: 1,
                      transition: {
                        duration: TRAVEL_S,
                        ease: EASE,
                        delay: overview ? k * 0.04 : 0,
                        scale: { duration: 0.7, ease: EASE },
                      },
                    }}
                    variants={{
                      exit: (mode) =>
                        mode === 'fade'
                          ? { opacity: 0, scale: 0.6, transition: { duration: 0.5, ease: EASE } }
                          : {
                              left: pct(px(-1)),
                              top: pct(py(-1)),
                              opacity: 0,
                              scale: 0.75,
                              transition: { duration: TRAVEL_S, ease: EASE },
                            },
                    }}
                    exit="exit"
                    aria-hidden="true"
                  >
                    {isActive && <span className="da-pulse" />}
                    <span className="da-dot">
                      <Icon strokeWidth={2.2} />
                      <span className="da-dot-num">{String(s.id).padStart(2, '0')}</span>
                    </span>
                    <span className="da-label">{s.title}</span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* screen-reader version of the same ordered list */}
            <ol className="da-sr">
              {STEPS.map((s) => (
                <li key={s.id}>
                  {s.title}: {s.text}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}