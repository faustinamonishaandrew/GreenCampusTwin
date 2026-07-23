import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TwinLogo } from './TwinLogo';

interface LoadingScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

const LOADING_STEPS = [
  'Connecting to Green Campus...',
  'Loading environmental data...',
  'Initializing Greenie AI...',
  'Preparing Digital Twin...',
  'Generating Dashboard...',
  'Loading complete.',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onComplete,
  durationMs = 2500,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const stepIntervalMs = (durationMs - 400) / (LOADING_STEPS.length - 1);

    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex < LOADING_STEPS.length - 1) {
          return prevIndex + 1;
        }
        return prevIndex;
      });
    }, stepIntervalMs);

    const completionTimer = setTimeout(() => {
      setIsExiting(true);
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 400); // Wait for exit zoom transition
      return () => clearTimeout(finishTimer);
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(completionTimer);
    };
  }, [durationMs, onComplete]);

  const currentStepText = LOADING_STEPS[currentStepIndex];
  const progressPct = Math.round(((currentStepIndex + 1) / LOADING_STEPS.length) * 100);

  // Memoized floating particles
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${10 + Math.random() * 80}%`,
      size: 1.5 + Math.random() * 2.5,
      duration: 4 + Math.random() * 5,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div
      id="loading-screen-container"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0D0B1F] text-white select-none"
    >
      {/* BACKGROUND LAYER: Dark Cinematic Gradient & Ambient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B1F] via-[#17142E] to-[#221C3D]" />

      {/* Ambient Moving Aurora Lights */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-[#8B5CF6]/10 blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] rounded-full bg-[#6EE7B7]/8 blur-[130px] pointer-events-none"
        animate={{
          scale: [1.1, 0.95, 1.1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating Bio-Digital Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#6EE7B7]/25"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              bottom: '-20px',
            }}
            animate={{
              y: [-20, -900],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* FOREGROUND CONTENT: Animated Logo, Loading step progress */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-sm w-full"
        animate={isExiting ? { scale: 1.05, opacity: 0, filter: 'blur(3px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Central Twin Logo with breathing effect */}
        <motion.div
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative flex items-center justify-center mb-6"
        >
          <TwinLogo className="w-24 h-24 sm:w-28 sm:h-28" glow={true} />
        </motion.div>

        {/* Brand Name */}
        <h2 
          className="text-2xl font-bold tracking-[0.2em] text-white pl-[0.2em] uppercase mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          TWIN
        </h2>
        <p className="text-[10px] font-medium text-[#34D399] tracking-widest uppercase mb-12">
          Secure Authentication
        </p>

        {/* Progress bar */}
        <div className="w-full space-y-4 px-4">
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
            <div
              className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#6EE7B7] rounded-full shadow-[0_0_10px_rgba(110,231,183,0.55)] transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Step text cross-fade */}
          <div className="h-6 flex items-center justify-between text-[10px] font-mono tracking-wider">
            <div className="flex-1 text-left">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentStepText}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 0.7, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="text-slate-300 uppercase"
                >
                  {currentStepText}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[#6EE7B7] font-bold">{progressPct}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
