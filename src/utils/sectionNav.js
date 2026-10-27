/**
 * Shared route + section navigation helpers for Navbar, Footer and the service landing pages.
 * The project uses plain anchors (no router), so same-page clicks scroll and everything else
 * falls through to normal browser navigation, which opens the destination at the top.
 */

export const ROUTES = {
  home: '/',
  contact: '/contact',
  web: '/webdevelopment',
  software: '/softwaredevelopment',
  marketing: '/digitalmarketing',
  photoshoot: '/photoshoot',
};

// ids of each landing page's own capabilities / services section
export const SECTION_IDS = {
  web: 'services-we-offer',
  software: 'our-services',
  marketing: 'dmp-services',
  photoshoot: 'photoshoot-services',
};

// ids of each landing page's own why-choose section
export const WHY_CHOOSE_SECTION_IDS = {
  web: 'why-choose',
  software: 'why-choose',
  marketing: 'why-choose',
  photoshoot: 'why-choose',
};

export const WHY_CHOOSE_ROUTES = {
  web: `${ROUTES.web}#why-choose`,
  software: `${ROUTES.software}#why-choose`,
  marketing: `${ROUTES.marketing}#why-choose`,
  photoshoot: `${ROUTES.photoshoot}#why-choose`,
};

const SERVICE_PATHS = {
  web: ROUTES.web,
  software: ROUTES.software,
  marketing: ROUTES.marketing,
  photoshoot: ROUTES.photoshoot,
};

export const normalizePath = (p = '/') => {
  const clean = (p.split('#')[0].split('?')[0] || '/').replace(/\/+$/, '');
  return (clean || '/').toLowerCase();
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const behavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

/** Smoothly scrolls to an element id. Returns false (and does nothing) if it does not exist. */
export function scrollToId(id) {
  const el = id ? document.getElementById(id) : null;
  if (!el) return false;
  el.scrollIntoView({ behavior: behavior(), block: 'start' });
  return true;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: behavior() });
}

export function currentServiceSection() {
  const here = normalizePath(window.location.pathname);
  const key = Object.keys(SERVICE_PATHS).find((k) => SERVICE_PATHS[k] === here);
  return key ? SECTION_IDS[key] : null;
}

/**
 * Returns the page-specific Why Choose Us href based on the current pathname:
 * - On /webdevelopment: /webdevelopment#why-choose
 * - On /softwaredevelopment: /softwaredevelopment#why-choose
 * - On /digitalmarketing: /digitalmarketing#why-choose
 * - On /photoshoot: /photoshoot#why-choose
 * - On any other page (/ or /contact etc.): /webdevelopment#why-choose
 */
export function getWhyChooseHref(pathname = '/') {
  const clean = normalizePath(pathname);
  if (clean === normalizePath(ROUTES.software)) {
    return WHY_CHOOSE_ROUTES.software;
  }
  if (clean === normalizePath(ROUTES.marketing)) {
    return WHY_CHOOSE_ROUTES.marketing;
  }
  if (clean === normalizePath(ROUTES.photoshoot)) {
    return WHY_CHOOSE_ROUTES.photoshoot;
  }
  return WHY_CHOOSE_ROUTES.web;
}

/**
 * Returns the page-specific Home href based on the current pathname:
 * - On /webdevelopment: /webdevelopment
 * - On /softwaredevelopment: /softwaredevelopment
 * - On /digitalmarketing: /digitalmarketing
 * - On /photoshoot: /photoshoot
 * - On /: /
 * - On any other page (/contact etc.): /
 */
export function getHomeHref(pathname = '/') {
  const clean = normalizePath(pathname);
  if (clean === normalizePath(ROUTES.software)) return ROUTES.software;
  if (clean === normalizePath(ROUTES.web)) return ROUTES.web;
  if (clean === normalizePath(ROUTES.marketing)) return ROUTES.marketing;
  if (clean === normalizePath(ROUTES.photoshoot)) return ROUTES.photoshoot;
  return ROUTES.home;
}

/**
 * Shared Home click handler for Navbar and mobile menus.
 * When on a landing page (/softwaredevelopment, /webdevelopment, /digitalmarketing, /photoshoot, /),
 * scrolls smoothly to the top of the current page and keeps the current URL (clearing any hash).
 * On other pages (like /contact), navigates to the home page (/).
 */
export function handleHomeNavigation(event, { navigate } = {}) {
  if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0)) {
    return false;
  }

  event?.preventDefault();

  const currentPath = normalizePath(window.location.pathname);
  const isLandingPage = [
    normalizePath(ROUTES.home),
    normalizePath(ROUTES.web),
    normalizePath(ROUTES.software),
    normalizePath(ROUTES.marketing),
    normalizePath(ROUTES.photoshoot),
  ].includes(currentPath);

  if (isLandingPage) {
    scrollToTop();
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    return true;
  }

  // From other pages (like /contact), navigate to home
  if (navigate) {
    navigate(ROUTES.home);
  } else {
    window.location.assign(ROUTES.home);
  }
  return false;
}

export function navigateToSection(event, href, { section, navigate, auto } = {}) {
  if (typeof window === 'undefined' || !href) return false;

  // auto: handles "Home", "Services" or "Why Choose Us" links.
  if (auto === 'home') {
    return handleHomeNavigation(event, { navigate });
  }

  if (auto) {
    if (auto === 'why-choose') {
      const currentPath = normalizePath(window.location.pathname);
      // If we are on one of the service pages and it has #why-choose, scroll locally
      if (currentPath !== '/') {
        const ownWhy = document.getElementById('why-choose');
        if (ownWhy) {
          if (!(event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0))) {
            event?.preventDefault();
            scrollToId('why-choose');
            const targetHref = getWhyChooseHref(window.location.pathname);
            if (window.location.hash !== '#why-choose') {
              navigate ? navigate(targetHref) : window.history.pushState(null, '', targetHref);
            }
            return true;
          }
        }
      }
    } else {
      const own = currentServiceSection();
      if (own && document.getElementById(own)) {
        if (!(event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0))) {
          event?.preventDefault();
          scrollToId(own);
          return true;
        }
      }
    }
  }

  if (event && (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) return false;

  const [pathPart, hash = ''] = href.split('#');
  const destPath = normalizePath(pathPart || window.location.pathname);
  const samePage = destPath === normalizePath(window.location.pathname);
  event?.preventDefault();

  if (!samePage) {
    if (navigate) navigate(href);
    else window.location.assign(href);
    return false;
  }

  const targetId = section || hash;
  if (targetId) {
    scrollToId(targetId); // silently does nothing if the id is missing
    if (hash && window.location.hash !== `#${hash}`) navigate ? navigate(href) : window.history.pushState(null, '', href);
    else if (!hash && window.location.hash) window.history.replaceState(null, '', destPath === '/' ? '/' : window.location.pathname);
  } else {
    scrollToTop();
    // clicking Home / the logo should leave a clean URL, not a stale #section
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
  }
  return true;
}