import React from 'react';
import { motion } from 'motion/react';
import CollablyLogo from './CollablyLogo';
import DynamicSmokeBackground from './DynamicSmokeBackground';

interface SplashScreenProps {
  onComplete: () => void;
  key?: string;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  // Split the word COLLABLY into letters for premium staggered blur reveal
  const titleLetters = "COLLABLY".split("");

  return (
    <motion.div
      id="splash-container"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.02,
        filter: "blur(12px)",
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } 
      }}
    >
      {/* Single Unified Cinematic Creative Studio Background (No animation, matching team selection page) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
        <div className="absolute inset-0 opacity-[0.92]">
          <img 
            src="https://images.unsplash.com/photo-1579165466541-74e2b49699a4?auto=format&fit=crop&w=1600&q=80" 
            alt="Cinematic production camera" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Premium matte gradient layers - kept subtle to ensure image is highly visible at 90% view */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.05)_10%,#0A0A0A_25%)]" />
      </div>

      {/* Dynamic Thin Black Smoke Background drifting over the image */}
      <DynamicSmokeBackground />

      {/* Cinematic Vignette overlay - lightened to 30% for high image visibility */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-30" 
        style={{
          background: 'radial-gradient(circle, transparent 30%, rgba(0, 0, 0, 0.8) 100%)'
        }}
      />

      <div className="relative flex flex-col items-center z-20">
        {/* Cinematic Logo Mark with Orbiting Apps Intro */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Ambient glowing radial pulse behind logo */}
          <motion.div 
            className="absolute w-36 h-36 rounded-full bg-zinc-500/5 blur-[50px] pointer-events-none"
            animate={{
              scale: [1, 1.2, 0.95, 1.15, 1],
              opacity: [0.2, 0.4, 0.15, 0.3, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <CollablyLogo 
            size={112} 
            animatedIntro={true} 
            onIntroComplete={onComplete} 
          />
        </div>

        {/* Wordmark and Tagline */}
        <div className="mt-8 text-center flex flex-col items-center px-4">
          {/* COLLABLY Wordmark - Staggered Blur Reveal */}
          <div className="flex justify-center items-center overflow-hidden">
            {titleLetters.map((char, idx) => (
              <motion.span
                key={idx}
                className="inline-block text-3xl md:text-4xl font-display font-extrabold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400 select-none pl-[0.25em]"
                initial={{ opacity: 0, y: 35, filter: "blur(12px)" }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  filter: "blur(0px)",
                  transition: { 
                    delay: 2.1 + idx * 0.08, 
                    duration: 1.0, 
                    ease: [0.16, 1, 0.3, 1] 
                  } 
                }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Premium Tagline */}
          <motion.p
            className="mt-4 text-xs font-sans font-medium text-zinc-500 tracking-[0.25em] uppercase select-none"
            initial={{ opacity: 0, y: 15 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              transition: { 
                delay: 3.1, 
                duration: 1.2, 
                ease: [0.16, 1, 0.3, 1] 
              } 
            }}
          >
            Create Together.
          </motion.p>
        </div>
      </div>

      {/* Subtle cinematic anamorphic light bars */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent" />
    </motion.div>
  );
}
