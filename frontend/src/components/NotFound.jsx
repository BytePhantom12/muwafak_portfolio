import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiHome, HiArrowLeft, HiExclamationTriangle } from 'react-icons/hi2';
import { useEffect, useState } from 'react';

const glitchVariants = {
  initial: { x: 0 },
  animate: {
    x: [0, -2, 2, -1, 1, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 3,
      ease: "easeInOut"
    }
  }
};

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function NotFound() {
  const [glitchText, setGlitchText] = useState('404');

  useEffect(() => {
    const glitchChars = ['4', '0', '4', '█', '▓', '▒', '░'];
    const interval = setInterval(() => {
      const randomText = Array.from({ length: 3 }, () => 
        glitchChars[Math.floor(Math.random() * glitchChars.length)]
      ).join('');
      setGlitchText(randomText);
      
      setTimeout(() => setGlitchText('404'), 100);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="blob w-[400px] h-[400px] bg-[#00d4ff] top-[-100px] right-[-100px] opacity-20" />
        <div className="blob w-[500px] h-[500px] bg-[#7c3aed] bottom-[-150px] left-[-150px] opacity-15" />
        
        {/* Scanning lines */}
        <motion.div
          className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-60"
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-[#7c3aed] to-transparent opacity-40"
          animate={{ left: ['-10%', '110%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 1.5 }}
        />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          {/* Glitch 404 Text */}
          <motion.div
            className="relative mb-8"
            variants={glitchVariants}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-8xl md:text-9xl font-bold font-display text-gradient mb-4 relative">
              {glitchText}
              {/* Glitch overlay effects */}
              <span className="absolute inset-0 text-[#00d4ff] opacity-70 animate-pulse">
                {glitchText}
              </span>
              <span className="absolute inset-0 text-[#7c3aed] opacity-50 translate-x-1 translate-y-1">
                {glitchText}
              </span>
            </h1>
            
            {/* Tech corner brackets */}
            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#00d4ff] opacity-60" />
            <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-[#7c3aed] opacity-60" />
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-[#7c3aed] opacity-60" />
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#00d4ff] opacity-60" />
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <div className="glass-card p-6 mb-6 relative overflow-hidden">
              {/* Tech grid background */}
              <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              
              <div className="relative z-10">
                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00d4ff]/20 to-[#7c3aed]/20 mb-4 mx-auto"
                >
                  <HiExclamationTriangle className="w-8 h-8 text-[#00d4ff]" />
                </motion.div>
                
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-3">
                  <span className="text-gradient">System Error</span>
                </h2>
                <p className="text-slate-400 text-lg mb-2">
                  The requested page could not be found in the database.
                </p>
                <p className="text-slate-500 text-sm">
                  <span className="text-[#00d4ff] font-mono">ERROR_CODE:</span> PAGE_NOT_FOUND
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/" className="btn-primary group">
              <HiHome className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              Return Home
            </Link>
            
            <button 
              onClick={() => window.history.back()} 
              className="btn-outline group"
            >
              <HiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Go Back
            </button>
          </motion.div>

          {/* Tech Status Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-12"
          >
            <div className="glass-card p-4 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>SYSTEM STATUS</span>
                <span className="text-[#00d4ff]">OPERATIONAL</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse" />
                  <span className="text-xs text-slate-500">SERVER</span>
                </div>
                <div>
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mx-auto mb-1 animate-pulse" />
                  <span className="text-xs text-slate-500">DATABASE</span>
                </div>
                <div>
                  <div className="w-2 h-2 bg-red-400 rounded-full mx-auto mb-1 animate-pulse" />
                  <span className="text-xs text-slate-500">PAGE</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating tech elements */}
      <motion.div
        className="absolute top-20 left-10 w-4 h-4 border border-[#00d4ff]/30 rotate-45"
        animate={{ 
          rotate: [45, 225, 45],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute bottom-32 right-16 w-6 h-6 border border-[#7c3aed]/40"
        animate={{ 
          rotate: [0, 360],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute top-1/3 right-20 w-2 h-2 bg-[#00d4ff] rounded-full"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}