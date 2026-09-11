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
    <div className="py-6">
      <div className="flex justify-between items-baseline">
        <span className="font-label">TODAY</span>
        <span className="text-sm text-[color:var(--text-tertiary)] font-mono-num">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="mt-3">
        <span className="text-2xl font-medium text-[color:var(--text-primary)]">
          {formatDuration(dailyGoal.completedMinutes)}
        </span>
        <span className="text-sm text-[color:var(--text-tertiary)]">
          {' of '}
        </span>
        <span className="text-sm text-[color:var(--text-tertiary)]">
          {formatDuration(dailyGoal.targetMinutes)} goal
        </span>
      </div>

      <div className="mt-4 progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
