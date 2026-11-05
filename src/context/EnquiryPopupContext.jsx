import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import EnquiryPopup from '../components/EnquiryPopup';

const EnquiryPopupContext = createContext(null);

export function EnquiryPopupProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const timerRef = useRef(null);
  const activeRequestsRef = useRef(0);
  const hasClosedOnCurrentPageRef = useRef(false);

  // Clear timers and reset page-level close state on route changes
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    activeRequestsRef.current = 0;
    hasClosedOnCurrentPageRef.current = false;
    setIsOpen(false);
  }, [location.pathname]);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    hasClosedOnCurrentPageRef.current = true;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const openPopup = useCallback(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('enquiry_submitted') === 'true') {
      return;
    }
    setIsOpen(true);
  }, []);

  const requestPopup = useCallback(({ delay = 3000, enabled = true } = {}) => {
    if (!enabled) return () => {};

    // Never show again if user has already submitted an enquiry
    if (typeof window !== 'undefined' && localStorage.getItem('enquiry_submitted') === 'true') {
      return () => {};
    }

    // Ignore if already open or if user already closed it on this page view
    if (isOpen || hasClosedOnCurrentPageRef.current) {
      return () => {};
    }

    activeRequestsRef.current += 1;

    // Start timer only if one isn't already counting down
    if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        if (
          !hasClosedOnCurrentPageRef.current &&
          (typeof window === 'undefined' || localStorage.getItem('enquiry_submitted') !== 'true')
        ) {
          setIsOpen(true);
        }
      }, delay);
    }

    // Cleanup: cancel timer if all requesting sections/pages on this view have unmounted
    return () => {
      activeRequestsRef.current = Math.max(0, activeRequestsRef.current - 1);
      if (activeRequestsRef.current === 0 && timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen]);

  const value = {
    isOpen,
    openPopup,
    closePopup,
    requestPopup,
  };

  return (
    <EnquiryPopupContext.Provider value={value}>
      {children}
      <EnquiryPopup />
    </EnquiryPopupContext.Provider>
  );
}

export function useEnquiryPopupContext() {
  const context = useContext(EnquiryPopupContext);
  if (!context) {
    throw new Error('useEnquiryPopupContext must be used within an EnquiryPopupProvider');
  }
  return context;
}

export function useEnquiryPopup({ delay = 3000, enabled = true } = {}) {
  const { requestPopup } = useEnquiryPopupContext();

  useEffect(() => {
    if (!enabled) return;
    const cleanup = requestPopup({ delay, enabled });
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [delay, enabled, requestPopup]);
}

