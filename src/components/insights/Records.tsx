import React from 'react';
import { useStudy } from '../../context/StudyContext';
import { computeStats, getBestDay, getMostConsistentMonth } from '../../utils/statistics';
import { formatDurationLong } from '../../utils/formatTime';
import RevealOnScroll from '../ui/RevealOnScroll';

export default function Records() {
  const { state } = useStudy();
  
  const stats = computeStats(state.sessions);
  const bestDay = getBestDay(state.sessions);
  const mostConsistentMonth = getMostConsistentMonth(state.sessions);

  const records = [
    {
      label: 'LONGEST SESSION',
      value: stats.longestSession ? formatDurationLong(stats.longestSession.duration) : '-',
      sub: stats.longestSession ? new Date(stats.longestSession.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null,
    },
    {
      label: 'BEST DAY',
      value: bestDay ? formatDurationLong(bestDay.minutes) : '-',
      sub: bestDay ? new Date(bestDay.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null,
    },
    {
      label: 'CURRENT STREAK',
      value: `${state.streak} days`,
      sub: null,
    },
    {
      label: 'BEST STREAK',
      value: `${state.bestStreak} days`,
      sub: null,
    },
    {
      label: 'MOST CONSISTENT MONTH',
      value: mostConsistentMonth || '-',
      sub: null,
    }
  ];

  return (
    <div className="w-full">
      <div className="font-label mb-8">PERSONAL RECORDS</div>
      <div className="space-y-10">
        {records.map((record, i) => (
          <RevealOnScroll key={i} delay={i * 60}>
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 w-[2px] h-full bg-[color:var(--accent)]" />
              <div className="font-label">{record.label}</div>
              <div className="font-display text-3xl mt-2">{record.value}</div>
              {record.sub && (
                <div className="text-xs text-[color:var(--text-tertiary)] mt-1">
                  {record.sub}
                </div>
              )}
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </div>
  );
}
