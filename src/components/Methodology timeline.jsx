// ---------- 1) Imports ----------
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
// add Check to your existing lucide-react import list:
import { Check } from 'lucide-react';

// ---------- 2) Put this above the component ----------
const STEP_DURATION_MS = 5000; // each step stays on screen for 5 seconds

// ---------- 3) Put these inside WebDevelopmentPage(), next to shouldReduceMotion ----------
const timelineRef = useRef(null);
const timelineInView = useInView(timelineRef, { amount: 0.35 });
const [activeStep, setActiveStep] = useState(0);
const [timelinePaused, setTimelinePaused] = useState(false);

// Advance every 5s while the timeline is on screen and not hovered/focused.
// After the last step it waits 5s, then restarts from step 01.
useEffect(() => {
  if (!timelineInView || timelinePaused) return undefined;
  const id = setTimeout(() => {
    setActiveStep((current) => (current + 1) % METHODOLOGY_STEPS.length);
  }, STEP_DURATION_MS);
  return () => clearTimeout(id);
}, [activeStep, timelineInView, timelinePaused]);



