import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { AppState, AppAction, CurrentSession, StudySession } from '../types';
import { mockSessions, subjects } from '../data/mockData';
import { generateId, getDayKey } from '../utils/formatTime';
import { getTodayMinutes } from '../utils/statistics';

const STORAGE_KEY = 'study-app-state';

function loadState(): Partial<AppState> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function saveState(state: AppState) {
  try {
    const toSave = {
      sessions: state.sessions,
      dailyGoal: state.dailyGoal,
      streak: state.streak,
      bestStreak: state.bestStreak,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch { /* ignore */ }
}

const initialState: AppState = {
  sessions: mockSessions,
  currentSession: null,
  dailyGoal: { targetMinutes: 300, completedMinutes: 0 },
  streak: 18,
  bestStreak: 23,
  subjects,
  showSessionCreator: false,
  showCompletionScreen: false,
  completedSession: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START_SESSION': {
      const session: CurrentSession = {
        subject: action.payload.subject,
        topic: action.payload.topic,
        intention: action.payload.intention,
        targetDuration: action.payload.targetDuration,
        startedAt: Date.now(),
        elapsed: 0,
        isPaused: false,
        pausedAt: null,
      };
      return {
        ...state,
        currentSession: session,
        showSessionCreator: false,
      };
    }

    case 'PAUSE_SESSION':
      if (!state.currentSession || state.currentSession.isPaused) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          isPaused: true,
          pausedAt: Date.now(),
        },
      };

    case 'RESUME_SESSION': {
      if (!state.currentSession || !state.currentSession.isPaused) return state;
      const pauseDuration = state.currentSession.pausedAt ? Date.now() - state.currentSession.pausedAt : 0;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          startedAt: state.currentSession.startedAt + pauseDuration,
          isPaused: false,
          pausedAt: null,
        },
      };
    }

    case 'RESET_SESSION':
      return {
        ...state,
        currentSession: null,
      };

    case 'TICK':
      if (!state.currentSession || state.currentSession.isPaused) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          elapsed: action.payload.elapsed,
        },
      };

    case 'FINISH_SESSION': {
      if (!state.currentSession) return state;
      const cs = state.currentSession;
      const durationMinutes = Math.max(1, Math.round(cs.elapsed / 60));

      const newSession: StudySession = {
        id: generateId(),
        subject: cs.subject,
        topic: cs.topic,
        startTime: new Date(cs.startedAt).toISOString(),
        duration: durationMinutes,
        focusRating: action.payload.focusRating,
        intention: cs.intention,
      };

      const newSessions = [...state.sessions, newSession];
      const todayMinutes = getTodayMinutes(newSessions);

      // Check if streak needs updating
      const todayKey = getDayKey(new Date().toISOString());
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterdayKey = getDayKey(yesterdayDate.toISOString());

      const hadSessionToday = state.sessions.some(s => getDayKey(s.startTime) === todayKey);
      const hadSessionYesterday = state.sessions.some(s => getDayKey(s.startTime) === yesterdayKey);

      let newStreak = state.streak;
      if (!hadSessionToday) {
        if (hadSessionYesterday || state.streak === 0) {
          newStreak = state.streak + 1;
        }
      }

      return {
        ...state,
        sessions: newSessions,
        currentSession: null,
        dailyGoal: {
          ...state.dailyGoal,
          completedMinutes: todayMinutes,
        },
        streak: newStreak,
        bestStreak: Math.max(state.bestStreak, newStreak),
        showCompletionScreen: true,
        completedSession: newSession,
      };
    }

    case 'UPDATE_COMPLETED_RATING': {
      if (!state.completedSession) return state;
      const updatedSession = {
        ...state.completedSession,
        focusRating: action.payload.focusRating,
      };
      const updatedSessions = state.sessions.map(s =>
        s.id === updatedSession.id ? updatedSession : s
      );
      return {
        ...state,
        sessions: updatedSessions,
        completedSession: updatedSession,
      };
    }

    case 'DISMISS_COMPLETION':
      return {
        ...state,
        showCompletionScreen: false,
        completedSession: null,
      };

    case 'SET_DAILY_GOAL':
      return {
        ...state,
        dailyGoal: {
          ...state.dailyGoal,
          targetMinutes: action.payload.targetMinutes,
        },
      };

    case 'TOGGLE_SESSION_CREATOR':
      return {
        ...state,
        showSessionCreator: !state.showSessionCreator,
      };

    case 'LOAD_STATE':
      return { ...state, ...action.payload };

    case 'CLEAR_DATA':
      localStorage.removeItem(STORAGE_KEY);
      return { ...initialState, sessions: [] };

    default:
      return state;
  }
}

interface StudyContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const StudyContext = createContext<StudyContextValue | null>(null);

export function StudyProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = loadState();
    if (saved) {
      const todayMinutes = getTodayMinutes(saved.sessions || init.sessions);
      return {
        ...init,
        ...saved,
        dailyGoal: {
          ...(saved.dailyGoal || init.dailyGoal),
          completedMinutes: todayMinutes,
        },
      };
    }
    const todayMinutes = getTodayMinutes(init.sessions);
    return {
      ...init,
      dailyGoal: { ...init.dailyGoal, completedMinutes: todayMinutes },
    };
  });

  // Timer tick
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const pauseAccumRef = useRef<number>(0);

  useEffect(() => {
    if (state.currentSession && !state.currentSession.isPaused) {
      if (sessionStartRef.current === null) {
        sessionStartRef.current = Date.now();
        pauseAccumRef.current = 0;
      }

      timerRef.current = setInterval(() => {
        const now = Date.now();
        const totalElapsed = Math.floor((now - state.currentSession!.startedAt) / 1000);
        dispatch({ type: 'TICK', payload: { elapsed: totalElapsed } });
      }, 200);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [state.currentSession?.isPaused, state.currentSession?.startedAt]);

  // Reset timer refs when session ends
  useEffect(() => {
    if (!state.currentSession) {
      sessionStartRef.current = null;
      pauseAccumRef.current = 0;
    }
  }, [state.currentSession]);

  // Persist state
  useEffect(() => {
    saveState(state);
  }, [state.sessions, state.dailyGoal, state.streak, state.bestStreak]);

  return (
    <StudyContext.Provider value={{ state, dispatch }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within StudyProvider');
  return context;
}
