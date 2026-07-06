import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Camera, User, ArrowRight, Zap, MapPin, DollarSign, Compass, Building2 } from 'lucide-react';
import { Role } from '../types';
import CollablyLogo from './CollablyLogo';
import { playTransitionChime } from '../utils/audio';

interface ContinueScreenProps {
  onRoleSelected: (role: Role) => void;
  key?: string;
}

export default function ContinueScreen({ onRoleSelected }: ContinueScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values to track actual interactive position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High-fidelity physical spring behavior for a luxury tactile response
  const springConfig = { damping: 22, stiffness: 130, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // 3D Tilt perspective mapping based on relative mouse positions
  const rotateX = useTransform(y, [-45, 45], [18, -18]);
  const rotateY = useTransform(x, [-45, 45], [-18, 18]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from cursor to center of logo
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // We want a sweet pull factor (limit the movement to +/- 40px for elegance)
    const pullFactor = 0.38; 
    const targetX = Math.max(-40, Math.min(40, distanceX * pullFactor));
    const targetY = Math.max(-40, Math.min(40, distanceY * pullFactor));

    mouseX.set(targetX);
    mouseY.set(targetY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const touch = e.touches[0];
    const distanceX = touch.clientX - centerX;
    const distanceY = touch.clientY - centerY;
    
    const pullFactor = 0.38; 
    const targetX = Math.max(-40, Math.min(40, distanceX * pullFactor));
    const targetY = Math.max(-40, Math.min(40, distanceY * pullFactor));

    mouseX.set(targetX);
    mouseY.set(targetY);
  };

  const handleTouchEnd = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      id="continue-container"
      className="relative min-h-screen flex flex-col justify-between bg-transparent text-white px-6 py-12 md:py-16 selection:bg-white selection:text-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Clean Premium Dark Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none bg-[#0A0A0A]" />

      {/* Top Header - Minimal Logo */}
      <div className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xs font-display font-bold tracking-[0.25em] text-white">COLLABLY</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-12 flex flex-col items-center">
        {/* Centered Premium Logo with Interactive 3D Magnetic Tilt and Glow Parallax */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchMove}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="mb-8 relative cursor-pointer p-6 select-none touch-none"
          style={{ perspective: 1000 }}
        >
          {/* Static Ambient soft glow safely placed outside the 3D preserve-3d context to prevent Safari box-clipping bugs */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#EA4335]/10 via-[#FBBC05]/10 to-[#4285F4]/10 blur-3xl rounded-full scale-110 opacity-70 pointer-events-none" />

          <motion.div 
            style={{ 
              x, 
              y, 
              rotateX, 
              rotateY, 
              transformStyle: "preserve-3d" 
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <div style={{ transform: "translateZ(20px)" }}>
              <CollablyLogo size={112} />
            </div>
          </motion.div>
        </div>

        {/* Action-Oriented Value Proposition */}
        <div className="text-center max-w-2xl mb-12">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            Create. Collaborate. <br />
            <span className="text-logo-gradient font-display">Get Hired.</span>
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-base text-zinc-400 font-sans tracking-normal font-medium max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Everything your production needs. One platform.
          </motion.p>
        </div>

        {/* Premium Feature Highlights */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl border-t border-zinc-900/60 pt-10 mb-14"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Highlight 1 */}
          <motion.div 
            className="flex items-start space-x-3.5 group cursor-default"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 bg-zinc-900/80 rounded-lg text-white border border-zinc-800/80 mt-0.5 flex-shrink-0 group-hover:border-zinc-700 group-hover:bg-zinc-900 transition-all duration-300">
              <Zap className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase mb-1">Instant Hiring</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">Find available professionals within minutes.</p>
            </div>
          </motion.div>

          {/* Highlight 2 */}
          <motion.div 
            className="flex items-start space-x-3.5 group cursor-default"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 bg-zinc-900/80 rounded-lg text-white border border-zinc-800/80 mt-0.5 flex-shrink-0 group-hover:border-zinc-700 group-hover:bg-zinc-900 transition-all duration-300">
              <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase mb-1">Location Based</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">Discover verified creators near your location.</p>
            </div>
          </motion.div>

          {/* Highlight 3 */}
          <motion.div 
            className="flex items-start space-x-3.5 group cursor-default"
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 bg-zinc-900/80 rounded-lg text-white border border-zinc-800/80 mt-0.5 flex-shrink-0 group-hover:border-zinc-700 group-hover:bg-zinc-900 transition-all duration-300">
              <DollarSign className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase mb-1">Budget Friendly</h3>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">Hire according to your project budget.</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Selection Cards (Glassmorphism & Lift Animations) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Card 1: Hire Production for Reels */}
          <motion.div
            id="card-hire"
            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-zinc-900 bg-zinc-950/45 backdrop-blur-md hover:bg-zinc-950/75 hover:border-zinc-800/80 cursor-pointer transition-all duration-300 select-none shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            onClick={() => {
              playTransitionChime();
              onRoleSelected('hire');
            }}
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div>
              {/* Icon Box */}
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400 group-hover:border-cyan-400/50 transition-colors">
                <Camera className="w-4 h-4" strokeWidth={2} />
              </div>

              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Hire Production Crew
              </h2>
              
              <p className="text-zinc-400 font-sans text-xs leading-relaxed mb-8">
                Skip the endless search. Hire top editors, videographers, cinematographers, and graphic designers ready to make high-retention video content.
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-white tracking-wide">
              <span>Find & Book Crew</span>
              <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>

          {/* Card 2: Find Your Creator for Brand Agency */}
          <motion.div
            id="card-creator"
            className="group relative flex flex-col justify-between p-8 rounded-2xl border border-zinc-900 bg-zinc-950/45 backdrop-blur-md hover:bg-zinc-950/75 hover:border-zinc-800/80 cursor-pointer transition-all duration-300 select-none shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            onClick={() => {
              playTransitionChime();
              onRoleSelected('creator');
            }}
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div>
              {/* Icon Box */}
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6 text-violet-400 group-hover:border-violet-400/50 transition-colors">
                <Compass className="w-4 h-4" strokeWidth={2} />
              </div>

              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Find Brand Creators
              </h2>
              
              <p className="text-zinc-400 font-sans text-xs leading-relaxed mb-8">
                Connect with high-tier content creators and influencers to scale your brand's digital presence and run targeted campaigns.
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-white tracking-wide">
              <span>Find & Book Creator</span>
              <ArrowRight className="ml-1.5 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </motion.div>
        </div>

        {/* Showcase Your Talent - Separately Set for User's Own Information */}
        <motion.div
          id="showcase-talent-banner"
          className="mt-8 p-6 rounded-2xl border border-zinc-900 bg-zinc-950/45 backdrop-blur-md hover:bg-zinc-950/75 hover:border-zinc-800/80 cursor-pointer transition-all duration-300 select-none shadow-[0_20px_50px_rgba(0,0,0,0.2)] max-w-4xl w-full flex flex-col sm:flex-row items-center justify-between gap-6"
          onClick={() => {
            playTransitionChime();
            onRoleSelected('talent');
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="text-center sm:text-left">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center justify-center sm:justify-start gap-2">
              <User className="w-4 h-4 text-pink-400" strokeWidth={2} />
              Showcase Your Talent
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-xl">
              Build your professional creator identity, set your day rates, define your core film gear, and get hired. (For creators & designers).
            </p>
          </div>
          <div className="flex items-center text-xs font-bold text-pink-400 tracking-wide bg-pink-500/10 hover:bg-pink-500/20 px-4 py-2 rounded-xl border border-pink-500/20 transition-all duration-300 shrink-0">
            <span>Build My Profile</span>
            <ArrowRight className="ml-2 w-3.5 h-3.5" />
          </div>
        </motion.div>
      </div>

      {/* Footer Text */}
      <div className="relative z-10 max-w-6xl mx-auto w-full text-center mt-6">
        <motion.p 
          className="text-[10px] font-sans text-zinc-500 tracking-wider uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          You can switch your role anytime later.
        </motion.p>
      </div>
    </motion.div>
  );
}
