import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WebDevelopmentPage from './pages/WebDevelopmentPage';
import SoftwareDevelopmentPage from './pages/SoftWareDevelopment';
import DigitalMarketingPage from './pages/DigitalMarketingPage';
import ContactPage from './pages/ContactPage';
import { ROUTES } from './utils/sectionNav';

// Opens the #hash section if present, otherwise the top of the page.
// Honours prefers-reduced-motion.
function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (hash) {
      const targetId = decodeURIComponent(hash.slice(1));
      let tries = 0;
      let followUpTimer = null;

      // The page may still be rendering after a route change or page refresh, so retry until target exists
      const timer = setInterval(() => {
        tries += 1;
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
          clearInterval(timer);

          // Follow-up adjustment if layout shifted as images or fonts finished rendering
          followUpTimer = setTimeout(() => {
            const rect = element.getBoundingClientRect();
            if (Math.abs(rect.top - 110) > 60 && Math.abs(rect.top) > 60) {
              element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
            }
          }, 350);
        } else if (tries > 35) {
          clearInterval(timer);
        }
      }, 50);

      return () => {
        clearInterval(timer);
        if (followUpTimer) clearTimeout(followUpTimer);
      };
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    return undefined;
  }, [pathname, hash]);

  return null;
}

// Any plain <a href="/contact"> in the site opens the Contact page without a full reload
// (a reload would replay the intro animation). mailto: and external links are untouched.
function ContactLinkHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname.replace(/\/+$/, '') === ROUTES.contact) {
        e.preventDefault();
        navigate(ROUTES.contact);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
  return null;
}

// Old URLs keep working: /services/web-development#why-choose -> /webdevelopment#why-choose
function LegacyRedirect({ to }) {
  const { hash } = useLocation();
  return <Navigate to={`${to}${hash}`} replace />;
}

function App() {
  return (
    <>
      <ScrollHandler />
      <ContactLinkHandler />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Dedicated service landing pages */}
        <Route path="/webdevelopment" element={<WebDevelopmentPage />} />
        <Route path="/softwaredevelopment" element={<SoftwareDevelopmentPage />} />
        <Route path="/digitalmarketing" element={<DigitalMarketingPage />} />

        <Route path="/contact" element={<ContactPage />} />

        {/* Legacy paths */}
        <Route path="/services/web-development" element={<LegacyRedirect to="/webdevelopment" />} />
        <Route path="/services/software-development" element={<LegacyRedirect to="/softwaredevelopment" />} />
        <Route path="/services/digital-marketing" element={<LegacyRedirect to="/digitalmarketing" />} />
      </Routes>
    </>
  );
}

export default App;