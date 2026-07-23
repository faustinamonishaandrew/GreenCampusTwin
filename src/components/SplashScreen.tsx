import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TwinLogo } from './TwinLogo';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2800,
}) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Smooth progress increment using requestAnimationFrame
  useEffect(() => {
    const startTime = Date.now();
    const transitionMs = 500; // 500ms exit transition
    const loadingDuration = Math.max(durationMs - transitionMs, 1000);

    let animationFrameId: number;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / loadingDuration) * 100);

      setProgress(pct);

      if (pct < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setIsExiting(true);
        const exitTimer = setTimeout(() => {
          onFinish();
        }, transitionMs);
        return () => clearTimeout(exitTimer);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [durationMs, onFinish]);

  // Determine message based on progress percentage
  const loadingMessage = useMemo(() => {
    if (progress < 20) return 'Loading...';
    if (progress < 40) return 'Loading Digital Twin...';
    if (progress < 60) return 'Initializing AI...';
    if (progress < 80) return 'Preparing Campus Model...';
    return 'Loading Smart Insights...';
  }, [progress]);

  // Generate memoized floating bio-digital spores/particles
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${5 + Math.random() * 90}%`,
      size: 1.5 + Math.random() * 3,
      duration: 5 + Math.random() * 6,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div
      id="splash-screen-container"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#0D0B1F] text-white select-none"
    >
      {/* 1. BACKGROUND LAYER: Dark Cinematic Gradient & Ambient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B1F] via-[#17142E] to-[#221C3D]" />

      {/* Smooth Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* Minimal Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />

      {/* Ambient Moving Aurora Lights - Reduced intensity for subtlety */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[380px] h-[380px] rounded-full bg-[#8B5CF6]/8 blur-[120px] pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.7, 0.5],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-[#6EE7B7]/8 blur-[130px] pointer-events-none"
        animate={{
          scale: [1.1, 0.9, 1.1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, -30, 0],
          y: [0, 15, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Ambient Depth Overlay */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] pointer-events-none" />

      {/* Floating Bio-Digital Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#6EE7B7]/30"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              bottom: '-20px',
            }}
            animate={{
              y: [-20, -900],
              opacity: [0, 0.8, 0.8, 0],
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

      {/* 2. FOREGROUND CONTENT: Animated Logo, Title, Tagline, Progress */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center p-6 text-center"
        animate={isExiting ? { scale: 1.06, opacity: 0, filter: 'blur(4px)' } : { scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Central Twin Logo Component with breathing animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 1, ease: 'easeOut' },
            scale: { duration: 1, ease: 'easeOut' },
            y: {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            },
          }}
          className="relative flex items-center justify-center"
        >
          {/* Gentle glow behind the logo */}
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-500/20 blur-[60px] pointer-events-none"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <TwinLogo className="w-48 h-48 md:w-56 md:h-56" glow={false} />
        </motion.div>

        {/* App Title Display */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="mt-8 space-y-2 relative z-10"
        >
          <h1 
            className="text-5xl md:text-7xl font-bold tracking-[0.2em] text-white leading-none pl-[0.2em]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            TWIN
          </h1>

          {/* Premium Tagline: Nature Can't Speak. But You Can. */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="text-sm sm:text-base font-light text-[#6EE7B7] tracking-wider uppercase mt-4 px-4 select-none max-w-sm sm:max-w-md"
          >
            Nature Can't Speak. But You Can.
          </motion.p>
        </motion.div>

        {/* Loading Progress & Rotating Message Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 w-full max-w-sm space-y-4 px-4 relative z-10"
        >
          {/* Smooth Text Fade with AnimatePresence */}
          <div className="h-8 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={loadingMessage}
                initial={{ opacity: 0, y: 4, filter: 'blur(2px)' }}
                animate={{ opacity: 0.9, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -4, filter: 'blur(1px)' }}
                transition={{ duration: 0.3 }}
                className="text-sm sm:text-base font-sans font-medium tracking-wide text-white uppercase animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400"
              >
                {loadingMessage}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>

      {/* Swoosh Animated Progress Line at the Absolute Bottom */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5 overflow-hidden"
      >
        <div
          className="h-full bg-gradient-to-r from-transparent via-purple-500 to-[#6EE7B7] shadow-[0_0_15px_rgba(110,231,183,0.8)] transition-all duration-100 ease-out rounded-r-full relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute top-0 right-0 w-20 h-full bg-white opacity-50 blur-sm rounded-full" />
        </div>
      </motion.div>
    </div>
  );
};
