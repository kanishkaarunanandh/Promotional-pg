import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { User, Phone, Mail, Send, Loader2, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { validateContact } from '../utils/contactValidation';
import './contact-page.css';

const EASE = [0.22, 1, 0.36, 1];
const EMAIL = 'info@atriowings.in';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL.replace(/\/+$/, '')}/api/contact`;

const FIELDS = [
  { id: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Smith', autoComplete: 'name' },
  { id: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+91 98765 43210', autoComplete: 'tel', inputMode: 'tel' },
  { id: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'you@company.com', autoComplete: 'email', inputMode: 'email' },
];

export default function ContactPage() {
  const reduce = useReducedMotion();
  const [values, setValues] = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // honeypot - real visitors never see or fill it
  const startedAt = useRef(null);
  const sending = useRef(false);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const check = (next) => validateContact(next).errors;

  const onChange = (e) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value };
    setValues(next);
    if (touched[name] || errors[name]) setErrors((prev) => ({ ...prev, [name]: check(next)[name] }));
    if (status === 'success') setStatus('idle');
  };

  const onBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: check(values)[name] }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending.current) return; // block duplicate submissions

    const { errors: found, values: clean } = validateContact(values);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true });
    if (Object.keys(found).length) {
      setStatus('idle');
      setMessage('');
      const first = FIELDS.find((f) => found[f.id]);
      if (first) document.getElementById(`ctp-${first.id}`)?.focus();
      return;
    }

    sending.current = true;
    setStatus('submitting');
    setMessage('');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...clean, website, elapsedMs: Date.now() - startedAt.current }),
        signal: controller.signal,
      });
      let data = {};
      try { data = await res.json(); } catch { /* non-JSON response */ }

      if (res.ok && data.ok) {
        setValues({ name: '', phone: '', email: '' });
        setErrors({});
        setTouched({});
        startedAt.current = Date.now();
        setStatus('success');
        setMessage('Thank you! Your enquiry has been sent. Our team will contact you soon.');
      } else {
        if (data.errors) setErrors(data.errors);
        setStatus('error');
        setMessage(data.message || 'Something went wrong while sending your enquiry. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(
        err.name === 'AbortError'
          ? 'The request took too long. Please check your connection and try again.'
          : 'We could not reach the server. Please check your connection and try again.'
      );
    } finally {
      clearTimeout(timer);
      sending.current = false;
    }
  };

  const submitting = status === 'submitting';
  const rise = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
  };

  return (
    <>
      <Navbar email={EMAIL} activeLink="Contact" />
      <main className="ctp-page" id="main-content">
        <div className="ctp-glow ctp-glow--a" aria-hidden="true" />
        <div className="ctp-glow ctp-glow--b" aria-hidden="true" />

        <motion.section className="ctp-inner" variants={rise} initial="hidden" animate="visible" aria-labelledby="ctp-title">
          <p className="ctp-eyebrow"><span className="ctp-eyebrow-dot" aria-hidden="true" />LET'S CONNECT</p>
          <h1 id="ctp-title" className="ctp-title">Let's Talk About <span>Your Project</span></h1>
          <p className="ctp-lead">
            Share your contact details and our team will get back to you shortly to discuss your requirements.
          </p>

          <form className="ctp-card" onSubmit={onSubmit} noValidate aria-busy={submitting}>
            {/* honeypot: hidden from people and assistive tech */}
            <div className="ctp-hp" aria-hidden="true">
              <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
            </div>

            {FIELDS.map(({ id, label, type, icon: Icon, placeholder, autoComplete, inputMode }) => {
              const err = errors[id];
              return (
                <div className={`ctp-field${err ? ' is-invalid' : ''}`} key={id}>
                  <label htmlFor={`ctp-${id}`} className="ctp-label">{label} <span aria-hidden="true">*</span></label>
                  <div className="ctp-control">
                    <Icon className="ctp-icon" size={18} aria-hidden="true" />
                    <input
                      id={`ctp-${id}`}
                      name={id}
                      type={type}
                      inputMode={inputMode}
                      autoComplete={autoComplete}
                      placeholder={placeholder}
                      value={values[id]}
                      onChange={onChange}
                      onBlur={onBlur}
                      required
                      maxLength={id === 'email' ? 254 : id === 'name' ? 100 : 30}
                      aria-required="true"
                      aria-invalid={err ? 'true' : 'false'}
                      aria-describedby={err ? `ctp-${id}-err` : undefined}
                      disabled={submitting}
                    />
                  </div>
                  {err && <p className="ctp-error" id={`ctp-${id}-err`} role="alert"><AlertCircle size={14} aria-hidden="true" />{err}</p>}
                </div>
              );
            })}

            <div aria-live="polite">
              {status === 'success' && <p className="ctp-banner ctp-banner--ok" role="status"><CheckCircle2 size={18} aria-hidden="true" />{message}</p>}
              {status === 'error' && <p className="ctp-banner ctp-banner--err" role="alert"><AlertCircle size={18} aria-hidden="true" />{message}</p>}
            </div>

            <button type="submit" className="ctp-submit" disabled={submitting}>
              {submitting ? (<><Loader2 className="ctp-spin" size={18} aria-hidden="true" /><span>Sending…</span></>) : (<><span>Submit Enquiry</span><Send size={18} aria-hidden="true" /></>)}
            </button>

            <p className="ctp-privacy"><ShieldCheck size={15} aria-hidden="true" />We only use your details to respond to your enquiry.</p>
          </form>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}