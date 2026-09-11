import { StudySession, StudyStats } from '../types';
import { getDayKey } from './formatTime';

export function computeStats(sessions: StudySession[]): StudyStats {
  if (sessions.length === 0) {
    return {
      totalStudyTime: 0,
      sessionsCompleted: 0,
      averageSessionLength: 0,
      longestSession: null,
      currentStreak: 0,
      bestStreak: 0,
      mostStudiedSubject: '',
      mostProductiveHour: 9,
      averageFocusRating: 0,
      totalDaysStudied: 0,
    };
  }

  const totalStudyTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  const sessionsCompleted = sessions.length;
  const averageSessionLength = Math.round(totalStudyTime / sessionsCompleted);

  const longestSession = sessions.reduce((longest, s) =>
    s.duration > (longest?.duration ?? 0) ? s : longest, sessions[0]);

  // Subject frequency
  const subjectMap = new Map<string, number>();
  sessions.forEach(s => {
    subjectMap.set(s.subject, (subjectMap.get(s.subject) || 0) + s.duration);
  });
  const mostStudiedSubject = [...subjectMap.entries()]
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  // Most productive hour
  const hourMap = new Map<number, number>();
  sessions.forEach(s => {
    const hour = new Date(s.startTime).getHours();
    hourMap.set(hour, (hourMap.get(hour) || 0) + s.duration);
  });
  const mostProductiveHour = [...hourMap.entries()]
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 9;

  // Average focus
  const avgFocus = sessions.reduce((sum, s) => sum + s.focusRating, 0) / sessions.length;

  // Streaks
  const daySet = new Set<string>();
  sessions.forEach(s => daySet.add(getDayKey(s.startTime)));
  const sortedDays = [...daySet].sort().reverse();

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  const todayKey = getDayKey(today.toISOString());
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = getDayKey(yesterdayDate.toISOString());

  // Calculate current streak
  if (daySet.has(todayKey) || daySet.has(yesterdayKey)) {
    const startDay = daySet.has(todayKey) ? today : yesterdayDate;
    let checkDate = new Date(startDay);
    while (true) {
      const key = getDayKey(checkDate.toISOString());
      if (daySet.has(key)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate best streak
  for (let i = 0; i < sortedDays.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const curr = new Date(sortedDays[i - 1]);
      const prev = new Date(sortedDays[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (Math.round(diff) === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);
  }
  bestStreak = Math.max(bestStreak, currentStreak);

  const totalDaysStudied = daySet.size;

  return {
    totalStudyTime,
    sessionsCompleted,
    averageSessionLength,
    longestSession,
    currentStreak,
    bestStreak,
    mostStudiedSubject,
    mostProductiveHour,
    averageFocusRating: Math.round(avgFocus * 10) / 10,
    totalDaysStudied,
  };
}

export function getTodayMinutes(sessions: StudySession[]): number {
  const todayKey = getDayKey(new Date().toISOString());
  return sessions
    .filter(s => getDayKey(s.startTime) === todayKey)
    .reduce((sum, s) => sum + s.duration, 0);
}

export function getWeeklyData(sessions: StudySession[]): { day: string; minutes: number; date: string }[] {
  const result: { day: string; minutes: number; date: string }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = getDayKey(date.toISOString());
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const minutes = sessions
      .filter(s => getDayKey(s.startTime) === key)
      .reduce((sum, s) => sum + s.duration, 0);
    result.push({ day: dayName, minutes, date: key });
  }

  return result;
}

export function getHeatmapData(sessions: StudySession[], weeks: number = 16): {
  date: string;
  minutes: number;
  sessions: number;
  level: number;
}[] {
  const dayMap = new Map<string, { minutes: number; sessions: number }>();
  sessions.forEach(s => {
    const key = getDayKey(s.startTime);
    const existing = dayMap.get(key) || { minutes: 0, sessions: 0 };
    dayMap.set(key, {
      minutes: existing.minutes + s.duration,
      sessions: existing.sessions + 1,
    });
  });

  const result: { date: string; minutes: number; sessions: number; level: number }[] = [];
  const today = new Date();
  const totalDays = weeks * 7;

  // Find max for normalization
  let maxMinutes = 0;
  dayMap.forEach(v => { if (v.minutes > maxMinutes) maxMinutes = v.minutes; });

  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = getDayKey(date.toISOString());
    const data = dayMap.get(key) || { minutes: 0, sessions: 0 };

    let level = 0;
    if (data.minutes > 0 && maxMinutes > 0) {
      const ratio = data.minutes / maxMinutes;
      if (ratio > 0.75) level = 4;
      else if (ratio > 0.5) level = 3;
      else if (ratio > 0.25) level = 2;
      else level = 1;
    }

    result.push({ date: key, ...data, level });
  }

  return result;
}

export function getDailySessionGroups(sessions: StudySession[]): Map<string, StudySession[]> {
  const groups = new Map<string, StudySession[]>();
  const sorted = [...sessions].sort((a, b) =>
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  sorted.forEach(s => {
    const key = getDayKey(s.startTime);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  });

  return groups;
}

export function getBestDay(sessions: StudySession[]): { date: string; minutes: number } | null {
  const dayMap = new Map<string, number>();
  sessions.forEach(s => {
    const key = getDayKey(s.startTime);
    dayMap.set(key, (dayMap.get(key) || 0) + s.duration);
  });

  let best: { date: string; minutes: number } | null = null;
  dayMap.forEach((minutes, date) => {
    if (!best || minutes > best.minutes) {
      best = { date, minutes };
    }
  });

  return best;
}

export function getMostConsistentMonth(sessions: StudySession[]): string | null {
  const monthMap = new Map<string, Set<string>>();
  sessions.forEach(s => {
    const d = new Date(s.startTime);
    const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    const dayKey = getDayKey(s.startTime);
    if (!monthMap.has(monthKey)) monthMap.set(monthKey, new Set());
    monthMap.get(monthKey)!.add(dayKey);
  });

  let bestMonth = '';
  let bestCount = 0;
  monthMap.forEach((days, month) => {
    if (days.size > bestCount) {
      bestCount = days.size;
      bestMonth = month;
    }
  });

  if (!bestMonth) return null;
  const [year, month] = bestMonth.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
