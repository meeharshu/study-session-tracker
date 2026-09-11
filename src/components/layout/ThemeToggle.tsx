import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-[color:var(--bg-secondary)] transition-colors relative overflow-hidden text-[color:var(--text-primary)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotateZ: -90 }}
            animate={{ opacity: 1, rotateZ: 0 }}
            exit={{ opacity: 0, rotateZ: 90 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Moon size={16} strokeWidth={1.5} />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotateZ: -90 }}
            animate={{ opacity: 1, rotateZ: 0 }}
            exit={{ opacity: 0, rotateZ: 90 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            <Sun size={16} strokeWidth={1.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
