import React, { useEffect, useRef } from 'react';

export default function DynamicSmokeBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle window resize smoothly
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Core Brand Colors for the 60% mixed smoke background
    const colors = [
      { r: 234, g: 67, b: 53 },   // Red (#EA4335)
      { r: 251, g: 188, b: 5 },   // Yellow (#FBBC05)
      { r: 52, g: 168, b: 83 },   // Green (#34A853)
      { r: 66, g: 133, b: 244 },  // Blue (#4285F4)
    ];

    // Smoke Wisps / Clouds: slow-moving atmospheric bodies
    interface Wisp {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: typeof colors[0];
      baseAlpha: number;
      alpha: number;
      phaseX: number;
      phaseY: number;
      speedX: number;
      speedY: number;
    }

    const wisps: Wisp[] = [];
    const numWisps = 10; // Highly optimized, clean subtle density

    for (let i = 0; i < numWisps; i++) {
      const colorIndex = i % colors.length;
      wisps.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15, // Halved for ultra-gentle movement
        vy: -0.06 - Math.random() * 0.1, // extremely slow rising smoke
        radius: 180 + Math.random() * 160,
        color: colors[colorIndex],
        baseAlpha: 0.04 + Math.random() * 0.06, // Reduced base alpha for beautiful, thin smoke
        alpha: 0,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        speedX: 0.001 + Math.random() * 0.0015,
        speedY: 0.0005 + Math.random() * 0.001,
      });
    }

    // Ribbon trails representing elegant rising vapor
    interface Ribbon {
      points: { x: number; y: number }[];
      color: typeof colors[0];
      width: number;
      phase: number;
      speed: number;
      opacity: number;
    }

    const ribbons: Ribbon[] = [];
    const numRibbons = 4;

    for (let i = 0; i < numRibbons; i++) {
      const pCount = 14;
      const points = [];
      const segmentHeight = height / (pCount - 1);
      
      for (let j = 0; j < pCount; j++) {
        points.push({
          x: (width / 5) * (i + 1) + (Math.random() - 0.5) * 120,
          y: height - j * segmentHeight,
        });
      }

      ribbons.push({
        points,
        color: colors[i % colors.length],
        width: 8 + Math.random() * 10,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.004,
        opacity: 0.02 + Math.random() * 0.04, // Extremely thin and gentle opacity
      });
    }

    // Main animation cycle
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw volumetric smoke clouds
      wisps.forEach((w) => {
        w.phaseX += w.speedX;
        w.phaseY += w.speedY;

        w.x += w.vx + Math.sin(w.phaseX) * 0.12;
        w.y += w.vy + Math.cos(w.phaseY) * 0.08;

        const edgeFade = Math.min(
          w.y / 150, 
          (height - w.y) / 150, 
          w.x / 150, 
          (width - w.x) / 150
        );
        const targetAlpha = Math.max(0, Math.min(w.baseAlpha, edgeFade * w.baseAlpha));
        w.alpha = w.alpha * 0.95 + targetAlpha * 0.05;

        if (w.y < -w.radius) {
          w.y = height + w.radius;
          w.x = Math.random() * width;
          w.alpha = 0;
        }
        if (w.x < -w.radius) w.x = width + w.radius;
        if (w.x > width + w.radius) w.x = -w.radius;

        const grad = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.radius);
        grad.addColorStop(0, `rgba(${w.color.r}, ${w.color.g}, ${w.color.b}, ${w.alpha})`);
        grad.addColorStop(0.5, `rgba(${w.color.r}, ${w.color.g}, ${w.color.b}, ${w.alpha * 0.35})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // 2. Draw soft wavy ribbons of rising vapor
      ribbons.forEach((r) => {
        r.phase += r.speed;

        ctx.beginPath();
        const startX = r.points[0].x + Math.sin(r.phase) * 30;
        ctx.moveTo(startX, height);

        for (let i = 1; i < r.points.length; i++) {
          const pt = r.points[i];
          const waveOffset = Math.sin(r.phase + i * 0.42) * (40 + i * 3.5);
          const currentX = pt.x + waveOffset;
          const currentY = pt.y;

          const prevPt = r.points[i - 1];
          const prevWaveOffset = Math.sin(r.phase + (i - 1) * 0.42) * (40 + (i - 1) * 3.5);
          const prevX = prevPt.x + prevWaveOffset;
          const prevY = prevPt.y;

          const cpX1 = prevX;
          const cpY1 = (prevY + currentY) / 2;
          const cpX2 = currentX;
          const cpY2 = cpY1;

          ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, currentX, currentY);
        }

        ctx.strokeStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, ${r.opacity})`;
        ctx.lineWidth = r.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed -inset-16 w-[calc(100%+128px)] h-[calc(100%+128px)] pointer-events-none select-none z-0 filter blur-[35px] opacity-60"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
