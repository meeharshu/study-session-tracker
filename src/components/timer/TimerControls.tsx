import React from 'react';
import { motion } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';

export default function TimerControls() {
  const { state, dispatch } = useStudy();
  const cs = state.currentSession;

  if (!cs) {
    return (
      <div className="flex justify-center mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => dispatch({ type: 'TOGGLE_SESSION_CREATOR' })}
          className="px-8 py-3.5 rounded-full bg-[color:var(--accent)] text-white text-sm font-semibold uppercase tracking-widest shadow-lg shadow-[color:var(--accent-muted)] hover:bg-[color:var(--accent-hover)] hover:shadow-[color:var(--accent-subtle)] transition-all"
        >
          Begin Session
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex flex-row justify-center items-center gap-3 mt-8">
      {!cs.isPaused ? (
        <>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'PAUSE_SESSION' })}
            className="px-8 py-3 rounded-full bg-[color:var(--accent)] text-white text-sm font-semibold uppercase tracking-widest shadow-md hover:bg-[color:var(--accent-hover)] transition-all"
          >
            Pause
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'FINISH_SESSION', payload: { focusRating: 7 } })}
            className="px-8 py-3 rounded-full bg-[color:var(--bg-primary)] border border-[color:var(--border)] text-[color:var(--text-secondary)] text-sm font-medium uppercase tracking-widest hover:text-[color:var(--text-primary)] hover:border-[color:var(--text-tertiary)] transition-all"
          >
            Finish
          </motion.button>
        </>
      ) : (
        <>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'RESUME_SESSION' })}
            className="px-8 py-3 rounded-full bg-[color:var(--text-primary)] text-[color:var(--bg-primary)] text-sm font-semibold uppercase tracking-widest shadow-md transition-all"
          >
            Resume
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'RESET_SESSION' })}
            className="px-6 py-3 rounded-full bg-transparent border border-[color:var(--border)] text-[color:var(--text-tertiary)] text-xs font-medium uppercase tracking-widest hover:text-rose-500 hover:border-rose-500/50 transition-all"
          >
            Reset
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'FINISH_SESSION', payload: { focusRating: 7 } })}
            className="px-6 py-3 rounded-full bg-[color:var(--bg-primary)] border border-[color:var(--border)] text-[color:var(--text-secondary)] text-xs font-medium uppercase tracking-widest hover:text-emerald-600 hover:border-emerald-500/50 transition-all"
          >
            Finish
          </motion.button>
        </>
      )}
    </div>
  );
}
