import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function ParallaxBackground({ theme }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const x1 = useSpring(mx, { stiffness: 22, damping: 32 });
  const y1 = useSpring(my, { stiffness: 22, damping: 32 });
  const x2 = useSpring(mx, { stiffness: 14, damping: 28 });
  const y2 = useSpring(my, { stiffness: 14, damping: 28 });

  useEffect(() => {
    const move = (e) => {
      mx.set((e.clientX / window.innerWidth  - 0.5) * 55);
      my.set((e.clientY / window.innerHeight - 0.5) * 55);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [mx, my]);

  const orb = (bg, w, h, top, left, bottom, right, xS, yS) => ({
    position: 'absolute',
    width: w, height: h,
    borderRadius: '50%',
    background: `radial-gradient(circle, ${bg}, transparent 70%)`,
    filter: 'blur(80px)',
    ...(top    !== undefined && { top }),
    ...(left   !== undefined && { left }),
    ...(bottom !== undefined && { bottom }),
    ...(right  !== undefined && { right }),
  });

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <motion.div style={{ ...orb(theme.orb1, '600px', '600px', '8%', '18%', undefined, undefined), x: x1, y: y1 }} />
      <motion.div style={{ ...orb(theme.orb2, '450px', '450px', undefined, undefined, '12%', '14%'), x: x2, y: y2 }} />
    </div>
  );
}
