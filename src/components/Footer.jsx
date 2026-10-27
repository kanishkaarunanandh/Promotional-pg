import {
  MapPin,
  Mail,
  Phone,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import atriowingsLogo from '../assets/logo2.png';
import { ROUTES, SECTION_IDS, navigateToSection, getWhyChooseHref, getHomeHref, handleHomeNavigation } from '../utils/sectionNav';
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

const YouTubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

// Centralized configuration for easy updates
const SOCIAL_LINKS = [
  { name: 'LinkedIn', icon: LinkedInIcon, href: 'https://www.linkedin.com/company/atriowings' },
  { name: 'Instagram', icon: InstagramIcon, href: 'https://www.instagram.com/atriowings' },
  { name: 'Facebook', icon: FacebookIcon, href: 'https://www.facebook.com/atriowings' },
  { name: 'YouTube', icon: YouTubeIcon, href: 'https://www.youtube.com/@atriowings' },
];

// Each service opens its own page; on that page the link scrolls to its capabilities section.
const SERVICES_LINKS = [
  { label: 'Web Development', href: ROUTES.web, section: SECTION_IDS.web },
  { label: 'Software Development', href: ROUTES.software, section: SECTION_IDS.software },
  { label: 'Digital Marketing', href: ROUTES.marketing, section: SECTION_IDS.marketing },
  { label: 'Product Photography & Video Ads', href: ROUTES.photoshoot, section: SECTION_IDS.photoshoot },
];

const CONTACT_DETAILS = {
  address: 'No: 45, A Block, 3rd Avenue, Kumaran Nagar, Anna Nagar East, Chennai',
  email: 'info@atriowings.in',
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
              {quickLinks.map((link) => (
                <li key={link.label} className="footer-nav-item">
                  <a
                    href={link.href}
                    className="footer-nav-link"
                    onClick={(e) => navigateToSection(e, link.href, { navigate, auto: link.auto })}
                  >
                    <ChevronRight className="footer-nav-chevron" size={14} strokeWidth={2.5} aria-hidden="true" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
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
                <span className="footer-contact-icon-box" aria-hidden="true">
                  <MapPin size={17} strokeWidth={2.2} />
                </span>
                <span className="footer-contact-text">{CONTACT_DETAILS.address}</span>
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