import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';
import Modal from '../ui/Modal';

const SessionCreator: React.FC = () => {
  const { state, dispatch } = useStudy();
  
  const [selectedSubject, setSelectedSubject] = useState<string | null>(
    () => state.subjects[0]?.name || null
  );
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState<number | null>(45);
  const [intention, setIntention] = useState('');

  const durations = [
    { label: '25 min', value: 25 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 },
    { label: '90 min', value: 90 },
    { label: 'Open-ended', value: null },
  ];

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_SESSION_CREATOR' });
  };

  const handleBegin = () => {
    if (!selectedSubject) return;
    
    dispatch({
      type: 'START_SESSION',
      payload: {
        subject: selectedSubject,
        topic: topic.trim() || 'General',
        intention: intention.trim() || undefined,
        targetDuration: duration,
      }
    });
    
    // Reset state after start
    setSelectedSubject(null);
    setTopic('');
    setDuration(45);
    setIntention('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <Modal isOpen={state.showSessionCreator} onClose={handleClose}>
      <div className="p-8 pb-10">
        <h2 className="text-2xl font-semibold mb-8 text-[color:var(--text-primary)]">New Session</h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Subject */}
          <motion.div variants={itemVariants}>
            <label className="font-label block mb-3">SUBJECT</label>
            <div className="flex flex-wrap gap-2">
              {state.subjects.map(subject => {
                const isSelected = selectedSubject === subject.name;
                return (
                  <motion.button
                    key={subject.name}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSubject(subject.name)}
                    className={`px-4 py-2 rounded-full border text-sm transition-colors duration-200
                      ${isSelected 
                        ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)]' 
                        : 'border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-muted)]'
                      }`}
                  >
                    {subject.name}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Topic */}
          <motion.div variants={itemVariants}>
            <label className="font-label block mb-1">TOPIC</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Binary Search Trees"
              className="w-full border-b border-[color:var(--border)] bg-transparent py-2 text-[color:var(--text-primary)] placeholder-[color:var(--text-tertiary)] placeholder-italic focus:outline-none focus:border-[color:var(--accent)] transition-colors"
            />
          </motion.div>

          {/* Duration */}
          <motion.div variants={itemVariants}>
            <label className="font-label block mb-3">DURATION</label>
            <div className="flex flex-wrap gap-2">
              {durations.map((d, i) => {
                const isSelected = duration === d.value;
                return (
                  <motion.button
                    key={i}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDuration(d.value)}
                    className={`px-4 py-2 rounded-full border text-sm transition-colors duration-200
                      ${isSelected 
                        ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)]' 
                        : 'border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-muted)]'
                      }`}
                  >
                    {d.label}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Intention */}
          <motion.div variants={itemVariants}>
            <label className="font-label block mb-1">INTENTION</label>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="What will you focus on?"
              rows={2}
              className="w-full border-b border-[color:var(--border)] bg-transparent py-2 text-[color:var(--text-primary)] placeholder-[color:var(--text-tertiary)] placeholder-italic focus:outline-none focus:border-[color:var(--accent)] transition-colors resize-none"
            />
          </motion.div>

          {/* Begin Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <button
              type="button"
              disabled={!selectedSubject}
              onClick={handleBegin}
              className={`w-full py-3 rounded-full font-medium uppercase tracking-widest text-sm transition-all duration-300
                ${selectedSubject 
                  ? 'bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-hover)]' 
                  : 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-tertiary)] cursor-not-allowed'
                }`}
            >
              Begin Session
            </button>
          </motion.div>
        </motion.div>
      </div>
    </Modal>
  );
};

export default SessionCreator;
