import React from 'react';
import { motion } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';
import { formatDuration } from '../../utils/formatTime';

export default function DailyProgress() {
  const { state } = useStudy();
  const { dailyGoal } = state;

  const percentage = Math.min(
    100,
    dailyGoal.targetMinutes > 0
      ? (dailyGoal.completedMinutes / dailyGoal.targetMinutes) * 100
      : 0
  );

  return (
    <div className="p-6 rounded-2xl bg-[color:var(--bg-secondary)]/60 border border-[color:var(--border-light)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-baseline mb-4">
          <span className="font-label">TODAY'S TARGET</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[color:var(--accent-muted)] text-[color:var(--accent)] font-mono-num">
            {Math.round(percentage)}%
          </span>
        </div>

        <div className="mt-2">
          <div className="text-3xl font-light font-display text-[color:var(--text-primary)]">
            {formatDuration(dailyGoal.completedMinutes)}
          </div>
          <div className="text-xs text-[color:var(--text-tertiary)] mt-1">
            Target: <span className="text-[color:var(--text-secondary)] font-medium">{formatDuration(dailyGoal.targetMinutes)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="progress-track h-2 bg-[color:var(--border)] rounded-full overflow-hidden">
          <motion.div
            className="progress-fill h-full bg-[color:var(--accent)] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
