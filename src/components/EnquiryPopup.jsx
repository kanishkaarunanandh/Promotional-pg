import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEnquiryPopupContext } from '../context/EnquiryPopupContext';
import EnquiryForm from './EnquiryForm';
import './enquiry-popup.css';

export default function EnquiryPopup() {
  const { isOpen, closePopup } = useEnquiryPopupContext();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  const cardRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastFocusedElementRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle focus management & scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Save previously focused element to return focus on close
    lastFocusedElementRef.current = document.activeElement;

    // Lock page scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus to Full Name input once mounted in DOM
    const focusTimer = setTimeout(() => {
      const nameInput = document.getElementById('eqp-name');
      if (nameInput) {
        nameInput.focus();
      } else if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      }
    }, 40);

    // Keyboard handlers: Escape to close & Tab trapping
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePopup();
        return;
      }

      if (e.key === 'Tab') {
        const card = cardRef.current;
        if (!card) return;

        const focusable = card.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;

      // Return focus to previous element
      if (lastFocusedElementRef.current && typeof lastFocusedElementRef.current.focus === 'function') {
        try {
          lastFocusedElementRef.current.focus();
        } catch {
          /* ignore */
        }
      }
    };
  }, [isOpen, closePopup]);

  // Overlay click: close if clicking backdrop outside card
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        closePopup();
      }
    },
    [closePopup]
  );

  // Successful submission callback
  const handleFormSuccess = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('enquiry_submitted', 'true');
      } catch {
        /* ignore localStorage quota/disabled errors */
      }
    }
    // Auto-close popup after 2 seconds allowing user to view the success message
    setTimeout(() => {
      closePopup();
    }, 2000);
  }, [closePopup]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="eqp-overlay"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="eqp-title"
        >
          <motion.div
            className="eqp-card"
            ref={cardRef}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              className="eqp-close-btn"
              onClick={closePopup}
              aria-label="Close"
              ref={closeBtnRef}
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div className="eqp-header">
              <h2 id="eqp-title" className="eqp-title">
                Get a free consultation
              </h2>
              <p className="eqp-subtitle">
                Share your details and our team will contact you.
              </p>
            </div>

            <EnquiryForm idPrefix="eqp" onSuccess={handleFormSuccess} className="eqp-form" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

