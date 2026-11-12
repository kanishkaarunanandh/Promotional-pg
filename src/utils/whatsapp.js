/**
 * Reusable WhatsApp contact handler and message generator.
 * Provides context-aware click-to-chat WhatsApp URLs and handlers for all service pages.
 */

export const WHATSAPP_PHONE = '918825948859';

export const WHATSAPP_MESSAGES = {
  general: "Hi, I visited your website and I'm interested in your services. I would like to know more about your solutions.",
  web: "Hi, I'm interested in your Web Development services. I visited your website and would like to discuss my website requirements. Could you please share more details?",
  marketing: "Hi, I'm interested in your Digital Marketing services. I would like to know more about your digital marketing solutions, pricing and packages.",
  multimedia: "Hi, I'm interested in your Multimedia services. I would like to discuss my requirements and explore your creative solutions.",
  software: "Hi, I'm interested in your Software Development services. I visited your website and would like to discuss my software requirements. Could you please share more details?",
};

/**
 * Resolves the appropriate WhatsApp pre-filled message for a given service, route, or custom service name.
 * 
 * @param {string} [serviceOrPath] - Service key ('web', 'marketing', 'multimedia', 'software', 'general'),
 *                                   full service name ('Web Development', 'Digital Marketing', etc.),
 *                                   or route pathname ('/webdevelopment', '/digitalmarketing', etc.)
 * @returns {string} The resolved message string
 */
export function getWhatsAppMessage(serviceOrPath) {
  if (!serviceOrPath) return WHATSAPP_MESSAGES.general;

  const key = String(serviceOrPath).trim().toLowerCase();

  // General / fallback
  if (key === 'general' || key === 'navbar' || key === 'footer') {
    return WHATSAPP_MESSAGES.general;
  }

  // 1. Web Development
  if (key === 'web' || key.includes('web') || key === '/webdevelopment' || key === '/') {
    return WHATSAPP_MESSAGES.web;
  }

  // 2. Digital Marketing
  if (key === 'marketing' || key.includes('marketing') || key === '/digitalmarketing') {
    return WHATSAPP_MESSAGES.marketing;
  }

  // 3. Multimedia / Photoshoot
  if (
    key === 'multimedia' ||
    key.includes('multimedia') ||
    key.includes('photo') ||
    key.includes('shoot') ||
    key.includes('video') ||
    key === '/photoshoot' ||
    key === '/photography' ||
    key === '/product-photography'
  ) {
    return WHATSAPP_MESSAGES.multimedia;
  }

  // 4. Software Development
  if (key === 'software' || key.includes('software') || key === '/softwaredevelopment') {
    return WHATSAPP_MESSAGES.software;
  }

  // Dynamic template for any future service name passed (e.g. "Cloud Architecture", "Mobile App", etc.)
  return `Hi, I'm interested in your ${serviceOrPath} services. I visited your website and would like to discuss my requirements. Could you please share more details?`;
}

/**
 * Generates the full WhatsApp click-to-chat URL with the URL-encoded pre-filled message.
 * 
 * @param {string} [serviceOrPath] - Service key, service name, or route pathname
 * @param {string} [customMessage] - Optional custom message override
 * @returns {string} The complete https://wa.me/918825948859?text=... URL
 */
export function getWhatsAppUrl(serviceOrPath, customMessage = null) {
  const message = customMessage || getWhatsAppMessage(serviceOrPath);
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

/**
 * Reusable WhatsApp click handler. Opens WhatsApp directly in a new tab on desktop
 * and the WhatsApp application on mobile wherever supported.
 * 
 * @param {string} [serviceOrPath] - Service key, service name, or route pathname (auto-detects if omitted)
 * @param {string} [customMessage] - Optional custom message override
 * @param {Event} [event] - Optional DOM click event to prevent default link navigation
 * @returns {string} The opened WhatsApp URL
 */
export function openWhatsApp(serviceOrPath = null, customMessage = null, event = null) {
  if (event && typeof event.preventDefault === 'function') {
    event.preventDefault();
  }
  const target = serviceOrPath || (typeof window !== 'undefined' ? window.location.pathname : 'general');
  const url = getWhatsAppUrl(target, customMessage);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
  return url;
}

