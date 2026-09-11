import React from 'react';
import { StudySession } from '../../types';
import { getRelativeDay, getTimeString, formatDurationLong } from '../../utils/formatTime';
import { getDailySessionGroups } from '../../utils/statistics';
import { useStudy } from '../../context/StudyContext';
import RevealOnScroll from '../ui/RevealOnScroll';
import { Trash2 } from 'lucide-react';

interface SessionTimelineProps {
  sessions: StudySession[];
  limit?: number;
  showDelete?: boolean;
}

const SessionTimeline: React.FC<SessionTimelineProps> = ({ sessions, limit, showDelete = false }) => {
  const { dispatch } = useStudy();

  if (!sessions || sessions.length === 0) {
    return (
      <div className="py-12 text-center text-[color:var(--text-tertiary)] italic">
        No sessions recorded yet.
      </div>
    );
  }

  const groupsMap = getDailySessionGroups(sessions);
  const groupEntries = Array.from(groupsMap.entries()).map(([date, daySessions]) => ({
    date,
    sessions: daySessions,
  }));
  const displayGroups = limit ? groupEntries.slice(0, limit) : groupEntries;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this session from history?')) {
      dispatch({ type: 'DELETE_SESSION', payload: { id } });
    }
  };

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
                    <div className="flex flex-row items-center py-3 group hover:bg-[color:var(--bg-secondary)]/40 px-2 -mx-2 rounded-lg transition-colors">
                      <div className="w-16 flex-shrink-0 text-sm text-[color:var(--text-tertiary)] tabular-nums">
                        {getTimeString(session.startTime)}
                      </div>
                      
                      <div className="flex-1 pr-4">
                        <div className="text-sm font-medium text-[color:var(--text-primary)] flex items-center gap-2">
                          <span>{session.subject}</span>
                          {session.intention && (
                            <span className="text-[11px] font-normal text-[color:var(--text-tertiary)] italic truncate max-w-[220px]">
                              &ldquo;{session.intention}&rdquo;
                            </span>
                          )}
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

                      {showDelete && (
                        <button
                          type="button"
                          onClick={(e) => handleDelete(session.id, e)}
                          title="Delete session"
                          className="opacity-0 group-hover:opacity-100 ml-3 p-1.5 text-[color:var(--text-tertiary)] hover:text-rose-500 transition-all cursor-pointer rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
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
