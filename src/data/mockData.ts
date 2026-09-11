import { StudySession, Subject } from '../types';

export const subjects: Subject[] = [
  { name: 'Python', color: '#4A7C59' },
  { name: 'Data Structures', color: '#8B6914' },
  { name: 'Machine Learning', color: '#6B5B8A' },
  { name: 'Mathematics', color: '#8B4D5C' },
  { name: 'English', color: '#4A6B8A' },
];

const topicMap: Record<string, string[]> = {
  Python: ['List Comprehensions', 'Decorators', 'Generators', 'OOP Concepts', 'File I/O', 'Error Handling', 'Async Programming'],
  'Data Structures': ['Binary Trees', 'Hash Tables', 'Linked Lists', 'Graphs', 'Heaps', 'Sorting Algorithms', 'Dynamic Programming'],
  'Machine Learning': ['Linear Regression', 'Neural Networks', 'Decision Trees', 'Gradient Descent', 'Feature Engineering', 'Model Evaluation'],
  Mathematics: ['Linear Algebra', 'Calculus', 'Probability', 'Statistics', 'Discrete Math', 'Number Theory'],
  English: ['Academic Writing', 'Grammar Review', 'Essay Structure', 'Vocabulary', 'Reading Comprehension'],
};

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateMockSessions(): StudySession[] {
  const sessions: StudySession[] = [];
  const rand = seededRandom(42);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let daysAgo = 95; daysAgo >= 0; daysAgo--) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);

    // Skip some days (but keep the last 18 days continuous for streak)
    if (daysAgo > 18 && rand() < 0.25) continue;
    // Higher skip rate for older data
    if (daysAgo > 60 && rand() < 0.15) continue;

    // 1-4 sessions per day
    const sessionCount = daysAgo <= 7
      ? Math.floor(rand() * 3) + 2  // more recent = more sessions
      : Math.floor(rand() * 3) + 1;

    const usedHours = new Set<number>();

    for (let j = 0; j < sessionCount; j++) {
      const subject = subjects[Math.floor(rand() * subjects.length)].name;
      const topics = topicMap[subject] || ['General'];
      const topic = topics[Math.floor(rand() * topics.length)];

      // Realistic times: morning (7-12), afternoon (13-17), evening (18-22)
      const timeSlots = [
        7 + Math.floor(rand() * 5),   // morning
        13 + Math.floor(rand() * 4),  // afternoon
        18 + Math.floor(rand() * 4),  // evening
      ];

      let hour = timeSlots[Math.floor(rand() * timeSlots.length)];
      while (usedHours.has(hour)) {
        hour = (hour + 1) % 23;
        if (hour < 7) hour = 7;
      }
      usedHours.add(hour);

      const minute = Math.floor(rand() * 60);
      const sessionDate = new Date(date);
      sessionDate.setHours(hour, minute, 0, 0);

      // Duration: 20-120 minutes, weighted toward 30-60
      const durationBase = 25 + Math.floor(rand() * 70);
      const duration = Math.min(120, Math.max(20, durationBase));

      // Focus rating: weighted toward 6-9
      const focusBase = 4 + Math.floor(rand() * 7);
      const focusRating = Math.min(10, Math.max(1, focusBase));

      sessions.push({
        id: generateId(),
        subject,
        topic,
        startTime: sessionDate.toISOString(),
        duration,
        focusRating,
      });
    }
  }

  // Sort by start time
  sessions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return sessions;
}

export const mockSessions = generateMockSessions();
