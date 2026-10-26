import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Search, Compass, PenTool, Code2, ShieldCheck, Rocket, TrendingUp } from 'lucide-react';
import './development-phases.css';

// Seven phases. Each has its own accent colour (--c in the CSS), a flat icon
// and a one-word keyword, so the row reads Analyze -> Plan -> Design -> Develop
// -> Test -> Deploy -> Grow.
const PHASES = [
  {
    num: '01',
    keyword: 'Analyze',
    title: 'Discovery',
    description: 'Understand the business, audience, goals, and project requirements.',
    icon: Search,
    color: '#7c6cf2',
  },
  {
    num: '02',
    keyword: 'Plan',
    title: 'Strategy & Planning',
    description: 'Define the project scope, user journey, technology stack, and development roadmap.',
    icon: Compass,
    color: '#06a3da',
  },
  {
    num: '03',
    keyword: 'Design',
    title: 'UI/UX Design',
    description: 'Create intuitive layouts, interactive prototypes, and visually engaging user experiences.',
    icon: PenTool,
    color: '#14b8a6',
  },
  {
    num: '04',
    keyword: 'Develop',
    title: 'Development',
    description: 'Transform approved designs into responsive, functional, and scalable digital solutions.',
    icon: Code2,
    color: '#f2a900',
  },
  {
    num: '05',
    keyword: 'Test',
    title: 'Testing & Quality',
    description: 'Test functionality, responsiveness, performance, and compatibility to ensure quality.',
    icon: ShieldCheck,
    color: '#ff7a45',
  },
  {
    num: '06',
    keyword: 'Deploy',
    title: 'Launch',
    description: 'Deploy the solution, verify the final implementation, and prepare it for real users.',
    icon: Rocket,
    color: '#ec5fa0',
  },
  {
    num: '07',
    keyword: 'Grow',
    title: 'Support & Growth',
    description: 'Monitor performance, resolve issues, and  improve the digital experience.',
    icon: TrendingUp,
    color: '#a35df0',
  },
];

// ---- Step-by-step autoplay ------------------------------------------------
// The light starts at step 01, travels to step 02, and that card zooms in and
// stays highlighted for HOLD_MS. Then the card relaxes while the light travels
// to step 03, and so on up to step 07. After step 07's hold the light travels
// back to step 01 and the whole thing repeats, forever.
const LAST = PHASES.length - 1;
const HOLD_MS = 3000;       // each active card stays zoomed this long after the light arrives
const TRAVEL_MS = 1400;      // light travels one step
const RETURN_MS = 2200;      // light travels from step 07 back to step 01
const START_PAUSE_MS = 1000; // light rests on step 01 before each run

export default function DevelopmentPhases() {
  const reduce = useReducedMotion();

  // pos: where the light is (0..6). active: which card is zoomed (-1 = none).
  const [pos, setPos] = useState(0);
  const [active, setActive] = useState(-1);
  const [travelMs, setTravelMs] = useState(TRAVEL_MS);

  useEffect(() => {
    // Reduced motion: no travelling and no zoom, just the static timeline.
    if (reduce) {
      return undefined;
    }

    let timerId;

    // light moves to step i (taking TRAVEL_MS), then the card zooms in and holds
    const travelTo = (i) => {
      setActive(-1); // the previous card relaxes while the light moves
      setTravelMs(TRAVEL_MS);
      setPos(i);
      timerId = setTimeout(() => {
        setActive(i); // light has arrived: zoom this card (only one at a time)
        timerId = setTimeout(() => {
          if (i < LAST) {
            travelTo(i + 1);
          } else {
            returnToStart();
          }
        }, HOLD_MS);
      }, TRAVEL_MS);
    };

    // after step 07: light glides back to step 01, rests briefly, then repeats
    const returnToStart = () => {
      setActive(-1);
      setTravelMs(RETURN_MS);
      setPos(0);
      timerId = setTimeout(() => travelTo(1), RETURN_MS + START_PAUSE_MS);
    };

    // first run: rest on step 01, then travel to step 02
    timerId = setTimeout(() => travelTo(1), START_PAUSE_MS);

    return () => clearTimeout(timerId);
  }, [reduce]);

  return (
    <section className="webdev-process-section dp-section" id="process">
      <div className="webdev-container">
        <div className="section-header-centered">
          <div className="webdev-eyebrow-wrapper">
            <span className="webdev-eyebrow-accent" aria-hidden="true" />
            <span className="webdev-eyebrow">DEVELOPMENT PHASES</span>
          </div>
          <h2 className="section-heading">OUR METHODOLOGY</h2>
          <p className="section-subheading">
            From the first idea to the final launch, every step is designed to deliver a better digital experience.
          </p>
        </div>

        <div
          className="dp-timeline"
          style={{
            '--dp-p': pos / LAST, // 0..1, position of the light along the line
            '--dp-travel': `${travelMs}ms`,
          }}
        >
          {/* the connecting line, its moving light and the travelling indicator */}
          <div className="dp-track" aria-hidden="true">
            <span className="dp-track-base" />
            <span className="dp-track-sheen" />
            <span className="dp-dot" />
          </div>

          <ol className="dp-list">
            {PHASES.map((phase, i) => {
              const Icon = phase.icon;
              const isActive = active === i;
              return (
                <li
                  key={phase.num}
                  className={`dp-item${isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                  style={{
                    '--c': phase.color,
                    '--float-dur': `${(5.6 + (i % 4) * 0.7).toFixed(1)}s`,
                    '--float-delay': `${(-i * 0.9).toFixed(1)}s`,
                    '--blink-delay': `${(i * 0.45).toFixed(2)}s`,
                  }}
                >
                  <div className="dp-float">
                    <article className="dp-card">
                      <span className="dp-icon" aria-hidden="true">
                        <Icon size={24} strokeWidth={2.2} />
                      </span>
                      <span className="dp-keyword">{phase.keyword}</span>
                      <h3 className="dp-title">{phase.title}</h3>
                      <p className="dp-desc">{phase.description}</p>
                    </article>
                  </div>

                  <span className="dp-stem" aria-hidden="true" />
                  <span className="dp-marker" aria-hidden="true" />
                  <span className="dp-num" aria-label={`Step ${phase.num}`}>
                    <span className="dp-num-text">{phase.num}</span>
                    <span className="dp-num-line" aria-hidden="true" />
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}