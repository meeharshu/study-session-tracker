import React, { useEffect } from 'react';
import { motion, useSpring, useTransform, useReducedMotion } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  format?: 'integer' | 'decimal' | 'time';
  className?: string;
  duration?: number;
}

const formatNumber = (val: number, formatType: 'integer' | 'decimal' | 'time') => {
  if (formatType === 'time') {
    const hours = Math.floor(val / 60);
    const minutes = Math.floor(val % 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }
  
  if (formatType === 'decimal') {
    return val.toFixed(1);
  }
  
  return Math.round(val).toString();
};

export default function AnimatedNumber({ value, format = 'integer', className = '', duration = 0.8 }: AnimatedNumberProps) {
  const shouldReduceMotion = useReducedMotion();
  
  const springValue = useSpring(value, {
    bounce: 0,
    duration: duration * 1000,
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const displayValue = useTransform(springValue, (current) => 
    formatNumber(current, format)
  );

  if (shouldReduceMotion) {
    return <span className={className}>{formatNumber(value, format)}</span>;
  }

  return <motion.span className={className}>{displayValue}</motion.span>;
}
