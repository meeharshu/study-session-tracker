import React from 'react';
import { StudySession } from '../../types';
import { getRelativeDay, getTimeString, formatDurationLong } from '../../utils/formatTime';
import { getDailySessionGroups } from '../../utils/statistics';
import RevealOnScroll from '../ui/RevealOnScroll';

interface SessionTimelineProps {
  sessions: StudySession[];
  limit?: number;
}

const SessionTimeline: React.FC<SessionTimelineProps> = ({ sessions, limit }) => {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="py-12 text-center text-[color:var(--text-tertiary)] italic">
        No sessions yet.
      </div>
    );
  }

  const groupsMap = getDailySessionGroups(sessions);
  const groupEntries = Array.from(groupsMap.entries()).map(([date, daySessions]) => ({
    date,
    sessions: daySessions,
  }));
  const displayGroups = limit ? groupEntries.slice(0, limit) : groupEntries;

  return (
    <div className="w-full">
      {displayGroups.map((group, groupIndex) => {
        const firstSession = group.sessions[0];
        const dayLabel = getRelativeDay(firstSession.startTime);

        return (
          <div key={group.date} className={`${groupIndex > 0 ? 'mt-8' : 'mt-0'}`}>
            <h3 className="font-label mb-4">{dayLabel}</h3>
            <div className="h-px bg-[color:var(--border-light)] mb-2" />
            
            <div className="flex flex-col">
              {group.sessions.map((session, sessionIndex) => {
                const focusWidth = session.focusRating ? `${(session.focusRating / 10) * 40}px` : '0px';
                
                return (
                  <RevealOnScroll key={session.id} delay={sessionIndex * 40}>
                    <div className="flex flex-row py-3 group">
                      <div className="w-16 flex-shrink-0 text-sm text-[color:var(--text-tertiary)] tabular-nums pt-0.5">
                        {getTimeString(session.startTime)}
                      </div>
                      
                      <div className="flex-1 pr-4">
                        <div className="text-sm font-medium text-[color:var(--text-primary)]">
                          {session.subject}
                        </div>
                        <div className="text-xs text-[color:var(--text-secondary)] mt-0.5">
                          {session.topic}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-start flex-shrink-0">
                        <div className="text-sm text-[color:var(--text-secondary)] tabular-nums">
                          {formatDurationLong(session.duration)}
                        </div>
                        {session.focusRating !== undefined && session.focusRating > 0 && (
                          <div className="mt-1.5 h-0.5 bg-[color:var(--bg-tertiary)] rounded overflow-hidden" style={{ width: '40px' }}>
                            <div 
                              className="h-full bg-[color:var(--accent)] rounded" 
                              style={{ width: focusWidth }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </RevealOnScroll>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SessionTimeline;
