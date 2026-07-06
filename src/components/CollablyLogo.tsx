import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Youtube, Instagram, Video, Music, Scissors, Sparkles, Layers, Film } from 'lucide-react';
import { playTransitionChime } from '../utils/audio';

interface CollablyLogoProps {
  className?: string;
  size?: number; // Visual size in pixels
  animatedIntro?: boolean;
  onIntroComplete?: () => void;
}

interface Particle {
  x: number;          // Current position X (virtual 48x48 space)
  y: number;          // Current position Y
  homeX: number;      // Target shape position X
  homeY: number;      // Target shape position Y
  vx: number;         // Velocity X
  vy: number;         // Velocity Y
  color: string;      // RGB color string
  r: number;          // Red channel
  g: number;          // Green channel
  b: number;          // Blue channel
  size: number;       // Current drawing radius
  originalSize: number;
  alpha: number;      // Current opacity
  phaseOffset: number; // Unique wave phase offset
}

// Color interpolation for brand gradient
function interpolateColor(c1: {r: number, g: number, b: number}, c2: {r: number, g: number, b: number}, factor: number) {
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  return { r, g, b };
}

function getBrandColorRGB(t: number) {
  const colors = [
    { r: 234, g: 67, b: 53 },   // Red (#EA4335)
    { r: 251, g: 188, b: 5 },   // Yellow (#FBBC05)
    { r: 52, g: 168, b: 83 },   // Green (#34A853)
    { r: 66, g: 133, b: 244 },  // Blue (#4285F4)
  ];

  if (t < 0.35) {
    return interpolateColor(colors[0], colors[1], t / 0.35);
  } else if (t < 0.70) {
    return interpolateColor(colors[1], colors[2], (t - 0.35) / 0.35);
  } else {
    return interpolateColor(colors[2], colors[3], (t - 0.70) / 0.30);
  }
}

// Orbiting apps removed for pristine cinematic C-logo draw animation

export default function CollablyLogo({ className = '', size = 32, animatedIntro = false, onIntroComplete }: CollablyLogoProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeSmokeRef = useRef<Particle[]>([]); // Interactive heavy smoke puffs
  const [svgOpacity] = useState<number>(1); // Set directly to 1 to show crisp C instantly
  const animationFrameIdRef = useRef<number | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean, px: number, py: number }>({ x: 0, y: 0, active: false, px: 0, py: 0 });
  const timeRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);

  // States for spectacular Gemini-style drawing intro animation
  const [introStep, setIntroStep] = useState<'orbiting' | 'completed'>(
    animatedIntro ? 'orbiting' : 'completed'
  );
  const hasExplodedRef = useRef(false);

  // Set up canvas overlay size & bounds
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const multiplier = 8; // Large coverage multiplier to prevent any box clipping
    canvas.width = size * multiplier * dpr;
    canvas.height = size * multiplier * dpr;
    canvas.style.width = `${size * multiplier}px`;
    canvas.style.height = `${size * multiplier}px`;
  }, [size]);

  // Clean up any running animation frames on unmount
  useEffect(() => {
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Butter smooth draw animation and transition timeline
  useEffect(() => {
    if (!animatedIntro) return;

    let startTime = Date.now();
    let animFrameId: number;
    const duration = 2000; // total duration of draw phase

    const tick = () => {
      const elapsed = Date.now() - startTime;

      if (elapsed < 1600) {
        setIntroStep('orbiting');
      } else {
        setIntroStep('completed');

        if (!hasExplodedRef.current) {
          hasExplodedRef.current = true;
          
          // Play premium audio chime
          playTransitionChime();
          
          // Seed 48 colorful high-velocity smoke explosion particles in the Canvas
          // Using elegant original multicolor brand spectrum
          const explosionColors = [
            { r: 234, g: 67, b: 53 },   // Red (#EA4335)
            { r: 251, g: 188, b: 5 },   // Yellow (#FBBC05)
            { r: 52, g: 168, b: 83 },   // Green (#34A853)
            { r: 66, g: 133, b: 244 },  // Blue (#4285F4)
          ];

          for (let i = 0; i < 48; i++) {
            const col = explosionColors[Math.floor(Math.random() * explosionColors.length)];
            const angle = Math.random() * Math.PI * 2;
            const speed = 2.0 + Math.random() * 4.8;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed - 0.3;

            activeSmokeRef.current.push({
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 2,
              homeX: 0,
              homeY: 0,
              vx,
              vy,
              color: `rgb(${col.r}, ${col.g}, ${col.b})`,
              r: col.r,
              g: col.g,
              b: col.b,
              size: 3.0 + Math.random() * 3.8,
              originalSize: 3.0 + Math.random() * 3.8,
              alpha: 0.9,
              phaseOffset: Math.random() * 100,
              disperseTimer: 70 + Math.floor(Math.random() * 30),
            } as any);
          }

          // Force-render loop to start for the explosion
          if (animationFrameIdRef.current === null) {
            triggerRenderLoop();
          }

          if (onIntroComplete) {
            setTimeout(() => {
              onIntroComplete();
            }, 1000); // Smoother, faster transition (1s after explosion triggers)
          }
        }
      }

      if (elapsed < duration) {
        animFrameId = requestAnimationFrame(tick);
      }
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [animatedIntro, onIntroComplete]);

  // Spawn thick heavy smoke clouds from cursor on hover/interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;

    const multiplier = 8;
    const translateVal = 48 * (multiplier - 1) / 2;
    const currentX = rx * 48 * multiplier - translateVal;
    const currentY = ry * 48 * multiplier - translateVal;

    const m = mouseRef.current;
    // Calculate velocity for kinetic smoke dispersion
    const dx = currentX - m.px;
    const dy = currentY - m.py;

    m.x = currentX;
    m.y = currentY;
    m.px = currentX;
    m.py = currentY;

    // Spawn 2 premium heavy smoke puffs with brand colors per mousemove tick
    const colors = [
      { r: 234, g: 67, b: 53 },   // Red
      { r: 251, g: 188, b: 5 },   // Yellow
      { r: 52, g: 168, b: 83 },   // Green
      { r: 66, g: 133, b: 244 },  // Blue
    ];

    for (let i = 0; i < 2; i++) {
      const col = colors[Math.floor(Math.random() * colors.length)];
      // Random push offset matching speed
      const pushX = dx * 0.25 + (Math.random() - 0.5) * 1.5;
      const pushY = dy * 0.25 + (Math.random() - 0.5) * 1.5;

      activeSmokeRef.current.push({
        x: currentX + (Math.random() - 0.5) * 3,
        y: currentY + (Math.random() - 0.5) * 3,
        homeX: currentX,
        homeY: currentY,
        vx: pushX,
        vy: pushY,
        color: `rgb(${col.r}, ${col.g}, ${col.b})`,
        r: col.r,
        g: col.g,
        b: col.b,
        size: 2.2 + Math.random() * 2.5, // Very thick, fluffy puff sizes
        originalSize: 2.2 + Math.random() * 2.5,
        alpha: 0.8,
        phaseOffset: Math.random() * 100,
        disperseTimer: 60 + Math.floor(Math.random() * 25), // lifespan
      } as any);
    }

    // Trigger loop execution if stopped
    if (animationFrameIdRef.current === null) {
      triggerRenderLoop();
    }
  };

  const triggerRenderLoop = () => {
    const loop = () => {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, c.width, c.height);
      ctx.save();
      const multiplier = 8;
      ctx.scale(c.width / (48 * multiplier), c.height / (48 * multiplier));
      const translateVal = 48 * (multiplier - 1) / 2;
      ctx.translate(translateVal, translateVal);

      timeRef.current += 1;
      const tVal = timeRef.current;

      activeSmokeRef.current.forEach((p) => {
        p.disperseTimer = (p.disperseTimer || 0) - 1;

        p.vy -= 0.015; // float up
        p.vx += Math.sin(tVal * 0.05 + p.phaseOffset) * 0.05;

        p.vx *= 0.86;
        p.vy *= 0.86;

        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.disperseTimer / 75;
        p.alpha = Math.max(0, lifeRatio * 0.7);
        p.size = Math.max(0.1, p.originalSize * (1.2 + (1.0 - lifeRatio) * 4.6));

        if (p.size > 0 && p.alpha > 0) {
          const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          radGrad.addColorStop(0, `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha})`);
          radGrad.addColorStop(0.4, `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha * 0.35})`);
          radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = radGrad;
          ctx.fill();
        }
      });

      activeSmokeRef.current = activeSmokeRef.current.filter((p) => p.disperseTimer > 0);

      ctx.restore();

      if (activeSmokeRef.current.length > 0 || isHoveredRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(loop);
      } else {
        animationFrameIdRef.current = null;
        ctx.clearRect(0, 0, c.width, c.height);
      }
    };
    animationFrameIdRef.current = requestAnimationFrame(loop);
  };

  const [isHoveredState, setIsHoveredState] = useState(false);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    mouseRef.current.active = true;
    setIsHoveredState(true);
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    mouseRef.current.active = false;
    setIsHoveredState(false);
  };

  return (
    <div 
      className={`${className} relative flex items-center justify-center`} 
      style={{ width: size, height: size }}
    >
      {/* 1. PRISTINE VECTOR ORIGINAL C-SHAPE */}
      <motion.div
        className="absolute flex items-center justify-center pointer-events-none select-none z-0"
        style={{
          width: size,
          height: size,
        }}
        initial={animatedIntro ? { scale: 0.3, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={{
          scale: introStep === 'completed' && isHoveredState ? 1.08 : 1.0,
          opacity: 1,
          filter: isHoveredState ? 'drop-shadow(0 0 16px rgba(251, 188, 5, 0.45))' : 'drop-shadow(0 0 0px rgba(0,0,0,0))',
        }}
        transition={animatedIntro ? { 
          type: "spring",
          stiffness: 120,
          damping: 14,
          mass: 0.7
        } : { duration: 0.2 }}
      >
        <svg
          className="w-full h-full transition-all duration-300"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="glowWide" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="glowMedium" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" />
            </filter>
            <linearGradient id="brandRedYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA4335" />
              <stop offset="100%" stopColor="#FBBC05" />
            </linearGradient>
            <linearGradient id="brandYellowGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBC05" />
              <stop offset="100%" stopColor="#34A853" />
            </linearGradient>
            <linearGradient id="brandGreenBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34A853" />
              <stop offset="100%" stopColor="#4285F4" />
            </linearGradient>
            <linearGradient id="brandBlueRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="100%" stopColor="#EA4335" />
            </linearGradient>
          </defs>

          {/* Layer 1: Volumetric Aurora Glow (Wide & Blurry) */}
          <motion.path
            d="M 33.9,14.1 A 14,14 0 1,0 33.9,33.9"
            stroke="url(#brandRedYellow)"
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowWide)"
            className="opacity-20 pointer-events-none"
            initial={animatedIntro ? { pathLength: 0 } : { pathLength: 1 }}
            animate={{ pathLength: 1 }}
            transition={animatedIntro ? { duration: 1.8, ease: "easeInOut", delay: 0.1 } : { duration: 0.1 }}
          />

          {/* Layer 2: Core Glow (Medium Blurry) */}
          <motion.path
            d="M 33.9,14.1 A 14,14 0 1,0 33.9,33.9"
            stroke="url(#brandGreenBlue)"
            strokeWidth={12}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowMedium)"
            className="opacity-30 pointer-events-none"
            initial={animatedIntro ? { pathLength: 0 } : { pathLength: 1 }}
            animate={{ pathLength: 1 }}
            transition={animatedIntro ? { duration: 1.6, ease: "easeInOut", delay: 0.2 } : { duration: 0.1 }}
          />

          {/* Active Fluid Blended Gradients (Animate Opacities for Premium Moving Lights Effect) */}
          {/* Path A: Red to Yellow */}
          <motion.path
            d="M 33.9,14.1 A 14,14 0 1,0 33.9,33.9"
            stroke="url(#brandRedYellow)"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animatedIntro ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.9 }}
            animate={animatedIntro ? { 
              pathLength: 1,
              opacity: [0.9, 0.15, 0.15, 0.9],
            } : {
              opacity: [0.9, 0.15, 0.15, 0.9],
            }}
            transition={{
              pathLength: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
              opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Path B: Yellow to Green */}
          <motion.path
            d="M 33.9,14.1 A 14,14 0 1,0 33.9,33.9"
            stroke="url(#brandYellowGreen)"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animatedIntro ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.15 }}
            animate={animatedIntro ? { 
              pathLength: 1,
              opacity: [0.15, 0.9, 0.15, 0.15],
            } : {
              opacity: [0.15, 0.9, 0.15, 0.15],
            }}
            transition={{
              pathLength: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
              opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Path C: Green to Blue */}
          <motion.path
            d="M 33.9,14.1 A 14,14 0 1,0 33.9,33.9"
            stroke="url(#brandGreenBlue)"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animatedIntro ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.15 }}
            animate={animatedIntro ? { 
              pathLength: 1,
              opacity: [0.15, 0.15, 0.9, 0.15],
            } : {
              opacity: [0.15, 0.15, 0.9, 0.15],
            }}
            transition={{
              pathLength: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
              opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
            }}
          />

          {/* Path D: Blue to Red */}
          <motion.path
            d="M 33.9,14.1 A 14,14 0 1,0 33.9,33.9"
            stroke="url(#brandBlueRed)"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animatedIntro ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.15 }}
            animate={animatedIntro ? { 
              pathLength: 1,
              opacity: [0.15, 0.15, 0.15, 0.9],
            } : {
              opacity: [0.15, 0.15, 0.15, 0.9],
            }}
            transition={{
              pathLength: { duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
              opacity: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        </svg>
      </motion.div>

      {/* 2. HIGH-VOLUME HEAVY SMOKE PARTICLE CANVAS OVERLAY */}
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-auto select-none overflow-visible cursor-pointer z-10"
        style={{
          width: size * 8,
          height: size * 8,
          left: -size * 3.5,
          top: -size * 3.5,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        title="Interactive Logo"
      />
    </div>
  );
}
