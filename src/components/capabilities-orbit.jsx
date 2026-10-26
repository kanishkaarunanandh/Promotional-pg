// ---------- 1) Replace getServiceCardAnimation with this ----------
// Cards grow out of the centre video, one after another, clockwise from the top.
const getOrbitCardAnimation = (index, shouldReduceMotion) => {
  if (shouldReduceMotion) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true, amount: 0.15 },
      transition: { duration: 0.3 },
    };
  }
  return {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.6, delay: 0.15 + index * 0.18, ease: [0.22, 1, 0.36, 1] },
  };
};

// ---------- 2) Add this next to SERVICES_OFFERED ----------
// Six cards, 60° apart, starting at 12 o'clock and going clockwise.
const ORBIT_ANGLES = [-90, -30, 30, 90, 150, 210];
const ORBIT_RX = 41; // horizontal radius, % of container width
const ORBIT_RY = 37; // vertical radius, % of container height

const getOrbitPosition = (index) => {
  const rad = (ORBIT_ANGLES[index] * Math.PI) / 180;
  return {
    '--x': `${50 + ORBIT_RX * Math.cos(rad)}%`,
    '--y': `${50 + ORBIT_RY * Math.sin(rad)}%`,
  };
};

// ---------- 3) Replace the whole <div className="capabilities-interactive-composition"> block ----------
