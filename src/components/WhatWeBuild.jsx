import { Fragment, useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import './what-we-build.css';

const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------------------------------------------ *
 *  Path geometry (computed once, no DOM needed)
 *  A single smooth curve in a 1200 x 460 space that passes through six
 *  nodes, alternating a little above / below the centre line.
 * ------------------------------------------------------------------ */
const VB_W = 1200;
const VB_H = 460;
const MID = 230;
const COUNT = 6;
const nodeX = (i) => 130 + 188 * i;
const nodeY = (i) => (i % 2 === 0 ? MID - 25 : MID + 25);

const ANCHORS = [
  [0, MID],
  ...Array.from({ length: COUNT }, (_, i) => [nodeX(i), nodeY(i)]),
  [VB_W, MID],
];
const SEGMENTS = ANCHORS.slice(1).map((p, k) => {
  const [x0, y0] = ANCHORS[k];
  const [x1, y1] = p;
  const dx = (x1 - x0) / 2;
  return [x0, y0, x0 + dx, y0, x1 - dx, y1, x1, y1]; // cubic with horizontal tangents -> x never goes backwards
});
const PATH_D = `M${ANCHORS[0][0]} ${ANCHORS[0][1]} ${SEGMENTS.map((s) => `C${s[2]} ${s[3]} ${s[4]} ${s[5]} ${s[6]} ${s[7]}`).join(' ')}`;

// sample every segment into a lookup table: cumulative length -> point
const STEPS_PER_SEG = 90;
const TABLE = (() => {
  const pts = [[ANCHORS[0][0], ANCHORS[0][1], 0]];
  const nodeLens = [];
  let total = 0;
  SEGMENTS.forEach((s, k) => {
    for (let n = 1; n <= STEPS_PER_SEG; n += 1) {
      const t = n / STEPS_PER_SEG;
      const u = 1 - t;
      const x = u ** 3 * s[0] + 3 * u * u * t * s[2] + 3 * u * t * t * s[4] + t ** 3 * s[6];
      const y = u ** 3 * s[1] + 3 * u * u * t * s[3] + 3 * u * t * t * s[5] + t ** 3 * s[7];
      const prev = pts[pts.length - 1];
      total += Math.hypot(x - prev[0], y - prev[1]);
      pts.push([x, y, total]);
    }
    if (k < COUNT) nodeLens.push(total); // end of segment k is node k
  });
  return { pts, total, nodeLens };
})();
const FR = TABLE.nodeLens.map((l) => l / TABLE.total); // node positions as a 0..1 fraction of the path

function pointAt(frac) {
  const target = Math.min(Math.max(frac, 0), 1) * TABLE.total;
  const { pts } = TABLE;
  let lo = 0;
  let hi = pts.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (pts[mid][2] <= target) lo = mid;
    else hi = mid;
  }
  const a = pts[lo];
  const b = pts[hi];
  const span = b[2] - a[2] || 1;
  const r = (target - a[2]) / span;
  return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r];
}

/* one loop of the journey: particle waits, glides to each node, rests there, then leaves the path */
const START_HOLD = 0.4;
const MOVE_FIRST = 1.4;
const MOVE = 1.0;
const DWELL = 1.1;
const MOVE_OUT = 1.2;
const TIMELINE = (() => {
  const values = [0, 0];
  const durs = [0, START_HOLD];
  FR.forEach((f, i) => {
    values.push(f, f);
    durs.push(i === 0 ? MOVE_FIRST : MOVE, DWELL);
  });
  values.push(1);
  durs.push(MOVE_OUT);
  const total = durs.reduce((a, b) => a + b, 0);
  let acc = 0;
  const times = durs.map((d) => {
    acc += d;
    return acc / total;
  });
  return { values, times, total };
})();

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

const HEADING = 'Software Built Around How You Work'.split(' ');

// a few faint drifting specks (decoration only)
const SPECKS = [
  { l: '6%', t: '18%', s: 3, d: 0, u: 16 },
  { l: '14%', t: '72%', s: 2, d: -5, u: 20 },
  { l: '27%', t: '40%', s: 2, d: -9, u: 18 },
  { l: '41%', t: '12%', s: 3, d: -3, u: 22 },
  { l: '55%', t: '84%', s: 2, d: -12, u: 17 },
  { l: '68%', t: '30%', s: 3, d: -7, u: 21 },
  { l: '79%', t: '66%', s: 2, d: -2, u: 19 },
  { l: '90%', t: '16%', s: 3, d: -10, u: 23 },
  { l: '95%', t: '78%', s: 2, d: -6, u: 18 },
];

export default function WhatWeBuild({ items }) {
  const reduce = useReducedMotion();
  const isMobile = useMatch('(max-width: 767px)');
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.25 });

  const progress = useMotionValue(0); // 0..1 along the path: the one shared value everything follows
  const [active, setActive] = useState(-1);
  const [hover, setHover] = useState(-1);
  const controlsRef = useRef(null);

  // ONE looping timeline drives the particle, the trail and which capability is lit
  useEffect(() => {
    if (reduce) return undefined;
    const controls = animate(progress, TIMELINE.values, {
      duration: TIMELINE.total,
      times: TIMELINE.times,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    });
    controlsRef.current = controls;
    controls.pause();
    return () => {
      controls.stop();
      controlsRef.current = null;
    };
  }, [reduce, progress]);

  // run only while the section is on screen
  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    if (inView) c.play();
    else c.pause();
  }, [inView, reduce]);

  useMotionValueEvent(progress, 'change', (v) => {
    if (reduce) return;
    let a = -1;
    for (let i = 0; i < COUNT; i += 1) if (v >= FR[i] - 0.004) a = i;
    setActive(a);
  });

  const fade = useTransform(progress, [0, 0.02, 0.985, 1], [0, 1, 1, 0]);
  const pLeft = useTransform(progress, (v) => `${(pointAt(v)[0] / VB_W) * 100}%`);
  const pTop = useTransform(progress, (v) => `${pointAt(v)[1]}px`);

  /* ---- mobile: particle moves down a vertical timeline ---- */
  const listRef = useRef(null);
  const dotRefs = useRef([]);
  const centers = useRef({ ys: [], h: 0 });
  useEffect(() => {
    if (!isMobile || !listRef.current) return undefined;
    const measure = () => {
      const top = listRef.current.getBoundingClientRect().top;
      centers.current = {
        ys: dotRefs.current.map((el) => (el ? el.getBoundingClientRect().top - top + el.offsetHeight / 2 : 0)),
        h: listRef.current.offsetHeight,
      };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(listRef.current);
    return () => ro.disconnect();
  }, [isMobile]);
  const mobileY = useTransform(progress, (v) => {
    const { ys, h } = centers.current;
    if (!ys.length) return 0;
    const xs = [0, ...FR, 1];
    const out = [Math.max(ys[0] - 40, 0), ...ys, h];
    for (let i = 1; i < xs.length; i += 1) {
      if (v <= xs[i]) {
        const r = (v - xs[i - 1]) / (xs[i] - xs[i - 1] || 1);
        return out[i - 1] + (out[i] - out[i - 1]) * r;
      }
    }
    return h;
  });
  const mobileH = useTransform(mobileY, (y) => `${Math.max(y, 0)}px`);

  const lit = (i) => i === active || i === hover;
  const segStart = hover > 0 ? TABLE.nodeLens[hover - 1] : 0;
  const segLen = hover >= 0 ? TABLE.nodeLens[hover] - segStart : 0;

  const wordVars = {
    hidden: { y: reduce ? 0 : '110%', opacity: reduce ? 1 : 0 },
    visible: { y: 0, opacity: 1, transition: { duration: reduce ? 0.1 : 0.7, ease: EASE } },
  };

  return (
    <section className="wwb" id="what-we-build" ref={rootRef} aria-labelledby="wwb-title">
      <div className="wwb-grid-bg" aria-hidden="true" />
      <div className="wwb-specks" aria-hidden="true">
        {SPECKS.map((s, i) => (
          <span
            key={i}
            style={{ left: s.l, top: s.t, width: s.s, height: s.s, animationDelay: `${s.d}s`, animationDuration: `${s.u}s` }}
          />
        ))}
      </div>

      <div className="wwb-inner">
        <header className="wwb-head">
          <motion.p
            className="wwb-eyebrow"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="wwb-eyebrow-line" aria-hidden="true" />
            WHAT WE BUILD
          </motion.p>

          <motion.h2
            id="wwb-title"
            className="wwb-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            transition={{ staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.1 }}
          >
            {HEADING.map((w, i) => (
              <Fragment key={i}>
                <span className="wwb-word">
                  <motion.span className="wwb-word-in" variants={wordVars}>
                    {w}
                  </motion.span>
                </span>
                {i < HEADING.length - 1 ? ' ' : ''}
              </Fragment>
            ))}
          </motion.h2>

          <motion.span
            className="wwb-underline"
            aria-hidden="true"
            initial={{ scaleX: reduce ? 1 : 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: reduce ? 0.1 : 1, ease: EASE, delay: reduce ? 0 : 0.6 }}
          />

          <motion.p
            className="wwb-sub"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.35 }}
          >
            From first release to long-term growth, we deliver software that is dependable, secure and easy
            to extend.
          </motion.p>
        </header>

        {isMobile ? (
          /* ---------------- phones: vertical flowing timeline ---------------- */
          <ol className="wwb-m" ref={listRef}>
            <span className="wwb-m-line" aria-hidden="true" />
            {!reduce && (
              <>
                <motion.span className="wwb-m-trail" aria-hidden="true" style={{ height: mobileH, opacity: fade }} />
                <motion.span className="wwb-particle wwb-m-particle" aria-hidden="true" style={{ top: mobileY, opacity: fade, y: '-50%' }} />
              </>
            )}
            {items.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className={`wwb-m-item${!reduce && i === active ? ' is-lit' : ''}`}>
                <span className="wwb-m-dot" ref={(el) => { dotRefs.current[i] = el; }} aria-hidden="true" />
                <div className="wwb-m-head">
                  <span className="wwb-icon" aria-hidden="true">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                  <h3 className="wwb-name">{title}</h3>
                </div>
                <p className="wwb-desc">{text}</p>
              </li>
            ))}
          </ol>
        ) : (
          /* ---------------- tablet / desktop: alternating capabilities along one curve ---------------- */
          <div className="wwb-stage">
            <svg className="wwb-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="wwb-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#1e7fd4" />
                  <stop offset="1" stopColor="#06a3da" />
                </linearGradient>
              </defs>
              <path className="wwb-path" d={PATH_D} />
              <path className="wwb-path-flow" d={PATH_D} />
              {/* lit trail left behind the particle */}
              {reduce ? (
                <path className="wwb-trail" d={PATH_D} style={{ opacity: 0.45 }} />
              ) : (
                <motion.path className="wwb-trail" d={PATH_D} style={{ pathLength: progress, opacity: fade }} />
              )}
              {/* highlight of the stretch leading into a hovered capability */}
              <path
                className="wwb-hover-seg"
                d={PATH_D}
                style={{
                  opacity: hover >= 0 ? 1 : 0,
                  strokeDasharray: `${segLen} ${TABLE.total}`,
                  strokeDashoffset: -segStart,
                }}
              />
            </svg>

            {items.map(({ icon: Icon, title, text }, i) => {
              const up = i % 2 === 0;
              const on = reduce || lit(i);
              return (
                <div key={title}>
                  <span
                    className={`wwb-node${lit(i) ? ' is-lit' : ''}`}
                    style={{ left: `${(nodeX(i) / VB_W) * 100}%`, top: nodeY(i) }}
                    aria-hidden="true"
                  />
                  <div
                    className={`wwb-item wwb-item--${up ? 'up' : 'down'}${on ? ' is-lit' : ''}${i === hover ? ' is-hover' : ''}`}
                    style={{
                      left: `${(nodeX(i) / VB_W) * 100}%`,
                      ...(up ? { bottom: VB_H - nodeY(i) + 22 } : { top: nodeY(i) + 22 }),
                    }}
                    onPointerEnter={() => setHover(i)}
                    onPointerLeave={() => setHover((h) => (h === i ? -1 : h))}
                  >
                    <span className="wwb-icon" aria-hidden="true">
                      <Icon size={28} strokeWidth={1.9} />
                    </span>
                    <h3 className="wwb-name">{title}</h3>
                    <p className="wwb-desc">{text}</p>
                  </div>
                </div>
              );
            })}

            {!reduce && (
              <motion.span className="wwb-particle" aria-hidden="true" style={{ left: pLeft, top: pTop, opacity: fade, x: '-50%', y: '-50%' }} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}