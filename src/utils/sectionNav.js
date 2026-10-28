/**
 * Shared route + section navigation helpers for Navbar, Footer and the service landing pages.
 * The project uses plain anchors (no router), so same-page clicks scroll and everything else
 * falls through to normal browser navigation, which opens the destination at the top.
 */

export const ROUTES = {
  home: '/webdevelopment',
  contact: '/contact',
  whyChoose: '/webdevelopment#why-choose',
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

const LAST_SERVICE_KEY = 'atriowings_last_service';

export const normalizePath = (p = '/') => {
  const clean = (p.split('#')[0].split('?')[0] || '/').replace(/\/+$/, '');
  return (clean || '/').toLowerCase();
};

export function saveLastServiceRoute(pathname) {
  if (typeof window === 'undefined') return;
  const clean = normalizePath(pathname);
  const isService = [
    normalizePath(ROUTES.web),
    normalizePath(ROUTES.software),
    normalizePath(ROUTES.marketing),
    normalizePath(ROUTES.photoshoot),
  ].includes(clean);
  if (isService) {
    try {
      sessionStorage.setItem(LAST_SERVICE_KEY, clean);
    } catch {
      // ignore
    }
  }
}

export function getLastServiceRoute() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = sessionStorage.getItem(LAST_SERVICE_KEY);
    if (saved) return saved;
  } catch {
    // ignore
  }
  return null;
}

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
 * - On /contact: returns to the previously selected service's section when available,
 *   otherwise falls back to /webdevelopment#why-choose.
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
  if (clean === normalizePath(ROUTES.web) || clean === '/') {
    return WHY_CHOOSE_ROUTES.web;
  }
  // On /contact or other non-service page, check previously visited service
  const last = getLastServiceRoute();
  if (last) {
    if (last === normalizePath(ROUTES.software)) return WHY_CHOOSE_ROUTES.software;
    if (last === normalizePath(ROUTES.marketing)) return WHY_CHOOSE_ROUTES.marketing;
    if (last === normalizePath(ROUTES.photoshoot)) return WHY_CHOOSE_ROUTES.photoshoot;
    if (last === normalizePath(ROUTES.web)) return WHY_CHOOSE_ROUTES.web;
  }
  return WHY_CHOOSE_ROUTES.web;
}

/**
 * Returns the Home destination based on current pathname:
 * - On /softwaredevelopment: returns /softwaredevelopment
 * - On all other pages: points to the primary Web Development promotional landing page (/webdevelopment).
 */
export function getHomeHref(pathname = '/') {
  const clean = normalizePath(pathname);
  if (clean === normalizePath(ROUTES.software)) {
    return ROUTES.software;
  }
  return ROUTES.web;
}

/**
 * Shared Home click handler for Navbar, brand logo, mobile menus and Footer.
 * - When on /softwaredevelopment, scrolls smoothly to its own hero section and clears any hash.
 * - When on /webdevelopment, scrolls smoothly to the top and clears any hash.
 * - From any other page (/contact, etc.), navigates to /webdevelopment.
 */
export function handleHomeNavigation(event, { navigate } = {}) {
  if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0)) {
    return false;
  }

  event?.preventDefault();

  const currentPath = normalizePath(window.location.pathname);
  const isSoftwareDev = currentPath === normalizePath(ROUTES.software);
  const isAlreadyWebDev = currentPath === normalizePath(ROUTES.web) || currentPath === '/';

  if (isSoftwareDev) {
    scrollToTop();
    if (window.location.hash) {
      if (navigate) {
        navigate(ROUTES.software, { replace: true });
      } else {
        window.history.replaceState(null, '', ROUTES.software);
      }
    }
    return true;
  }

  if (isAlreadyWebDev) {
    scrollToTop();
    if (window.location.hash || currentPath === '/') {
      if (navigate) {
        navigate(ROUTES.web, { replace: true });
      } else {
        window.history.replaceState(null, '', ROUTES.web);
      }
    }
    return true;
  }

  // From other pages (like /contact, etc.), navigate to /webdevelopment
  if (navigate) {
    navigate(ROUTES.web);
  } else {
    window.location.assign(ROUTES.web);
  }
  return false;
}

/**
 * Shared Why Choose Us click handler.
 * - If on any service page (/photoshoot, /softwaredevelopment, /digitalmarketing, /webdevelopment),
 *   scrolls smoothly to that page's own #why-choose section without switching pages.
 * - If on /contact, navigates back to the previously visited service page's #why-choose section
 *   (or the default /webdevelopment#why-choose).
 */
export function handleWhyChooseNavigation(event, { navigate } = {}) {
  if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0)) {
    return false;
  }

  event?.preventDefault();

  const currentPath = normalizePath(window.location.pathname);
  const isService = [
    normalizePath(ROUTES.web),
    normalizePath(ROUTES.software),
    normalizePath(ROUTES.marketing),
    normalizePath(ROUTES.photoshoot),
  ].includes(currentPath);

  // If already on a service landing page, scroll to its own #why-choose section
  if (isService) {
    const el = document.getElementById('why-choose');
    if (el) {
      scrollToId('why-choose');
    }
    const targetHash = '#why-choose';
    const targetHref = `${currentPath}${targetHash}`;
    if (window.location.hash !== targetHash) {
      if (navigate) {
        navigate(targetHref);
      } else {
        window.history.pushState(null, '', targetHref);
      }
    }
    return true;
  }

  // From other pages (like /contact), navigate to the previously visited service or default landing page
  const targetHref = getWhyChooseHref(window.location.pathname);
  if (navigate) {
    navigate(targetHref);
  } else {
    window.location.assign(targetHref);
  }
  return false;
}

export function navigateToSection(event, href, { section, navigate, auto } = {}) {
  if (typeof window === 'undefined' || !href) return false;

  // auto: handles "Home", "Services" or "Why Choose Us" links.
  if (auto === 'home') {
    return handleHomeNavigation(event, { navigate });
  }

  if (auto === 'why-choose') {
    return handleWhyChooseNavigation(event, { navigate });
  }

  if (auto && auto !== 'why-choose' && auto !== 'home') {
    const own = currentServiceSection();
    if (own && document.getElementById(own)) {
      if (!(event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0))) {
        event?.preventDefault();
        scrollToId(own);
        return true;
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
    if (hash && window.location.hash !== `#${hash}`) {
      if (navigate) navigate(href);
      else window.history.pushState(null, '', href);
    } else if (!hash && window.location.hash) {
      if (navigate) navigate(destPath, { replace: true });
      else window.history.replaceState(null, '', destPath);
    }
  } else {
    scrollToTop();
    // clicking Home / the logo should leave a clean URL, not a stale #section
    if (window.location.hash) {
      if (navigate) navigate(window.location.pathname, { replace: true });
      else window.history.replaceState(null, '', window.location.pathname);
    }
  }
  return true;
}