import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';

// Pre-calculated deterministic dots positions
const DOTS = Array.from({ length: 30 }).map((_, i) => {
  // Pseudorandom generation based on index
  const x = 50 + ((i * 137) % 700);
  const y = 20 + ((i * 93) % 120);
  const r = 1 + (i % 2); // Radius 1 or 2
  return { id: i, x, y, r };
});

export default function StudyEnvironment() {
  const { state } = useStudy();
  const { dailyGoal } = state;
  const prefersReducedMotion = useReducedMotion();

  const progress = Math.min(
    1,
    dailyGoal.targetMinutes > 0
      ? dailyGoal.completedMinutes / dailyGoal.targetMinutes
      : 0
  );

  const activeDots = Math.floor(progress * 30);

  return (
    <div className="overflow-hidden rounded-lg w-full h-[120px] md:h-[160px] relative bg-[color:var(--env-sky)]">
      <svg
        viewBox="0 0 800 160"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="warmTint" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={progress * 0.1} />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="800" height="96" fill="var(--env-sky)" />

        {/* Horizon warm tint overlay */}
        {progress > 0 && (
          <rect x="0" y="0" width="800" height="160" fill="url(#warmTint)" />
        )}

        {/* Particles */}
        {DOTS.slice(0, activeDots).map((dot, i) => (
          <motion.circle
            key={dot.id}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill="var(--accent)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 + ((i % 4) * 0.1) }}
            transition={{ duration: 1 }}
          />
        ))}

        {/* Warm Glow */}
        <motion.ellipse
          cy="96"
          rx={200 * progress}
          ry={40 * progress}
          fill="var(--accent)"
          opacity={0.04 + 0.06 * progress}
          initial={{ cx: 400 }}
          animate={
            prefersReducedMotion || progress === 0
              ? { cx: 400 }
              : { cx: [380, 420, 380] }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Horizon Line */}
        <line
          x1="0"
          y1="96"
          x2="800"
          y2="96"
          stroke="var(--text-tertiary)"
          strokeWidth="0.5"
          opacity="0.2"
        />

        {/* Ground */}
        <rect x="0" y="96" width="800" height="64" fill="var(--env-ground)" />
      </svg>
    </div>
  );
}
