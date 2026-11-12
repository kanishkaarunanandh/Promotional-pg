import { ArrowRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getWhatsAppUrl, openWhatsApp } from '../utils/whatsapp';
import './StickyCTA.css';

/**
 * Full-width sticky CTA bar fixed to the bottom of the viewport.
 * Render it ONCE, in your top-level layout (see the import note in the reply).
 * It also renders an invisible, navy spacer so the bar never permanently
 * covers the last section or the footer.
 */
export default function StickyCTA({
  service = null,
  href = null,
  title = 'Ready to Build Something Great?',
  text = "Let's turn your idea into a powerful digital solution.",
  buttonLabel = "Let's Discuss Your Project",
}) {
  const location = useLocation();
  const targetService = service || location.pathname;
  const targetHref = href || getWhatsAppUrl(targetService);

  return (
    <>
      {/* reserves the bar's height at the very end of the page */}
      <div className="sticky-cta-spacer" aria-hidden="true" />

      <aside className="sticky-cta" aria-label="Start a project with Atriowings">
        <div className="sticky-cta-inner">
          <div className="sticky-cta-copy">
            <p className="sticky-cta-title">{title}</p>
            <p className="sticky-cta-text">{text}</p>
          </div>

          <a
            href={targetHref}
            className="sticky-cta-btn"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => openWhatsApp(targetService, null, e)}
          >
            <span>{buttonLabel}</span>
            <ArrowRight className="sticky-cta-arrow" size={18} strokeWidth={2.6} aria-hidden="true" />
          </a>
        </div>
      </aside>
    </>
  );
}