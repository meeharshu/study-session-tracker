import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface FocusRatingProps {
  value: number;
  onChange: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md';
}

const FocusRating: React.FC<FocusRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'md'
}) => {
  const shouldReduceMotion = useReducedMotion();
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className={`flex flex-col items-center justify-center ${size === 'sm' ? 'gap-1' : 'gap-2'}`}>
      <div className="flex gap-2 relative">
        {numbers.map((num) => {
          const isSelected = value === num;
          return (
            <button
              key={num}
              type="button"
              disabled={readOnly}
              onClick={() => onChange(num)}
              className={`focus-rating-btn ${size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} 
                ${isSelected ? 'selected' : ''} 
                ${readOnly ? 'pointer-events-none' : ''}`}
            >
              <span className={`tabular-nums transition-colors duration-150 ${isSelected ? 'text-white font-medium' : 'text-[color:var(--text-secondary)]'}`}>
                {num.toString().padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>
      {!readOnly && (
        <div className="flex justify-between w-full px-1 text-[10px] text-[color:var(--text-tertiary)] uppercase tracking-wider">
          <span>Distracted</span>
          <span>Deep Focus</span>
        </div>
      )}
    </div>
  );
};

export default FocusRating;
