import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';
import { formatDurationLong } from '../../utils/formatTime';
import FocusRating from '../sessions/FocusRating';

export default function CompletionAnimation() {
  const { state, dispatch } = useStudy();
  
  return (
    <AnimatePresence>
      {state.showCompletionScreen && state.completedSession && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Full-screen overlay background */}
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: 'var(--bg-primary)', opacity: 0.97 }}
          />
          
          <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[color:var(--text-tertiary)] uppercase tracking-widest text-xs font-semibold mb-6 font-label"
            >
              Session Complete
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="tabular-nums tracking-[-0.02em] font-light text-5xl text-[color:var(--text-primary)] mb-4 font-display"
            >
              {formatDurationLong(state.completedSession.duration)}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-[color:var(--text-secondary)] text-base font-normal mb-10"
            >
              <span className="font-medium text-[color:var(--text-primary)]">{state.completedSession.subject}</span>
              <span className="mx-2 opacity-50">·</span>
              {state.completedSession.topic}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mb-12 w-full flex flex-col items-center"
            >
              <div className="text-sm text-[color:var(--text-secondary)] mb-4">Rate Your Focus Quality</div>
              <FocusRating 
                value={state.completedSession.focusRating} 
                onChange={(rating) => dispatch({ type: 'UPDATE_COMPLETED_RATING', payload: { focusRating: rating } })} 
              />
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'DISMISS_COMPLETION' })}
              className="px-10 py-3 rounded-full bg-[color:var(--accent)] text-white text-sm font-medium uppercase tracking-wider shadow-lg"
            >
              Done
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
