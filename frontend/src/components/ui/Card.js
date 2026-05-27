import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', glow = false, onClick, hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 ${glow ? 'shadow-lg shadow-purple-500/10' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
};

export default Card;
