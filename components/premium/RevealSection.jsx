import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const EASING = [0.16, 1, 0.3, 1];

const directionMap = {
  up:    { y: 48, x: 0 },
  down:  { y: -48, x: 0 },
  left:  { y: 0, x: 40 },
  right: { y: 0, x: -40 },
  none:  { y: 0, x: 0 },
};

export default function RevealSection({
  children,
  delay     = 0,
  direction = 'up',
  duration  = 0.8,
  className,
  style,
}) {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: '-80px' });
  const { x, y } = directionMap[direction] || directionMap.up;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x, y }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: EASING }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
