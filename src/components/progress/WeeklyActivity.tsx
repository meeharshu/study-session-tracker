import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';
import { getWeeklyData } from '../../utils/statistics';
import { formatDuration } from '../../utils/formatTime';

export default function WeeklyActivity() {
  const { state } = useStudy();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const weeklyData = getWeeklyData(state.sessions);
  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes), 60);

  return (
    <section>
      <div className="font-label mb-6">WEEKLY ACTIVITY</div>
      <div className="w-full overflow-visible relative">
        <svg viewBox="0 0 280 120" className="w-full h-auto overflow-visible">
          {weeklyData.map((data, i) => {
            const barWidth = 20;
            const gap = (280 - 7 * barWidth) / 6;
            const x = i * (barWidth + gap);
            const height = Math.max(2, (data.minutes / maxMinutes) * 80);
            const y = 90 - height;
            const isToday = i === 6;

            return (
              <g key={data.date}>
                {hoveredIndex === i && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    className="text-xs fill-[color:var(--text-primary)] font-mono-num"
                  >
                    {formatDuration(data.minutes)}
                  </text>
                )}
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  rx={3}
                  fill={isToday ? 'var(--accent)' : 'var(--border)'}
                  style={{
                    opacity: hoveredIndex === i ? 0.8 : 1,
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  initial={{ height: 0, y: 90 }}
                  animate={{ height, y }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                />
                <text
                  x={x + barWidth / 2}
                  y={110}
                  textAnchor="middle"
                  className="text-[10px] fill-[color:var(--text-tertiary)]"
                >
                  {data.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
