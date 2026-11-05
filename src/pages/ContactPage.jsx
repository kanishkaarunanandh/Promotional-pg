import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import atriowingsLogo from '../assets/atriowings-logo.png';
import { ROUTES } from '../utils/sectionNav';
import Footer from '../components/Footer';
import EnquiryForm from '../components/EnquiryForm';
import { useEnquiryPopup } from '../context/EnquiryPopupContext';
import './contact-page.css';

const EASE = [0.22, 1, 0.36, 1];

export default function ContactPage() {
  const reduce = useReducedMotion();

  // Disabled on the dedicated contact page where the form is already prominently displayed
  useEnquiryPopup({ enabled: false });

  useEffect(() => {
    document.title = 'Contact Us | Atriowings Technologies';
  }, []);

  const rise = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  return (
    <>
      <main className="ctp-page" id="main-content">
        {/* Top Header Row: Logo on Top-Left, Contact Button on Top-Right */}
        <div className="ctp-top-bar flex items-center justify-between w-full">
          <a
            href={ROUTES.web}
            className="ctp-logo-link flex items-center"
            aria-label="AtrioWings Technologies"
            title="AtrioWings Technologies"
          >
            <img
              src={atriowingsLogo}
              alt="AtrioWings Technologies India Private Limited"
              className="ctp-logo-img h-9 sm:h-10 w-auto object-contain"
            />
          </a>

          <motion.a
            href="mailto:info@atriowings.in"
            className="ctp-contact-btn inline-flex items-center justify-center rounded-full font-semibold"
            aria-label="Email info@atriowings.in"
            title="Email info@atriowings.in"
            whileHover={reduce ? {} : { scale: 1.04, y: -2 }}
            whileTap={reduce ? {} : { scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE }}
          >
            <span>Contact Us</span>
          </motion.a>
        </div>
        <div className="ctp-glow ctp-glow--a" aria-hidden="true" />
        <div className="ctp-glow ctp-glow--b" aria-hidden="true" />

        <motion.section className="ctp-inner" variants={rise} initial="hidden" animate="visible" aria-labelledby="ctp-title">
          <p className="ctp-eyebrow"><span className="ctp-eyebrow-dot" aria-hidden="true" />LET'S CONNECT</p>
          <h1 id="ctp-title" className="ctp-title">Let's Talk About <span>Your Project</span></h1>
          <p className="ctp-lead">
            Share your contact details and our team will get back to you shortly to discuss your requirements.
          </p>

          <EnquiryForm idPrefix="ctp" className="ctp-card" />
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
