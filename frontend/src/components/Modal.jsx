import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const modalRef = useRef(null);
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            className={`relative glass-card w-full ${sizeClasses[size]} max-h-[94dvh] overflow-y-auto rounded-t-2xl p-4 outline-none sm:max-h-[90vh] sm:rounded-2xl sm:p-6`}
          >
            {/* Header */}
            <div className="sticky top-0 z-20 -mx-1 mb-5 flex items-center justify-between bg-[#FFFFFF]/95 px-1 py-1 backdrop-blur sm:mb-6">
              <h2 id="modal-title" className="pr-4 text-lg font-bold font-display text-gradient sm:text-xl">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-[#E2E8F0]/30 text-[#64748B] hover:text-[#0F172A] transition-colors"
                aria-label="Close dialog"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="space-y-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
