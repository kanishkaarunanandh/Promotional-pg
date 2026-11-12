import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import WebDevelopmentPage from './pages/WebDevelopmentPage';
import SoftwareDevelopmentPage from './pages/SoftWareDevelopment';
import DigitalMarketingPage from './pages/DigitalMarketingPage';
import PhotoshootPage from './pages/photoshoot';
import ContactPage from './pages/ContactPage';
import { ROUTES, WHATSAPP_URL, openWhatsApp, saveLastServiceRoute } from './utils/sectionNav';

const PAGE_TITLES = {
  '/': 'Web Development Services | Atriowings Technologies',
  '/webdevelopment': 'Web Development Services | Atriowings Technologies',
  '/softwaredevelopment': 'Software Development Services | Atriowings Technologies',
  '/digitalmarketing': 'Digital Marketing Services | Atriowings Technologies',
  '/photoshoot': 'Product Photography & Video Ads | Atriowings Technologies',
  '/photography': 'Product Photography & Video Ads | Atriowings Technologies',
  '/product-photography': 'Product Photography & Video Ads | Atriowings Technologies',
  '/contact': 'Contact Us | Atriowings Technologies',
  '/services/web-development': 'Web Development Services | Atriowings Technologies',
  '/services/software-development': 'Software Development Services | Atriowings Technologies',
  '/services/digital-marketing': 'Digital Marketing Services | Atriowings Technologies',
};

// Opens the #hash section if present, otherwise the top of the page.
// Honours prefers-reduced-motion.
function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    saveLastServiceRoute(pathname);
    const cleanPath = pathname.replace(/\/+$/, '') || '/';
    document.title = PAGE_TITLES[cleanPath] || 'Web Development Services | Atriowings Technologies';
  }, [pathname]);

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

// Any click on a Contact button / link redirects directly to WhatsApp in a new tab instead of /contact
function ContactLinkHandler() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const isContactPath =
        href === '/contact' ||
        href.startsWith('/contact?') ||
        href.startsWith('/contact#') ||
        (a.pathname && a.pathname.toLowerCase() === '/contact');

      if (isContactPath) {
        e.preventDefault();
        const service = a.dataset.service || window.location.pathname;
        openWhatsApp(service);
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
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
        {/* Entry page redirects to the Web Development landing page */}
        <Route path="/" element={<LegacyRedirect to="/webdevelopment" />} />

        {/* Dedicated service landing pages */}
        <Route path="/webdevelopment" element={<WebDevelopmentPage />} />
        <Route path="/softwaredevelopment" element={<SoftwareDevelopmentPage />} />
        <Route path="/digitalmarketing" element={<DigitalMarketingPage />} />
        <Route path="/photoshoot" element={<PhotoshootPage />} />
        <Route path="/photography" element={<Navigate to="/photoshoot" replace />} />
        <Route path="/product-photography" element={<Navigate to="/photoshoot" replace />} />

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
