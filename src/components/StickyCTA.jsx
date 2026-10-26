import { ArrowRight } from 'lucide-react';
import { ROUTES } from '../utils/sectionNav';
import './StickyCTA.css';

/**
 * Full-width sticky CTA bar fixed to the bottom of the viewport.
 * Render it ONCE, in your top-level layout (see the import note in the reply).
 * It also renders an invisible, navy spacer so the bar never permanently
 * covers the last section or the footer.
 */
export default function StickyCTA({
  href = ROUTES.contact,
  title = 'Ready to Build Something Great?',
  text = "Let's turn your idea into a powerful digital solution.",
  buttonLabel = "Let's Discuss Your Project",
}) {
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

          <a href={href} className="sticky-cta-btn">
            <span>{buttonLabel}</span>
            <ArrowRight className="sticky-cta-arrow" size={18} strokeWidth={2.6} aria-hidden="true" />
          </a>
        </div>
      </aside>
    </>
  );
}