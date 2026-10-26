import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ArrowRight, Globe, Code2, Megaphone } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import atriowingsLogo from '../assets/atriowings-logo.png';
import atriowingsIcon from '../assets/atriowings-icon.png';
import { ROUTES, SECTION_IDS, navigateToSection, getWhyChooseHref, getHomeHref, handleHomeNavigation } from '../utils/sectionNav';
import './Navbar.css';

// Dropdown items. Each service has its own URL; `section` is the page's capabilities section,
// which is where the link scrolls when you are already on that page.
const SERVICES = [
  { label: 'Web Development', href: ROUTES.web, section: SECTION_IDS.web, icon: Globe },
  { label: 'Software Development', href: ROUTES.software, section: SECTION_IDS.software, icon: Code2 },
  { label: 'Digital Marketing', href: ROUTES.marketing, section: SECTION_IDS.marketing, icon: Megaphone },
];

const HOVER_CLOSE_DELAY = 160; // ms: lets the pointer travel from "Services" into the dropdown

export default function Navbar({
  email = 'info@atriowings.in',
  activeLink = 'Home',
  onLinkClick,
  customLogo,
  logoVariant = 'full', // 'full' uses the full uploaded logo; 'circular' uses the circular wing emblem
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const whyChooseHref = getWhyChooseHref(location.pathname);
  const homeHref = getHomeHref(location.pathname);

  const navLinks = [
    { label: 'Home', href: homeHref, auto: 'home' },
    { label: 'Services', href: '/#services', hasMenu: true, auto: true },
    { label: 'Why Choose Us', href: whyChooseHref, auto: 'why-choose' },
    { label: 'Contact', href: ROUTES.contact },
  ];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false); // desktop dropdown
  const [copied, setCopied] = useState(false);
  const [currentActive, setCurrentActive] = useState(activeLink);
  const navRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const servicesItemRef = useRef(null);
  const servicesTriggerRef = useRef(null);
  const servicesMenuRef = useRef(null);
  const closeTimerRef = useRef(null);
  const copiedTimerRef = useRef(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const closeServices = useCallback(() => {
    clearCloseTimer();
    setServicesOpen(false);
  }, []);

  // Close mobile menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
        setMobileServicesOpen(false);
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Handle keyboard navigation (Escape to close mobile menu)
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        setMobileServicesOpen(false);
        if (mobileToggleRef.current) {
          mobileToggleRef.current.focus();
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Desktop services dropdown: close on outside click / touch and on Escape
  useEffect(() => {
    if (!servicesOpen) return undefined;

    function handleOutside(event) {
      if (servicesItemRef.current && !servicesItemRef.current.contains(event.target)) {
        closeServices();
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        closeServices();
        servicesTriggerRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [servicesOpen, closeServices]);

  // Clear pending timers on unmount
  useEffect(
    () => () => {
      clearTimeout(closeTimerRef.current);
      clearTimeout(copiedTimerRef.current);
    },
    []
  );

  const handleNavClick = (link, event) => {
    setCurrentActive(link.label);
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    closeServices();
    if (link.auto === 'home' || link.label === 'Home') {
      handleHomeNavigation(event, { navigate });
    } else if (event) {
      navigateToSection(event, link.href, { navigate, auto: link.auto }); // same page: smooth scroll; other page: normal navigation
    }
    if (onLinkClick) {
      onLinkClick(link);
    }
  };

  // A service was chosen: Services becomes the active top-level link and the menus close.
  // On that service's own page this scrolls to its capabilities section; from anywhere else it
  // navigates to the service's URL (opening at the top).
  const handleServiceClick = (service, event) => {
    setCurrentActive('Services');
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    closeServices();

    if (event) navigateToSection(event, service.href, { section: service.section, navigate });

    if (onLinkClick) {
      onLinkClick({ label: 'Services', href: service.href, service: service.label });
    }
  };

  const handleCtaClick = () => {
    // If user clicks, open mail client
    // Can also copy email to clipboard with user feedback
    navigator.clipboard?.writeText(email).then(() => {
      setCopied(true);
      clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  // ----- desktop hover / click on "Services" -----
  const handleServicesPointerEnter = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return; // touch uses click only
    clearCloseTimer();
    setServicesOpen(true);
  };
  const handleServicesPointerLeave = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setServicesOpen(false), HOVER_CLOSE_DELAY);
  };
  const handleServicesTriggerClick = (e) => {
    e.preventDefault(); // do not jump to /#services; the click opens or closes the dropdown
    clearCloseTimer();
    setServicesOpen((open) => !open);
  };
  const handleServicesTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setServicesOpen(true);
      // focus the first item once the menu has rendered
      requestAnimationFrame(() => servicesMenuRef.current?.querySelector('a')?.focus());
    }
  };
  const handleServicesMenuKeyDown = (e) => {
    const items = Array.from(servicesMenuRef.current?.querySelectorAll('a') || []);
    const i = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (i <= 0) servicesTriggerRef.current?.focus();
      else items[i - 1]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      items[items.length - 1]?.focus();
    }
  };
  // close when keyboard focus leaves the Services area
  const handleServicesBlur = (e) => {
    if (servicesItemRef.current && !servicesItemRef.current.contains(e.relatedTarget)) {
      closeServices();
    }
  };

  return (
    <header className="navbar-wrapper" role="banner">
      <nav
        ref={navRef}
        className={`navbar-pill ${mobileMenuOpen ? 'menu-expanded' : ''}`}
        aria-label="Main Navigation"
      >
        {/* Left: Atriowings Brand Logo */}
        <a
          href={homeHref}
          onClick={(e) => {
            setCurrentActive('Home');
            setMobileMenuOpen(false);
            setMobileServicesOpen(false);
            closeServices();
            handleHomeNavigation(e, { navigate });
          }}
          className="navbar-brand-link"
          aria-label="Atriowings Technologies"
          title="Atriowings Technologies"
        >
          {customLogo || (
            logoVariant === 'circular' ? (
              <span className="navbar-logo-circle">
                <img
                  src={atriowingsIcon}
                  alt="Atriowings Emblem"
                  className="brand-logo-icon-img"
                />
              </span>
            ) : (
              <picture className="navbar-brand-picture">
                <source media="(max-width: 520px)" srcSet={atriowingsIcon} />
                <img
                  src={atriowingsLogo}
                  alt="Atriowings Technologies India Private Limited"
                  className="navbar-brand-logo-img"
                />
              </picture>
            )
          )}
        </a>

        {/* Middle: Centered Navigation Links */}
        <ul className="navbar-links" role="menubar">
          {navLinks.map((link) => {
            const isActive = currentActive === link.label || (link.label === 'Why Choose Us' && currentActive === 'Why to choose us');

            if (link.hasMenu) {
              return (
                <li
                  key={link.label}
                  role="none"
                  ref={servicesItemRef}
                  className={`nav-has-dropdown ${servicesOpen ? 'is-open' : ''}`}
                  onPointerEnter={handleServicesPointerEnter}
                  onPointerLeave={handleServicesPointerLeave}
                  onBlur={handleServicesBlur}
                >
                  <a
                    ref={servicesTriggerRef}
                    href={link.href}
                    role="menuitem"
                    aria-haspopup="true"
                    aria-expanded={servicesOpen}
                    aria-controls="services-dropdown"
                    className={`nav-link-item nav-services-trigger ${isActive ? 'active' : ''}`}
                    onClick={handleServicesTriggerClick}
                    onKeyDown={handleServicesTriggerKeyDown}
                  >
                    {link.label}
                    <ChevronDown className="nav-services-chevron" size={14} strokeWidth={2.6} aria-hidden="true" />
                  </a>

                  {servicesOpen && (
                    <div className="services-dropdown" id="services-dropdown">
                      <ul
                        ref={servicesMenuRef}
                        className="services-dropdown-list"
                        role="menu"
                        aria-label="Services"
                        onKeyDown={handleServicesMenuKeyDown}
                      >
                        {SERVICES.map((service) => {
                          const Icon = service.icon;
                          return (
                            <li key={service.href} role="none">
                              <a
                                href={service.href}
                                role="menuitem"
                                className="services-dropdown-item"
                                onClick={(e) => handleServiceClick(service, e)}
                              >
                                <span className="services-dropdown-icon" aria-hidden="true">
                                  <Icon size={16} strokeWidth={2.2} />
                                </span>
                                <span className="services-dropdown-label">{service.label}</span>
                                <ArrowRight className="services-dropdown-arrow" size={15} strokeWidth={2.4} aria-hidden="true" />
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={link.label} role="none">
                <a
                  href={link.href}
                  role="menuitem"
                  className={`nav-link-item ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(link, e)}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right: Email / Contact CTA Pill */}
        <div className="navbar-cta-group">
          <a
            href={`mailto:${email}`}
            className="navbar-cta-pill"
            onClick={handleCtaClick}
            aria-label={`Send email to ${email}`}
            title={`Email: ${email} (Click to open email or copy)`}
          >
            <span className="cta-text">{copied ? 'Copied to clipboard!' : email}</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            ref={mobileToggleRef}
            type="button"
            className={`navbar-mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileServicesOpen(false);
            }}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <span className="hamburger-line line-1" />
            <span className="hamburger-line line-2" />
            <span className="hamburger-line line-3" />
          </button>
        </div>

        {/* Mobile Dropdown Menu Container */}
        {mobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="mobile-dropdown-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            <ul className="mobile-links-list">
              {navLinks.map((link) => {
                const isActive = currentActive === link.label || (link.label === 'Why Choose Us' && currentActive === 'Why to choose us');

                if (link.hasMenu) {
                  return (
                    <li key={link.label} className={`mobile-has-submenu ${mobileServicesOpen ? 'is-open' : ''}`}>
                      <button
                        type="button"
                        className={`mobile-link-item mobile-services-btn ${isActive ? 'active' : ''}`}
                        aria-expanded={mobileServicesOpen}
                        aria-controls="mobile-services-submenu"
                        onClick={() => setMobileServicesOpen((open) => !open)}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="mobile-services-chevron" size={18} strokeWidth={2.4} aria-hidden="true" />
                      </button>

                      {mobileServicesOpen && (
                        <ul id="mobile-services-submenu" className="mobile-submenu-list">
                          {SERVICES.map((service) => {
                            const Icon = service.icon;
                            return (
                              <li key={service.href}>
                                <a
                                  href={service.href}
                                  className="mobile-submenu-item"
                                  onClick={(e) => handleServiceClick(service, e)}
                                >
                                  <span className="services-dropdown-icon" aria-hidden="true">
                                    <Icon size={16} strokeWidth={2.2} />
                                  </span>
                                  <span className="services-dropdown-label">{service.label}</span>
                                  <ArrowRight className="services-dropdown-arrow" size={15} strokeWidth={2.4} aria-hidden="true" />
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={`mobile-link-item ${isActive ? 'active' : ''}`}
                      onClick={(e) => handleNavClick(link, e)}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Mobile Contact CTA */}
            <div className="mobile-cta-wrapper">
              <a
                href={`mailto:${email}`}
                className="mobile-cta-pill"
                onClick={handleCtaClick}
              >
                {copied ? 'Copied to clipboard!' : email}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}