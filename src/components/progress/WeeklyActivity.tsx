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
    <div className="p-6 rounded-2xl bg-[color:var(--bg-secondary)]/60 border border-[color:var(--border-light)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <span className="font-label">WEEKLY ACTIVITY</span>
        <span className="text-xs text-[color:var(--text-tertiary)]">Last 7 Days</span>
      </div>
      <div className="w-full overflow-visible relative pt-2">
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
                    className="text-xs fill-[color:var(--text-primary)] font-mono-num font-medium"
                  >
                    {formatDuration(data.minutes)}
                  </text>
                )}
                <motion.rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  rx={4}
                  fill={isToday ? 'var(--accent)' : 'var(--border)'}
                  style={{
                    opacity: hoveredIndex === i ? 0.85 : 1,
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
                  className="text-[10px] fill-[color:var(--text-tertiary)] font-medium"
                >
                  {data.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
