import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';
import { formatTime } from '../../utils/formatTime';

export default function Timer() {
  const { state } = useStudy();
  const shouldReduceMotion = useReducedMotion();
  const cs = state.currentSession;
  
  const isRunning = cs ? !cs.isPaused : false;
  const elapsed = cs?.elapsed || 0;
  
  // 45 minutes fallback for open-ended sessions
  const targetDurationSeconds = cs?.targetDuration ? cs.targetDuration * 60 : 2700;
  const progress = cs?.targetDuration 
    ? Math.min(elapsed / targetDurationSeconds, 1)
    : (elapsed % targetDurationSeconds) / targetDurationSeconds;
    
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;
  
  const subject = cs?.subject || 'NO ACTIVE SESSION';
  const topic = cs?.topic || 'Select a subject to begin';
  
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto py-12">
      {/* Timer glow */}
      <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-1000 bg-[color:var(--accent)] pointer-events-none -z-10 timer-glow ${isRunning ? 'active opacity-20' : 'opacity-0'}`} />

      <div className="relative flex items-center justify-center w-[300px] h-[300px]">
        {/* Orbital ring */}
        <svg 
          viewBox="0 0 300 300" 
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        >
          {/* Background circle */}
          <circle 
            cx="150" 
            cy="150" 
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="1"
          />
          {/* Progress arc */}
          <motion.circle 
            cx="150" 
            cy="150" 
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ ease: "linear", duration: 0.2 }}
            strokeLinecap="round"
          />
          {/* Orbiting dot */}
          <motion.g 
            animate={{ rotate: progress * 360 }} 
            style={{ originX: "150px", originY: "150px" }}
            transition={{ ease: "linear", duration: 0.2 }}
          >
            <circle 
              cx="270" 
              cy="150" 
              r="3" 
              fill="var(--accent)" 
            />
          </motion.g>
        </svg>

        {/* Text content */}
        <motion.div 
          className="flex flex-col items-center justify-center text-center px-4"
          animate={isRunning && !shouldReduceMotion ? { scale: [1, 1.003, 1] } : { scale: 1 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-[color:var(--text-tertiary)] uppercase tracking-widest text-xs font-semibold mb-3">
            {subject}
          </div>
          <div className="tabular-nums tracking-[-0.02em] font-light text-5xl md:text-7xl text-[color:var(--text-primary)] mb-2 font-display">
            {formatTime(elapsed)}
          </div>
          <div className="text-[color:var(--text-secondary)] text-sm font-normal truncate max-w-[200px]">
            {topic}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
