import React from 'react';
import { motion } from 'framer-motion';

export const Loader = () => {
  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC',
      zIndex: 9999
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        style={{
          width: '50px', height: '50px',
          border: '4px solid #E2E8F0', borderTop: '4px solid #0EA5E9',
          borderRadius: '50%', marginBottom: '1rem'
        }}
      />
      <motion.p
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
        style={{ color: '#0EA5E9', fontWeight: 600, fontSize: '1.1rem', letterSpacing: '1px' }}
      >
        LOADING...
      </motion.p>
    </div>
  );
};
