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
          className="px-8 py-3 rounded-full bg-[color:var(--accent)] text-white text-sm font-medium uppercase tracking-wider"
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
            className="px-8 py-3 rounded-full bg-[color:var(--accent)] text-white text-sm font-medium uppercase tracking-wider"
          >
            Pause
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'FINISH_SESSION', payload: { focusRating: 7 } })}
            className="px-8 py-3 rounded-full bg-transparent border border-[color:var(--border)] text-[color:var(--text-secondary)] text-sm font-medium uppercase tracking-wider"
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
            className="px-8 py-3 rounded-full bg-[color:var(--accent)] text-white text-sm font-medium uppercase tracking-wider"
          >
            Resume
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'RESET_SESSION' })}
            className="px-8 py-3 rounded-full bg-transparent border border-[color:var(--border)] text-[color:var(--text-secondary)] text-sm font-medium uppercase tracking-wider"
          >
            Reset
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: 'FINISH_SESSION', payload: { focusRating: 7 } })}
            className="px-8 py-3 rounded-full bg-transparent border border-[color:var(--border)] text-[color:var(--text-secondary)] text-sm font-medium uppercase tracking-wider"
          >
            Finish
          </motion.button>
        </>
      )}
    </div>
  );
}
