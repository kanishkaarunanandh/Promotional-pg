import {
  MapPin,
  Mail,
  Phone,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import atriowingsLogo from '../assets/logo2.png';
import { ROUTES, SECTION_IDS, navigateToSection, getWhyChooseHref, getHomeHref, handleHomeNavigation, handleWhyChooseNavigation } from '../utils/sectionNav';
import './Footer.css';

// Crisp, standard SVG icons for brand socials
const LinkedInIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);


const XTwitterIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.901 1.153h3.308l-7.227 8.26L23.5 22.5h-6.77l-5.3-8.002L4.5 22.5H1.19l7.73-8.835L.5 1.153h6.94l4.79 7.515 6.671-7.515Zm-1.16 19.31h1.833L6.327 3.06H4.36l13.38 17.403Z" />
  </svg>
);


// Centralized configuration for easy updates
const SOCIAL_LINKS = [
  { name: 'LinkedIn', icon: LinkedInIcon, href: '' },
  { name: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/atriowings.technologies/' },
  { name: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/atriowingstechnologies?rdid=FGaIaenouKXzIJO9&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EFt4L3q4p%2F#' },
  { name: 'YouTube', icon: XTwitterIcon, href: 'https://x.com/atriowings' },
];

// Each service opens its own page; on that page the link scrolls to its capabilities section.
const SERVICES_LINKS = [
  { label: 'Web Development', href: ROUTES.web, section: SECTION_IDS.web },
  { label: 'Software Development', href: ROUTES.software, section: SECTION_IDS.software },
  { label: 'Digital Marketing', href: ROUTES.marketing, section: SECTION_IDS.marketing },
  { label: 'Product Photography & Video Ads', href: ROUTES.photoshoot, section: SECTION_IDS.photoshoot },
];

const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=No%3A%2045%2C%20A%20Block%2C%203rd%20Avenue%2C%20Kumaran%20Nagar%2C%20Anna%20Nagar%20East%2C%20Chennai%2C%20Tamil%20Nadu%2C%20India';

const CONTACT_DETAILS = {
  address: 'No: 45, A Block, 3rd Avenue, Kumaran Nagar, Anna Nagar East, Chennai',
  mapsUrl: GOOGLE_MAPS_URL,
  email: 'info@atriowings.in',
  phone: '+91 8825948859',
  hours: 'Mon – Fri: 9:30 AM – 6:00 PM',
};

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  const whyChooseHref = getWhyChooseHref(location.pathname);
  const homeHref = getHomeHref(location.pathname);

  const quickLinks = [
    { label: 'Home', href: homeHref, auto: 'home' },
    { label: 'Why Choose Us', href: whyChooseHref, auto: 'why-choose' },
    { label: 'Contact Us', href: ROUTES.contact },
  ];

  return (
    <footer className="footer-wrapper" role="contentinfo" aria-label="Site Footer">
      <div className="footer-container">
        {/* Horizontal divider above footer content aligning with container edges */}
        <div className="footer-top-divider" aria-hidden="true" />

        {/* Main 4-Column Grid */}
        <div className="footer-grid">
          {/* Column 1 — Company Branding */}
          <div className="footer-col footer-col-brand">
            <a href={homeHref} onClick={(e) => handleHomeNavigation(e, { navigate })} className="footer-brand-link" aria-label="Atriowings Technologies Home">
              <img
                src={atriowingsLogo}
                alt="Atriowings Technologies Logo"
                className="footer-brand-logo"
                loading="lazy"
              />
            </a>

            <p className="footer-brand-desc">
              We deliver innovative digital solutions that help businesses grow, operate smarter, and build a stronger online presence.
            </p>

            {/* Social Media Links */}
            <div className="footer-social-group" aria-label="Follow Atriowings on Social Media">
              {SOCIAL_LINKS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    aria-label={`Follow on ${item.name}`}
                    title={item.name}
                  >
                    <IconComponent size={18} strokeWidth={2.2} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div className="footer-col">
            <h3 className="footer-heading">
              <span>Quick Links</span>
              <span className="footer-heading-underline" aria-hidden="true" />
            </h3>
            <ul className="footer-nav-list" role="list">
              {quickLinks.map((link) => {
                const isContact = link.label === 'Contact Us' || link.href === ROUTES.contact;
                return (
                  <li key={link.label} className="footer-nav-item">
                    <a
                      href={link.href}
                      className="footer-nav-link"
                      onClick={(e) => {
                        if (isContact) {
                          e.preventDefault();
                          window.open(ROUTES.contact, '_blank', 'noopener,noreferrer');
                        } else {
                          navigateToSection(e, link.href, { navigate, auto: link.auto });
                        }
                      }}
                      target={isContact ? '_blank' : undefined}
                      rel={isContact ? 'noopener noreferrer' : undefined}
                    >
                      <ChevronRight className="footer-nav-chevron" size={14} strokeWidth={2.5} aria-hidden="true" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3 — Our Services */}
          <div className="footer-col">
            <h3 className="footer-heading">
              <span>Our Services</span>
              <span className="footer-heading-underline" aria-hidden="true" />
            </h3>
            <ul className="footer-nav-list" role="list">
              {SERVICES_LINKS.map((service) => (
                <li key={service.label} className="footer-nav-item">
                  <a
                    href={service.href}
                    className="footer-nav-link"
                    onClick={(e) => navigateToSection(e, service.href, { section: service.section, navigate })}
                  >
                    <ChevronRight className="footer-nav-chevron" size={14} strokeWidth={2.5} aria-hidden="true" />
                    <span>{service.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Get in Touch */}
          <div className="footer-col footer-col-contact">
            <h3 className="footer-heading">
              <span>Get in Touch</span>
              <span className="footer-heading-underline" aria-hidden="true" />
            </h3>

            <ul className="footer-contact-list" role="list">
              <li className="footer-contact-item">
                <a
                  href={CONTACT_DETAILS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-address-link"
                  aria-label="View office location on Google Maps: No: 45, A Block, 3rd Avenue, Kumaran Nagar, Anna Nagar East, Chennai"
                  title="Open location in Google Maps"
                >
                  <span className="footer-contact-icon-box" aria-hidden="true">
                    <MapPin size={17} strokeWidth={2.2} />
                  </span>
                  <span className="footer-contact-text">{CONTACT_DETAILS.address}</span>
                </a>
              </li>

              <li className="footer-contact-item">
                <span className="footer-contact-icon-box" aria-hidden="true">
                  <Mail size={17} strokeWidth={2.2} />
                </span>
                <a href={`mailto:${CONTACT_DETAILS.email}`} className="footer-contact-link">
                  {CONTACT_DETAILS.email}
                </a>
              </li>

              {CONTACT_DETAILS.phone && (
                <li className="footer-contact-item">
                  <span className="footer-contact-icon-box" aria-hidden="true">
                    <Phone size={17} strokeWidth={2.2} />
                  </span>
                  <a href={`tel:${CONTACT_DETAILS.phone.replace(/[^0-9+]/g, '')}`} className="footer-contact-link">
                    {CONTACT_DETAILS.phone}
                  </a>
                </li>
              )}

              <li className="footer-contact-item">
                <span className="footer-contact-icon-box" aria-hidden="true">
                  <Clock size={17} strokeWidth={2.2} />
                </span>
                <span className="footer-contact-text">{CONTACT_DETAILS.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            &copy; {currentYear} Atriowings Technologies. All rights reserved.
          </p>

          <div className="footer-legal-links" aria-label="Legal Links">
            <a href="#privacy" className="footer-legal-link">Privacy Policy</a>
            <span className="footer-legal-separator" aria-hidden="true">&bull;</span>
            <a href="#terms" className="footer-legal-link">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}