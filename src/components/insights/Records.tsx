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
      <div className="font-label mb-6">PERSONAL RECORDS</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
        {records.map((record, i) => (
          <RevealOnScroll key={i} delay={i * 50}>
            <div className="relative p-5 rounded-2xl bg-[color:var(--bg-secondary)]/50 border border-[color:var(--border-light)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-[color:var(--accent)]" />
              <div>
                <div className="font-label text-[10px] text-[color:var(--text-tertiary)] pl-1">{record.label}</div>
                <div className="font-display text-2xl md:text-3xl font-light text-[color:var(--text-primary)] mt-2 pl-1 truncate">{record.value}</div>
              </div>
              {record.sub && (
                <div className="text-xs text-[color:var(--text-tertiary)] mt-3 pl-1 truncate">
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
