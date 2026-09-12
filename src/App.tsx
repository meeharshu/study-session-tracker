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
    <div className="space-y-8">
      {/* Date & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[color:var(--border-light)]">
        <div>
          <span className="font-label tracking-widest text-[11px] text-[color:var(--text-tertiary)] block">
            {dateHeader}
          </span>
          <h1 className="font-display text-3xl font-light text-[color:var(--text-primary)] mt-1">
            Focus Workspace
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-[color:var(--bg-secondary)] border border-[color:var(--border-light)] text-xs text-[color:var(--text-secondary)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[color:var(--accent)] animate-pulse" />
            <span>Streak: <strong className="text-[color:var(--text-primary)] font-semibold">{state.streak} days</strong></span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-[color:var(--bg-secondary)] border border-[color:var(--border-light)] text-xs text-[color:var(--text-secondary)]">
            Today: <strong className="text-[color:var(--text-primary)] font-semibold">{state.dailyGoal.completedMinutes}m</strong> / {state.dailyGoal.targetMinutes}m
          </div>
        </div>
      </div>

      {/* Primary Dashboard Widescreen Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Centerpiece Timer Card */}
        <section aria-label="Timer" className="lg:col-span-7 xl:col-span-8 p-6 md:p-10 rounded-2xl bg-[color:var(--bg-secondary)]/50 backdrop-blur-sm border border-[color:var(--border-light)] shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center min-h-[420px]">
          <Timer />
          <TimerControls />
        </section>

        {/* Side Metrics Widgets */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
          <div className="flex-1">
            <DailyProgress />
          </div>
          <div className="flex-1">
            <WeeklyActivity />
          </div>
        </div>
      </div>

      {/* Living Atmospheric Environment */}
      <section aria-label="Study Environment" className="pt-2">
        <div className="p-6 rounded-2xl bg-[color:var(--bg-secondary)]/50 backdrop-blur-sm border border-[color:var(--border-light)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label">ENVIRONMENT HARMONY</span>
            <span className="text-xs text-[color:var(--text-tertiary)]">Visual progress canvas</span>
          </div>
          <StudyEnvironment />
        </div>
      </section>

      {/* Recent Sessions */}
      <section className="pt-2">
        <div className="p-6 md:p-8 rounded-2xl bg-[color:var(--bg-secondary)]/50 backdrop-blur-sm border border-[color:var(--border-light)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <span className="font-label">RECENT SESSIONS</span>
            <span className="text-xs text-[color:var(--text-tertiary)]">Today & recent</span>
          </div>
          <SessionTimeline sessions={state.sessions} limit={2} showDelete={false} />
        </div>
      </section>
    </div>
  );
}

function SessionsView() {
  const { state } = useStudy();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[color:var(--border-light)]">
        <div>
          <h1 className="font-label mb-1">CHRONOLOGY</h1>
          <div className="font-display text-4xl text-[color:var(--text-primary)] font-light">
            Session Archive
          </div>
          <p className="text-sm text-[color:var(--text-secondary)] mt-1">
            A granular record of dedicated focus blocks, topics covered, and quality metrics.
          </p>
        </div>
        <div className="text-xs text-[color:var(--text-tertiary)] font-mono-num">
          Total Entries: <strong className="text-[color:var(--text-primary)] font-semibold">{state.sessions.length}</strong>
        </div>
      </div>

      <div className="p-6 md:p-8 rounded-2xl bg-[color:var(--bg-secondary)]/50 backdrop-blur-sm border border-[color:var(--border-light)] shadow-sm">
        <SessionTimeline sessions={state.sessions} showDelete={true} />
      </div>
    </div>
  );
}

function InsightsView() {
  return (
    <div className="space-y-10">
      <div className="pb-4 border-b border-[color:var(--border-light)]">
        <h1 className="font-label mb-1">ANALYTICS</h1>
        <div className="font-display text-4xl text-[color:var(--text-primary)] font-light">
          Focus Intelligence
        </div>
        <p className="text-sm text-[color:var(--text-secondary)] mt-1">
          Patterns, streaks, and qualitative assessment across your study journey.
        </p>
      </div>

      {/* High Level Stats Grid */}
      <section>
        <InsightPanel />
      </section>

      {/* Heatmap Activity */}
      <section>
        <StudyHeatmap />
      </section>

      {/* Personal Bests & Milestones */}
      <section>
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
    <div className="space-y-8 w-full">
      <div className="pb-4 border-b border-[color:var(--border-light)]">
        <h1 className="font-label mb-1">CONFIGURATION</h1>
        <div className="font-display text-4xl text-[color:var(--text-primary)] font-light">
          Preferences
        </div>
        <p className="text-sm text-[color:var(--text-secondary)] mt-1">
          Tune your daily focus targets, workspace behavior, and subject library.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Target Setting Card */}
        <div className="p-6 rounded-2xl bg-[color:var(--bg-secondary)]/50 backdrop-blur-sm border border-[color:var(--border-light)] shadow-sm flex flex-col justify-between">
          <div>
            <span className="font-label block mb-2">DAILY FOCUS GOAL</span>
            <p className="text-xs text-[color:var(--text-tertiary)] mb-4">
              Set your target hours of deep work per day.
            </p>
          </div>

          <form onSubmit={handleSaveGoal} className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="16"
                value={targetHours}
                onChange={(e) => setTargetHours(parseFloat(e.target.value) || 1)}
                className="w-28 px-4 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--bg-primary)] text-[color:var(--text-primary)] font-mono-num text-lg focus:outline-none focus:border-[color:var(--accent)] transition-colors"
              />
              <span className="text-sm text-[color:var(--text-secondary)] font-medium">hours</span>
            </div>
            <button
              type="submit"
              className="w-full px-6 py-2.5 rounded-lg bg-[color:var(--accent)] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[color:var(--accent-hover)] transition-colors cursor-pointer"
            >
              Update Target
            </button>
            {savedNotice && (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                <CheckCircle2 size={14} /> Goal updated successfully
              </div>
            )}
          </form>
        </div>

        {/* Subjects Manager Card */}
        <div className="p-6 rounded-2xl bg-[color:var(--bg-secondary)]/50 backdrop-blur-sm border border-[color:var(--border-light)] shadow-sm flex flex-col justify-between lg:col-span-2">
          <div>
            <span className="font-label block mb-2">SUBJECT LIBRARY</span>
            <p className="text-xs text-[color:var(--text-tertiary)] mb-4">
              Manage your active subjects for focus session tagging.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {state.subjects.map((sub) => (
                <div
                  key={sub.name}
                  className="px-3.5 py-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-primary)] text-xs text-[color:var(--text-secondary)] flex items-center gap-2 group shadow-xs"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: sub.color }}
                  />
                  <span className="font-medium text-[color:var(--text-primary)]">{sub.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(sub.name)}
                    title={`Remove ${sub.name}`}
                    className="text-[color:var(--text-tertiary)] hover:text-rose-500 transition-colors ml-1 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddSubject} className="flex items-center gap-2 pt-2 border-t border-[color:var(--border-light)]">
            <input
              type="text"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              placeholder="Add new subject name..."
              className="px-4 py-2 border border-[color:var(--border)] rounded-lg bg-[color:var(--bg-primary)] text-xs text-[color:var(--text-primary)] focus:outline-none focus:border-[color:var(--accent)] flex-1"
            />
            <button
              type="submit"
              disabled={!newSubName.trim()}
              className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[color:var(--accent)] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[color:var(--accent-hover)] disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Subject
            </button>
          </form>
        </div>
      </div>

      {/* Reset State Card */}
      <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-label block text-rose-500 mb-1">DATA MANAGEMENT</span>
          <p className="text-xs text-[color:var(--text-tertiary)]">
            All session entries and metrics are stored locally in your browser storage. Resetting restores original default state.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetData}
          className="flex items-center gap-2 px-5 py-2.5 border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
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

      <main id="main" className="flex-1 w-full px-6 sm:px-10 lg:px-16 xl:px-20 pt-24 pb-28 md:pb-20">
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
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-20 flex items-center justify-between">
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
