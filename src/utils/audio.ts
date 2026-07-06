/**
 * Generates and plays a premium, luxury high-tech chime/swell
 * using the Web Audio API (no external file downloads needed).
 */
export function playTransitionChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Ensure we resume the audio context in case it is suspended (browser security policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // --- Warm Ambient Swell/Swoosh (Deep & Cinematic) ---
    const swellOsc = ctx.createOscillator();
    const swellGain = ctx.createGain();
    
    swellOsc.type = 'sine';
    swellOsc.frequency.setValueAtTime(90, now);
    swellOsc.frequency.exponentialRampToValueAtTime(180, now + 0.8);
    
    swellGain.gain.setValueAtTime(0, now);
    swellGain.gain.linearRampToValueAtTime(0.12, now + 0.3); // Increased volume for rich cinematic warmth
    swellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
    
    swellOsc.connect(swellGain);
    swellGain.connect(ctx.destination);
    
    swellOsc.start(now);
    swellOsc.stop(now + 1.4);

    // --- Luxury High-End Chime (Sleek, Staggered Arpeggio) ---
    // Beautiful E major 9 chord notes for a high-end, futuristic SaaS vibe
    const notes = [659.25, 830.61, 987.77, 1244.51, 1479.98];
    const delayStep = 0.05; // Tight, professional elegant arpeggio

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Triangle waves are softer and cleaner, avoiding harsh square or sharp sine tones
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * delayStep);
      
      const noteStart = now + idx * delayStep;
      
      // Precision Envelope (Lush Attack, Long Luxury Decay)
      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(0, noteStart);
      gain.gain.linearRampToValueAtTime(0.08, noteStart + 0.05); // Faster, more tactile attack
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 2.0); // Generous, long decaying ring
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(noteStart);
      osc.stop(noteStart + 2.2);
    });

  } catch (err) {
    console.warn('Audio play prevented or unsupported:', err);
  }
}
