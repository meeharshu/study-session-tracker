import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { StudyProvider, useStudy } from './context/StudyContext';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/layout/Navigation';
import Timer from './components/timer/Timer';
import TimerControls from './components/timer/TimerControls';
import CompletionAnimation from './components/timer/CompletionAnimation';
import SessionCreator from './components/sessions/SessionCreator';
import SessionTimeline from './components/sessions/SessionTimeline';
import DailyProgress from './components/progress/DailyProgress';
import WeeklyActivity from './components/progress/WeeklyActivity';
import StudyEnvironment from './components/progress/StudyEnvironment';
import InsightPanel from './components/insights/InsightPanel';
import StudyHeatmap from './components/insights/StudyHeatmap';
import Records from './components/insights/Records';
import { formatDateHeader } from './utils/formatTime';
import { Page } from './types';
import { Trash2, CheckCircle2, Plus, X } from 'lucide-react';

function TodayView() {
  const { state } = useStudy();
  const dateHeader = formatDateHeader();

  return (
    <div className="space-y-12">
      {/* Date Header */}
      <div className="text-center pt-2">
        <span className="font-label tracking-widest text-[11px] text-[color:var(--text-tertiary)]">
          {dateHeader}
        </span>
      </div>

      {/* Centerpiece Timer */}
      <section aria-label="Timer" className="flex flex-col items-center">
        <Timer />
        <TimerControls />
      </section>

      {/* Living Atmospheric Environment */}
      <section aria-label="Study Environment" className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-label">ENVIRONMENT HARMONY</span>
          <span className="text-xs text-[color:var(--text-tertiary)]">Reflects daily progress</span>
        </div>
        <StudyEnvironment />
      </section>

      {/* Progress & Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <DailyProgress />
        <WeeklyActivity />
      </div>

      {/* Recent Sessions */}
      <section className="pt-6">
        <div className="flex items-center justify-between mb-6">
          <span className="font-label">RECENT SESSIONS</span>
          <span className="text-xs text-[color:var(--text-tertiary)]">Today & recent</span>
        </div>
        <SessionTimeline sessions={state.sessions} limit={2} showDelete={false} />
      </section>
    </div>
  );
}

function SessionsView() {
  const { state } = useStudy();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-label mb-2">CHRONOLOGY</h1>
        <div className="font-display text-4xl text-[color:var(--text-primary)]">
          Session Archive
        </div>
        <p className="text-sm text-[color:var(--text-secondary)] mt-2">
          A granular record of dedicated focus blocks, topics covered, and quality metrics.
        </p>
      </div>

      <div className="pt-4">
        <SessionTimeline sessions={state.sessions} showDelete={true} />
      </div>
    </div>
  );
}

function InsightsView() {
  return (
    <div className="space-y-16">
      <div>
        <h1 className="font-label mb-2">ANALYTICS</h1>
        <div className="font-display text-4xl text-[color:var(--text-primary)]">
          Focus Intelligence
        </div>
        <p className="text-sm text-[color:var(--text-secondary)] mt-2">
          Patterns, streaks, and qualitative assessment across your study journey.
        </p>
      </div>

      {/* High Level Stats Grid */}
      <section>
        <InsightPanel />
      </section>

      {/* Heatmap Activity */}
      <section className="pt-4 border-t border-[color:var(--border-light)]">
        <StudyHeatmap />
      </section>

      {/* Personal Bests & Milestones */}
      <section className="pt-4 border-t border-[color:var(--border-light)]">
        <Records />
      </section>
    </div>
  );
}

function SettingsView() {
  const { state, dispatch } = useStudy();
  const [targetHours, setTargetHours] = useState(state.dailyGoal.targetMinutes / 60);
  const [savedNotice, setSavedNotice] = useState(false);

  const [newSubName, setNewSubName] = useState('');

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SET_DAILY_GOAL',
      payload: { targetMinutes: Math.round(Number(targetHours) * 60) },
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2400);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubName.trim();
    if (trimmed) {
      dispatch({ type: 'ADD_SUBJECT', payload: { name: trimmed } });
      setNewSubName('');
    }
  };

  const handleRemoveSubject = (name: string) => {
    if (state.subjects.length <= 1) {
      alert('You must keep at least one subject configured.');
      return;
    }
    dispatch({ type: 'REMOVE_SUBJECT', payload: { name } });
  };

  const handleResetData = () => {
    if (window.confirm('Reset all study data and history to initial state? This cannot be undone.')) {
      dispatch({ type: 'CLEAR_DATA' });
    }
  };

  return (
    <div className="space-y-12 max-w-xl">
      <div>
        <h1 className="font-label mb-2">CONFIGURATION</h1>
        <div className="font-display text-4xl text-[color:var(--text-primary)]">
          Preferences
        </div>
        <p className="text-sm text-[color:var(--text-secondary)] mt-2">
          Tune your daily focus targets, workspace behavior, and subject library.
        </p>
      </div>

      {/* Daily Target Setting */}
      <form onSubmit={handleSaveGoal} className="space-y-4 pt-4">
        <span className="font-label block">DAILY FOCUS GOAL (HOURS)</span>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="0.5"
            min="0.5"
            max="16"
            value={targetHours}
            onChange={(e) => setTargetHours(parseFloat(e.target.value) || 1)}
            className="w-32 px-4 py-2 border border-[color:var(--border)] rounded-md bg-transparent text-[color:var(--text-primary)] font-mono-num text-lg focus:outline-none focus:border-[color:var(--accent)] transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-md bg-[color:var(--accent)] text-white text-sm font-medium hover:bg-[color:var(--accent-hover)] transition-colors cursor-pointer"
          >
            Update Target
          </button>
        </div>
        {savedNotice && (
          <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mt-2">
            <CheckCircle2 size={14} /> Goal updated successfully
          </div>
        )}
      </form>

      {/* Subjects Manager */}
      <div className="pt-6 border-t border-[color:var(--border-light)] space-y-4">
        <span className="font-label block">SUBJECT LIBRARY</span>
        <div className="flex flex-wrap gap-2 mb-3">
          {state.subjects.map((sub) => (
            <div
              key={sub.name}
              className="px-3 py-1.5 rounded-full border border-[color:var(--border)] text-xs text-[color:var(--text-secondary)] flex items-center gap-2 group"
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: sub.color }}
              />
              <span>{sub.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveSubject(sub.name)}
                title={`Remove ${sub.name}`}
                className="text-[color:var(--text-tertiary)] hover:text-rose-500 transition-colors ml-1 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddSubject} className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
            placeholder="Add new subject..."
            className="px-3 py-1.5 border border-[color:var(--border)] rounded-md bg-transparent text-xs text-[color:var(--text-primary)] focus:outline-none focus:border-[color:var(--accent)] w-48"
          />
          <button
            type="submit"
            disabled={!newSubName.trim()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-[color:var(--accent)] text-white text-xs font-medium hover:bg-[color:var(--accent-hover)] disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Plus size={13} /> Add
          </button>
        </form>
      </div>

      {/* Reset State */}
      <div className="pt-8 border-t border-[color:var(--border-light)] space-y-4">
        <span className="font-label block text-rose-500">DATA MANAGEMENT</span>
        <p className="text-xs text-[color:var(--text-tertiary)]">
          All session entries and metrics are stored locally in your browser storage. Resetting restores original default state.
        </p>
        <button
          type="button"
          onClick={handleResetData}
          className="flex items-center gap-2 px-4 py-2 border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 rounded-md text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
        >
          <Trash2 size={14} /> Reset State
        </button>
      </div>
    </div>
  );
}

function MainContent() {
  const [currentPage, setCurrentPage] = useState<Page>('today');

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] transition-colors duration-300">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />

      <main id="main" className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-24 pb-28 md:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {currentPage === 'today' && <TodayView />}
            {currentPage === 'sessions' && <SessionsView />}
            {currentPage === 'insights' && <InsightsView />}
            {currentPage === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals & Overlays */}
      <SessionCreator />
      <CompletionAnimation />

      {/* Subtle Footer */}
      <footer className="hidden md:block py-6 border-t border-[color:var(--border-light)] text-center text-xs text-[color:var(--text-tertiary)]">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <span className="font-light tracking-wide">Study · A quiet space for focused work</span>
          <span className="font-mono text-[11px] opacity-70">v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StudyProvider>
        <MainContent />
      </StudyProvider>
    </ThemeProvider>
  );
}
