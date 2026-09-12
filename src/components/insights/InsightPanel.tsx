import React from 'react';
import { useStudy } from '../../context/StudyContext';
import { computeStats } from '../../utils/statistics';
import { formatDuration, formatDurationLong, formatHour } from '../../utils/formatTime';
import RevealOnScroll from '../ui/RevealOnScroll';

export default function InsightPanel() {
  const { state } = useStudy();
  const stats = computeStats(state.sessions);

  const statItems = [
    { label: 'TOTAL STUDY TIME', value: formatDuration(stats.totalStudyTime), sub: null },
    { label: 'SESSIONS COMPLETED', value: stats.sessionsCompleted.toString(), sub: null },
    { label: 'AVERAGE SESSION', value: formatDurationLong(stats.averageSessionLength), sub: null },
    { 
      label: 'LONGEST SESSION', 
      value: stats.longestSession ? formatDurationLong(stats.longestSession.duration) : '0 min', 
      sub: stats.longestSession?.subject || null 
    },
    { label: 'CURRENT STREAK', value: `${stats.currentStreak} days`, sub: null },
    { label: 'BEST STREAK', value: `${stats.bestStreak} days`, sub: null },
    { label: 'MOST STUDIED', value: stats.mostStudiedSubject || '-', sub: null },
    { label: 'PEAK HOURS', value: formatHour(stats.mostProductiveHour), sub: null },
    { label: 'AVERAGE FOCUS', value: stats.averageFocusRating > 0 ? `${stats.averageFocusRating} / 10` : '-', sub: null },
    { label: 'DAYS STUDIED', value: stats.totalDaysStudied.toString(), sub: null },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 py-4">
      {statItems.map((stat, i) => (
        <RevealOnScroll key={i} delay={i * 40}>
          <div className="p-5 rounded-2xl bg-[color:var(--bg-secondary)]/50 border border-[color:var(--border-light)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full group">
            <span className="font-label text-[10px] text-[color:var(--text-tertiary)] group-hover:text-[color:var(--accent)] transition-colors">{stat.label}</span>
            <div className="mt-3">
              <div className="font-display text-2xl md:text-3xl font-light text-[color:var(--text-primary)] truncate">{stat.value}</div>
              {stat.sub ? (
                <div className="text-xs text-[color:var(--text-tertiary)] mt-1 truncate">
                  {stat.sub}
                </div>
              ) : (
                <div className="h-4 mt-1" />
              )}
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
