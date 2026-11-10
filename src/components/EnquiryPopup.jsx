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
  const prevIsOpenRef = useRef(false);
  const focusTimerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(
    (e) => {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
      }
      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
        focusTimerRef.current = null;
      }
      // Safely blur active element if inside popup so no lingering focus or validation blur events fire
      if (
        document.activeElement &&
        cardRef.current &&
        cardRef.current.contains(document.activeElement)
      ) {
        try {
          document.activeElement.blur();
        } catch {
          /* ignore */
        }
      }
      closePopup();
    },
    [closePopup]
  );

  // Handle focus management & scroll lock
  useEffect(() => {
    if (!isOpen) {
      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
        focusTimerRef.current = null;
      }
      prevIsOpenRef.current = false;
      return;
    }

    const wasOpen = prevIsOpenRef.current;
    prevIsOpenRef.current = true;

    // Save previously focused element to return focus on close ONLY when transitioning to open,
    // and ONLY if the active element is not already inside the popup
    if (!wasOpen) {
      const activeEl = document.activeElement;
      if (activeEl && (!cardRef.current || !cardRef.current.contains(activeEl))) {
        lastFocusedElementRef.current = activeEl;
      } else {
        lastFocusedElementRef.current = null;
      }
    }

    // Lock page scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus to Full Name input once mounted in DOM only on initial open
    if (!wasOpen) {
      focusTimerRef.current = setTimeout(() => {
        const nameInput = document.getElementById('eqp-name');
        if (nameInput) {
          nameInput.focus();
        } else if (closeBtnRef.current) {
          closeBtnRef.current.focus();
        }
      }, 40);
    }

    // Keyboard handlers: Escape to close & Tab trapping
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose(e);
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
      if (focusTimerRef.current) {
        clearTimeout(focusTimerRef.current);
        focusTimerRef.current = null;
      }
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;

      // Return focus to previous element only if it was outside the popup
      const targetToRestore = lastFocusedElementRef.current;
      if (
        targetToRestore &&
        (!cardRef.current || !cardRef.current.contains(targetToRestore)) &&
        typeof targetToRestore.focus === 'function'
      ) {
        try {
          targetToRestore.focus();
        } catch {
          /* ignore */
        }
      }
      lastFocusedElementRef.current = null;
    };
  }, [isOpen, handleClose]);

  // Overlay click: close if clicking backdrop outside card
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        handleClose(e);
      }
    },
    [handleClose]
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
      handleClose();
    }, 2000);
  }, [handleClose]);

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
              onClick={handleClose}
              onPointerDown={handleClose}
              aria-label="Close"
              ref={closeBtnRef}
            >
              <X size={20} aria-hidden="true" style={{ pointerEvents: 'none' }} />
            </button>

            <div className="eqp-header">
              <h2 id="eqp-title" className="eqp-title">
                Get a free consultation
              </h2>
              <p className="eqp-subtitle">
                Share your details and our team will contact you.
              </p>
            </div>

            <EnquiryForm
              idPrefix="eqp"
              source="Software Development Consultation"
              onSuccess={handleFormSuccess}
              className="eqp-form"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

