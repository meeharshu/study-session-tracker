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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 py-8">
      {statItems.map((stat, i) => (
        <RevealOnScroll key={i} delay={i * 60}>
          <div>
            <span className="font-label">{stat.label}</span>
            <div className="font-display text-3xl md:text-4xl mt-2">{stat.value}</div>
            {stat.sub && (
              <div className="text-xs text-[color:var(--text-tertiary)] mt-1">
                {stat.sub}
              </div>
            )}
          </div>
        </RevealOnScroll>
      ))}
    </div>
  );
}
