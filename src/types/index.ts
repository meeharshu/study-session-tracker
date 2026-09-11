export interface StudySession {
  id: string;
  subject: string;
  topic: string;
  startTime: string; // ISO string
  duration: number; // minutes
  focusRating: number; // 1-10
  intention?: string;
}

export interface Subject {
  name: string;
  color: string;
}

export interface DailyGoal {
  targetMinutes: number;
  completedMinutes: number;
}

export interface CurrentSession {
  subject: string;
  topic: string;
  intention?: string;
  targetDuration: number | null; // null = open-ended
  startedAt: number; // timestamp
  elapsed: number; // seconds
  isPaused: boolean;
  pausedAt: number | null;
}

export interface AppState {
  sessions: StudySession[];
  currentSession: CurrentSession | null;
  dailyGoal: DailyGoal;
  streak: number;
  bestStreak: number;
  subjects: Subject[];
  showSessionCreator: boolean;
  showCompletionScreen: boolean;
  completedSession: StudySession | null;
}

export type AppAction =
  | { type: 'START_SESSION'; payload: { subject: string; topic: string; intention?: string; targetDuration: number | null } }
  | { type: 'PAUSE_SESSION' }
  | { type: 'RESUME_SESSION' }
  | { type: 'RESET_SESSION' }
  | { type: 'TICK'; payload: { elapsed: number } }
  | { type: 'FINISH_SESSION'; payload: { focusRating: number } }
  | { type: 'UPDATE_COMPLETED_RATING'; payload: { focusRating: number } }
  | { type: 'DISMISS_COMPLETION' }
  | { type: 'SET_DAILY_GOAL'; payload: { targetMinutes: number } }
  | { type: 'ADD_SUBJECT'; payload: { name: string; color?: string } }
  | { type: 'REMOVE_SUBJECT'; payload: { name: string } }
  | { type: 'DELETE_SESSION'; payload: { id: string } }
  | { type: 'TOGGLE_SESSION_CREATOR' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'CLEAR_DATA' };

export type Page = 'today' | 'sessions' | 'insights' | 'settings';

export interface StudyStats {
  totalStudyTime: number; // minutes
  sessionsCompleted: number;
  averageSessionLength: number;
  longestSession: StudySession | null;
  currentStreak: number;
  bestStreak: number;
  mostStudiedSubject: string;
  mostProductiveHour: number;
  averageFocusRating: number;
  totalDaysStudied: number;
}
