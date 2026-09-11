import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStudy } from '../../context/StudyContext';
import Modal from '../ui/Modal';
import { Plus, Check } from 'lucide-react';

const SessionCreator: React.FC = () => {
  const { state, dispatch } = useStudy();
  
  const [selectedSubject, setSelectedSubject] = useState<string | null>(
    () => state.subjects[0]?.name || null
  );
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [showNewSubject, setShowNewSubject] = useState(false);

  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState<number | null>(45);
  const [customDuration, setCustomDuration] = useState<string>('30');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [intention, setIntention] = useState('');

  const durationPresets = [
    { label: '25 min', value: 25 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 },
    { label: '90 min', value: 90 },
    { label: 'Open-ended', value: null },
  ];

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_SESSION_CREATOR' });
  };

  const handleAddSubject = () => {
    const trimmed = newSubjectInput.trim();
    if (trimmed) {
      dispatch({ type: 'ADD_SUBJECT', payload: { name: trimmed } });
      setSelectedSubject(trimmed);
      setNewSubjectInput('');
      setShowNewSubject(false);
    }
  };

  const handleBegin = () => {
    if (!selectedSubject) return;
    
    const finalDuration = isCustomDuration 
      ? Math.max(5, parseInt(customDuration, 10) || 45) 
      : duration;

    dispatch({
      type: 'START_SESSION',
      payload: {
        subject: selectedSubject,
        topic: topic.trim() || 'General Focus',
        intention: intention.trim() || undefined,
        targetDuration: finalDuration,
      }
    });
    
    // Reset state after start
    setTopic('');
    setDuration(45);
    setIsCustomDuration(false);
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
      <div className="p-6 sm:p-8 pb-10 max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-8 text-[color:var(--text-primary)]">Configure Focus Session</h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-7"
        >
          {/* Subject Selection */}
          <motion.div variants={itemVariants}>
            <label className="font-label block mb-3">SUBJECT</label>
            <div className="flex flex-wrap gap-2 items-center">
              {state.subjects.map(subject => {
                const isSelected = selectedSubject === subject.name;
                return (
                  <motion.button
                    key={subject.name}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedSubject(subject.name)}
                    className={`px-4 py-2 rounded-full border text-sm transition-colors duration-200 cursor-pointer
                      ${isSelected 
                        ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)] font-medium shadow-sm' 
                        : 'border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-muted)]'
                      }`}
                  >
                    {subject.name}
                  </motion.button>
                );
              })}

              {!showNewSubject ? (
                <button
                  type="button"
                  onClick={() => setShowNewSubject(true)}
                  className="px-3 py-2 rounded-full border border-dashed border-[color:var(--border)] text-xs text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] hover:border-[color:var(--accent)] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Add
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    autoFocus
                    value={newSubjectInput}
                    onChange={(e) => setNewSubjectInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                    placeholder="New subject..."
                    className="px-3 py-1.5 rounded-full border border-[color:var(--accent)] text-xs bg-transparent text-[color:var(--text-primary)] focus:outline-none w-28"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="p-1.5 rounded-full bg-[color:var(--accent)] text-white cursor-pointer"
                  >
                    <Check size={12} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Topic */}
          <motion.div variants={itemVariants}>
            <label className="font-label block mb-1">TOPIC</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Binary Search Trees or Chapter 4"
              className="w-full border-b border-[color:var(--border)] bg-transparent py-2 text-[color:var(--text-primary)] placeholder-[color:var(--text-tertiary)] focus:outline-none focus:border-[color:var(--accent)] transition-colors"
            />
          </motion.div>

          {/* Duration */}
          <motion.div variants={itemVariants}>
            <label className="font-label block mb-3">DURATION</label>
            <div className="flex flex-wrap gap-2 items-center">
              {durationPresets.map((d, i) => {
                const isSelected = !isCustomDuration && duration === d.value;
                return (
                  <motion.button
                    key={i}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsCustomDuration(false);
                      setDuration(d.value);
                    }}
                    className={`px-4 py-2 rounded-full border text-sm transition-colors duration-200 cursor-pointer
                      ${isSelected 
                        ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)] font-medium shadow-sm' 
                        : 'border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-muted)]'
                      }`}
                  >
                    {d.label}
                  </motion.button>
                );
              })}

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCustomDuration(true)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors duration-200 cursor-pointer
                  ${isCustomDuration 
                    ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)] font-medium shadow-sm' 
                    : 'border-[color:var(--border)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-muted)]'
                  }`}
              >
                Custom
              </motion.button>

              {isCustomDuration && (
                <div className="flex items-center gap-1.5 ml-1">
                  <input
                    type="number"
                    min="5"
                    max="360"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="w-16 px-2 py-1 border border-[color:var(--accent)] rounded-md bg-transparent text-sm text-[color:var(--text-primary)] font-mono-num text-center focus:outline-none"
                  />
                  <span className="text-xs text-[color:var(--text-tertiary)]">min</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Intention */}
          <motion.div variants={itemVariants}>
            <label className="font-label block mb-1">INTENTION (OPTIONAL)</label>
            <textarea
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="What specific outcome will define success for this block?"
              rows={2}
              className="w-full border-b border-[color:var(--border)] bg-transparent py-2 text-[color:var(--text-primary)] placeholder-[color:var(--text-tertiary)] focus:outline-none focus:border-[color:var(--accent)] transition-colors resize-none text-sm"
            />
          </motion.div>

          {/* Begin Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <button
              type="button"
              disabled={!selectedSubject}
              onClick={handleBegin}
              className={`w-full py-3.5 rounded-full font-medium uppercase tracking-widest text-xs transition-all duration-300 shadow-md cursor-pointer
                ${selectedSubject 
                  ? 'bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-hover)]' 
                  : 'bg-[color:var(--bg-tertiary)] text-[color:var(--text-tertiary)] cursor-not-allowed'
                }`}
            >
              Begin Focus Session
            </button>
          </motion.div>
        </motion.div>
      </div>
    </Modal>
  );
};

export default SessionCreator;
