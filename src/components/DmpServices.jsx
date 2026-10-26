import { Fragment, useState, useMemo, useRef } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Share2,
  CalendarCheck,
  Search,
  Megaphone,
  Layers,
  FileText,
  Palette,
  Video,
  Users,
  Monitor,
  Mail,
  UserPlus,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  X,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { ROUTES } from '../utils/sectionNav';

// Visual assets for all 14 services
import socialImg from '../assets/Social Media Marketing.jpg';
import socialMgmtImg from '../assets/dm-services/social-management.jpg';
import seoImg from '../assets/seo.jpg';
import ppcImg from '../assets/Pay-Per-Click Advertising.jpg';
import metaImg from '../assets/dm-services/meta-ads.png';
import contentImg from '../assets/dm-services/content-marketing.jpg';
import designImg from '../assets/dm-services/creative-design.jpg';
import videoImg from '../assets/dm-services/video-marketing.jpg';
import influencerImg from '../assets/dm-services/influencer-marketing.jpg';
import landingImg from '../assets/dm-services/landing-page-marketing.jpg';
import emailImg from '../assets/dm-services/whatsapp-email.jpg';
import leadGenImg from '../assets/dm-services/lead-generation.jpg';
import reputationImg from '../assets/dm-services/online-reputation.jpg';
import analyticsImg from '../assets/dm-services/analytics-performance.jpg';

import './dmp-services.css';

const EASE = [0.22, 1, 0.36, 1];

export const DIGITAL_MARKETING_SERVICES = [
  {
    id: 'social-media-marketing',
    num: '01',
    category: 'Social & Influencer',
    title: 'Social Media Marketing',
    short: 'SMM',
    icon: Share2,
    img: socialImg,
    alt: 'Social Media Marketing campaigns across Facebook, Instagram, LinkedIn, and YouTube',
    fit: 'cover',
    desc: 'Targeted brand awareness, strategic audience growth, and multi-channel engagement on top social networks.',
    detail: 'Build an authoritative, loyal social following. We design tailored distribution strategies, interactive campaigns, and targeted media pushes that connect your brand with high-intent audiences on the platforms they check every day.',
    subServices: [
      { name: 'Facebook Marketing', desc: 'Custom audience segments, interactive community posts, and high-engagement content strategies.' },
      { name: 'Instagram Marketing', desc: 'Visual storytelling, viral reel formatting, story takeovers, and brand aesthetic curation.' },
      { name: 'LinkedIn Marketing', desc: 'B2B thought leadership, industry authority positioning, executive branding, and networking.' },
      { name: 'YouTube Marketing', desc: 'Channel growth, video SEO, subscriber acquisition funnels, and branded video sponsorships.' },
    ],
  },
  {
    id: 'social-media-management',
    num: '02',
    category: 'Social & Influencer',
    title: 'Social Media Management',
    short: 'Management',
    icon: CalendarCheck,
    img: socialMgmtImg,
    alt: 'Social media manager planning and scheduling content grid on laptop and smartphone',
    fit: 'cover',
    desc: 'End-to-end calendar planning, creative publishing, viral short-form reels, and proactive community moderation.',
    detail: 'Effortless, consistent social operations. We organize monthly content schedules, produce scroll-stopping daily creatives, script viral reels, and actively engage your audience in comments and direct messages.',
    subServices: [
      { name: 'Content Planning', desc: 'Data-driven monthly editorial calendars aligned with business launches and trending topics.' },
      { name: 'Post & Creative Management', desc: 'Timely multi-platform scheduling, hashtag curation, and visual brand consistency.' },
      { name: 'Reels & Short Videos', desc: 'Vertical video scripting, snappy editing, sound selection, and engagement-first pacing.' },
      { name: 'Community Management', desc: 'Fast response to customer DMs, comment moderation, brand voice interaction, and relationship building.' },
    ],
  },
  {
    id: 'seo',
    num: '03',
    category: 'SEO & Search',
    title: 'Search Engine Optimization (SEO)',
    short: 'SEO',
    icon: Search,
    img: seoImg,
    alt: 'Search engine optimization concept with organic search rankings and keywords',
    fit: 'cover',
    desc: 'Rank on page one of Google, attract qualified organic visitors, and build compounding long-term search dominance.',
    detail: 'Capture high-intent buyers at the exact moment they search for your solutions. We optimize your website code, develop high-value keyword targets, earn authoritative backlinks, and maximize your local visibility.',
    subServices: [
      { name: 'On-Page SEO', desc: 'Title tags, meta descriptions, semantic header structures, internal linking, and content relevance.' },
      { name: 'Off-Page SEO', desc: 'High-domain-authority backlink outreach, digital PR, brand mentions, and link profile cleanup.' },
      { name: 'Local SEO', desc: 'Google Business Profile ranking, local citation building, geo-targeted queries, and map pack optimization.' },
      { name: 'Keyword Research', desc: 'In-depth competitor keyword gap analysis, search intent mapping, and high-conversion search queries.' },
    ],
  },
  {
    id: 'google-ads-ppc',
    num: '04',
    category: 'Paid Advertising',
    title: 'Google Ads / PPC Advertising',
    short: 'Google Ads',
    icon: Megaphone,
    img: ppcImg,
    alt: 'Google Ads Pay Per Click advertising campaign dashboard with search and display metrics',
    fit: 'cover',
    desc: 'High-converting search, display, and video ad campaigns calibrated for maximum return on ad spend (ROAS).',
    detail: 'Put your offer directly in front of buyers with commercial purchase intent. We continuously test keyword variations, craft persuasive ad copy, optimize negative keyword lists, and structure remarketing funnels.',
    subServices: [
      { name: 'Search Ads', desc: 'High-intent search query targeting, bid strategy optimization, and click-through rate boosting.' },
      { name: 'Display Ads', desc: 'Visually striking contextual banner advertising across millions of high-traffic partner websites.' },
      { name: 'YouTube Ads', desc: 'In-stream skippable ads, bumper ads, and video action campaigns designed to drive conversions.' },
      { name: 'Remarketing Campaigns', desc: 'Targeting warm website visitors with compelling limited-time offers to win back dropped leads.' },
    ],
  },
  {
    id: 'meta-ads',
    num: '05',
    category: 'Paid Advertising',
    title: 'Meta Ads',
    short: 'Meta Ads',
    icon: Layers,
    img: metaImg,
    alt: 'Official Meta ads platform showing multi-channel campaigns across Facebook, Instagram, Messenger, and WhatsApp',
    fit: 'contain',
    desc: 'Hyper-targeted Facebook & Instagram ad funnels built for rapid customer acquisition and profitable lead conversion.',
    detail: 'Unlock scalable customer acquisition through Meta powerful algorithm. We construct multi-stage conversion funnels, test creative hooks, leverage lookalike audiences, and optimize cost-per-lead at scale.',
    subServices: [
      { name: 'Facebook Ads', desc: 'Newsfeed carousels, video ads, lead forms, and detailed demographic targeting for high conversion.' },
      { name: 'Instagram Ads', desc: 'Immersive vertical Story and Reel ads tailored for modern mobile buyers and visual appeal.' },
      { name: 'Lead Generation Campaigns', desc: 'Frictionless instant native forms that capture verified contact details directly inside Meta apps.' },
      { name: 'Conversion Campaigns', desc: 'Pixel and Conversions API (CAPI) optimized campaigns focused on direct checkout and sales.' },
    ],
  },
  {
    id: 'content-marketing',
    num: '06',
    category: 'Content & Creative',
    title: 'Content Marketing',
    short: 'Content',
    icon: FileText,
    img: contentImg,
    alt: 'Content marketing strategy team brainstorming brand campaigns, articles, and copy around whiteboard',
    fit: 'cover',
    desc: 'Authoritative blog articles, engaging social narratives, and high-converting marketing copywriting that educates and sells.',
    detail: 'Transform traffic into educated, eager buyers. We write authoritative, SEO-rich blog articles, create engaging social thought leadership, and craft conversion-driven website copy that builds lasting trust.',
    subServices: [
      { name: 'Blog Content', desc: 'Comprehensive, search-optimized articles that solve customer pain points and rank for core queries.' },
      { name: 'Social Media Content', desc: 'Punchy carousels, thought leadership threads, and engagement-driven micro-content.' },
      { name: 'Website Content', desc: 'Clear value propositions, product copy, and UX micro-copy that guide visitors toward action.' },
      { name: 'Marketing Copywriting', desc: 'Direct-response sales letters, email copy, ad scripts, and irresistible call-to-actions.' },
    ],
  },
  {
    id: 'creative-design',
    num: '07',
    category: 'Content & Creative',
    title: 'Creative Design',
    short: 'Design',
    icon: Palette,
    img: designImg,
    alt: 'Creative design studio with designers pinning typography posters, branding layouts, and color swatches on a wall',
    fit: 'cover',
    desc: 'High-impact social posters, conversion-focused ad creatives, digital banners, and shareable infographics.',
    detail: 'Capture eyes in crowded feeds with premium visual design. Our creative specialists produce bespoke branding graphics, high-converting ad layouts, display banners, and visual data infographics.',
    subServices: [
      { name: 'Social Media Posters', desc: 'Stunning brand-aligned post visuals designed to maximize likes, saves, and viral shares.' },
      { name: 'Ad Creatives', desc: 'High-contrast, benefit-oriented static and dynamic visuals tested to lower cost-per-click.' },
      { name: 'Banners', desc: 'Responsive web banners, promotional headers, and multi-format display network collateral.' },
      { name: 'Infographics', desc: 'Data-packed visual illustrations that distill complex concepts into easily digestable, shareable assets.' },
    ],
  },
  {
    id: 'video-marketing',
    num: '08',
    category: 'Content & Creative',
    title: 'Video Marketing',
    short: 'Video',
    icon: Video,
    img: videoImg,
    alt: 'Professional video production shoot with camera crew, studio lighting, and executive interview',
    fit: 'cover',
    desc: 'Engaging promotional videos, viral reels, crisp motion graphics, and high-impact product video demonstrations.',
    detail: 'Video is the #1 consumer format online. We handle everything from concept scripting and pacing to professional editing, motion graphics animations, and platform-specific vertical short-form formatting.',
    subServices: [
      { name: 'Promotional Videos', desc: 'Cinematic brand story videos and campaign commercials that establish immediate credibility.' },
      { name: 'Reels & Shorts', desc: 'Fast-paced, hook-driven vertical videos optimized for TikTok, Instagram Reels, and YouTube Shorts.' },
      { name: 'Motion Graphics', desc: 'Animated typography, 2D/3D brand accents, and dynamic visual explainers that boost retention.' },
      { name: 'Product Videos', desc: 'Crystal-clear product walkthroughs, feature demonstrations, and customer unboxing formats.' },
    ],
  },
  {
    id: 'influencer-marketing',
    num: '09',
    category: 'Social & Influencer',
    title: 'Influencer Marketing',
    short: 'Influencers',
    icon: Users,
    img: influencerImg,
    alt: 'Influencer marketing studio production with creators staging product shoot and mobile recording',
    fit: 'cover',
    desc: 'Vetted creator partnerships, strategic campaign roadmaps, and full-cycle collaboration management with verified ROI.',
    detail: 'Borrow the trust of credible creators. We scout the ideal micro and macro influencers for your niche, negotiate competitive agreements, oversee creative alignment, and track coupon/traffic attribution.',
    subServices: [
      { name: 'Influencer Selection', desc: 'In-depth audience authenticity auditing, engagement rate validation, and niche alignment.' },
      { name: 'Campaign Planning', desc: 'Creative campaign angles, deliverable roadmaps, giveaway coordination, and content guidelines.' },
      { name: 'Collaboration Management', desc: 'End-to-end outreach, contract negotiation, product gifting, and approval management.' },
      { name: 'Campaign Tracking', desc: 'UTM link monitoring, custom coupon code attribution, and return-on-investment reporting.' },
    ],
  },
  {
    id: 'website-landing-page-marketing',
    num: '10',
    category: 'SEO & Search',
    title: 'Website & Landing Page Marketing',
    short: 'Landing Pages',
    icon: Monitor,
    img: landingImg,
    alt: 'Web design and engineering team designing and coding high-converting landing pages on desktop and tablet',
    fit: 'cover',
    desc: 'Frictionless, conversion-optimized landing pages engineered for lightning load speeds and high form-fill rates.',
    detail: 'Never waste ad traffic on underperforming pages. We architect lightning-fast, mobile-first landing pages featuring psychological proof, benefit hierarchies, and streamlined lead capture mechanisms.',
    subServices: [
      { name: 'Landing Page Creation', desc: 'Custom, brand-matched landing pages engineered specifically for targeted campaign traffic.' },
      { name: 'Conversion Optimization', desc: 'A/B split testing headlines, CTA buttons, layout arrangements, and trust badges.' },
      { name: 'Website Performance', desc: 'Core Web Vitals enhancement, image compression, and mobile responsiveness audits.' },
      { name: 'Lead Capture Setup', desc: 'Smart form integration, automated CRM webhooks, validation rules, and instant lead alerts.' },
    ],
  },
  {
    id: 'whatsapp-email-marketing',
    num: '11',
    category: 'CRM & Analytics',
    title: 'WhatsApp & Email Marketing',
    short: 'WhatsApp & Email',
    icon: Mail,
    img: emailImg,
    alt: 'Marketing team presenting automated WhatsApp drip workflows, message funnels, and email campaigns',
    fit: 'cover',
    desc: 'Direct-to-inbox automated drip sequences, WhatsApp broadcast campaigns, and timely customer retention follow-ups.',
    detail: 'Turn one-time visitors into repeat purchasers. We build intelligent automated email nurture series, broadcast WhatsApp marketing campaigns with 98% open rates, and recover abandoned leads with timed follow-ups.',
    subServices: [
      { name: 'WhatsApp Campaigns', desc: 'Official WhatsApp Business API integration, broadcast messages, and interactive button messages.' },
      { name: 'Promotional Messages', desc: 'Flash sales, festive announcements, exclusive product drops, and discount promotions.' },
      { name: 'Email Campaigns', desc: 'Segmented newsletter broadcasts, drip welcome series, and promotional email blasts.' },
      { name: 'Customer Follow-ups', desc: 'Automated post-purchase check-ins, re-engagement triggers, and customer feedback workflows.' },
    ],
  },
  {
    id: 'lead-generation',
    num: '12',
    category: 'Paid Advertising',
    title: 'Lead Generation',
    short: 'Lead Gen',
    icon: UserPlus,
    img: leadGenImg,
    alt: 'Sales and marketing acquisition team collaborating on lead generation funnel, prospect data, and revenue reports',
    fit: 'cover',
    desc: 'High-intent multi-channel acquisition funnels designed to consistently fill your sales pipeline with verified leads.',
    detail: 'Predictable business growth through reliable lead volume. We engineer full-funnel lead acquisition engines combining paid traffic, interactive lead magnets, qualifying questions, and real-time CRM routing.',
    subServices: [
      { name: 'Lead Generation Campaigns', desc: 'Tailored multi-channel paid ad campaigns focused on delivering sales-ready prospect data.' },
      { name: 'Landing Page Leads', desc: 'Dedicated high-converting squeeze pages with psychological triggers and concise forms.' },
      { name: 'Social Media Leads', desc: 'Native lead forms on Meta and LinkedIn that capture pre-filled contact details seamlessly.' },
      { name: 'Lead Management', desc: 'Lead verification, spam filtering, automatic CRM lead scoring, and instant sales routing.' },
    ],
  },
  {
    id: 'online-reputation-management',
    num: '13',
    category: 'CRM & Analytics',
    title: 'Online Reputation Management',
    short: 'Reputation',
    icon: ShieldCheck,
    img: reputationImg,
    alt: 'Corporate executives and reputation management team discussing brand credibility, public relations, and client reviews',
    fit: 'cover',
    desc: 'Proactive Google review generation, brand sentiment monitoring, and positive customer engagement management.',
    detail: 'Your reputation is your most valuable asset. We help you generate genuine 5-star reviews on Google and Trustpilot, monitor brand mentions across the web, and respond professionally to protect consumer confidence.',
    subServices: [
      { name: 'Google Reviews', desc: 'Automated SMS and email review collection workflows that prompt satisfied clients to leave 5 stars.' },
      { name: 'Brand Reputation', desc: 'Continuous brand sentiment monitoring across forums, social media, and industry review portals.' },
      { name: 'Customer Engagement', desc: 'Thoughtful, on-brand responses to both positive feedback and constructive customer criticism.' },
      { name: 'Review Management', desc: 'Flagging illegitimate negative reviews, managing dispute protocols, and highlighting top testimonials.' },
    ],
  },
  {
    id: 'analytics-performance-marketing',
    num: '14',
    category: 'CRM & Analytics',
    title: 'Analytics & Performance Marketing',
    short: 'Analytics',
    icon: BarChart3,
    img: analyticsImg,
    alt: 'Corporate analytics and performance marketing team reviewing live campaign dashboards and KPI metrics',
    fit: 'cover',
    desc: 'End-to-end event tracking, Google Analytics 4 setup, Meta Insights, and transparent monthly ROI reporting.',
    detail: 'Every dollar invested should be accounted for. We configure robust server-side analytics, custom conversion event tracking, attribution modeling, and deliver clear monthly performance dashboards with actionable insights.',
    subServices: [
      { name: 'Campaign Tracking', desc: 'UTM taxonomy structuring, Google Tag Manager event tracking, and server-side conversion API.' },
      { name: 'Google Analytics', desc: 'GA4 configuration, custom funnel visualization, user journey tracking, and conversion goals.' },
      { name: 'Meta Insights', desc: 'In-depth demographic, frequency, placement, and creative fatigue diagnostics on Meta platforms.' },
      { name: 'Monthly Performance Reports', desc: 'Executive-level PDF & live dashboards showing cost-per-lead, revenue generated, and ROAS.' },
    ],
  },
];

const CATEGORIES = [
  'All Services',
  'Social & Influencer',
  'Paid Advertising',
  'SEO & Search',
  'Content & Creative',
  'CRM & Analytics',
];

const HEAD = ['Comprehensive Digital Marketing', 'Services That Drive Growth'];

export default function DmpServices() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { amount: 0.15, once: true });

  const [activeCategory, setActiveCategory] = useState('All Services');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  // Filter services by category and search keyword
  const filteredServices = useMemo(() => {
    return DIGITAL_MARKETING_SERVICES.filter((service) => {
      const matchCat =
        activeCategory === 'All Services' || service.category === activeCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const inTitle = service.title.toLowerCase().includes(q);
      const inDesc = service.desc.toLowerCase().includes(q);
      const inSub = service.subServices.some(
        (sub) =>
          sub.name.toLowerCase().includes(q) || sub.desc.toLowerCase().includes(q)
      );
      return inTitle || inDesc || inSub;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section
      id="dmp-services"
      className="dmp-section dmps"
      aria-labelledby="dmp-services-title"
      ref={sectionRef}
    >
      {/* Ambient background glowing orbs */}
      <div className="dmps-bg" aria-hidden="true">
        <motion.span
          className="dmps-orb"
          animate={
            reduce
              ? undefined
              : { x: ['-8%', '10%', '-8%'], y: ['0%', '12%', '0%'] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 22, repeat: Infinity, ease: 'easeInOut' }
          }
        />
        <span className="dmps-blob dmps-blob--a" />
        <span className="dmps-blob dmps-blob--b" />
        <span className="dmps-dots" />
      </div>

      <div className="dmp-container dmps-inner">
        {/* ==================== SECTION HEADER ==================== */}
        <div className="dmps-head">
          <motion.p
            className="dmps-kicker"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <span className="dmps-kicker-line" aria-hidden="true" />
            DIGITAL MARKETING SERVICES
          </motion.p>

          <motion.h2
            id="dmp-services-title"
            className="dmps-title"
            initial={reduce ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
          >
            {HEAD.map((line, li) => (
              <Fragment key={line}>
                <span className="dmps-line">
                  <motion.span
                    className={`dmps-line-in${li === 1 ? ' dmps-grad' : ''}`}
                    variants={{ hidden: { y: '110%' }, visible: { y: 0 } }}
                    transition={{
                      duration: 0.75,
                      ease: EASE,
                      delay: 0.1 * li,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              </Fragment>
            ))}
          </motion.h2>

          <motion.p
            className="dmps-sub"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          >
            14 full-spectrum digital marketing services engineered to elevate your brand visibility, capture high-intent leads, and turn web traffic into profitable revenue.
          </motion.p>

          {/* Quick value props / highlights */}
          <div className="dmps-badges">
            <span className="dmps-badge-item">
              <Sparkles size={15} className="dmps-badge-ico" /> 14 Specialized Capabilities
            </span>
            <span className="dmps-badge-item">
              <SlidersHorizontal size={15} className="dmps-badge-ico" /> End-to-End Execution
            </span>
            <span className="dmps-badge-item">
              <CheckCircle2 size={15} className="dmps-badge-ico" /> Data-Driven ROI
            </span>
          </div>
        </div>

        {/* ==================== FILTERS & SEARCH ==================== */}
        <div className="dmps-controls">
          <div className="dmps-tabs" role="tablist" aria-label="Service categories">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              const count =
                cat === 'All Services'
                  ? DIGITAL_MARKETING_SERVICES.length
                  : DIGITAL_MARKETING_SERVICES.filter((s) => s.category === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`dmps-tab${active ? ' is-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className="dmps-tab-count">{count}</span>
                  {active && (
                    <motion.span
                      layoutId="dmpsActiveTab"
                      className="dmps-tab-indicator"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="dmps-search-wrap">
            <Search size={16} className="dmps-search-icon" aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. Meta Ads, SEO, Reels, Leads)..."
              className="dmps-search-input"
              aria-label="Filter digital marketing services"
            />
            {searchQuery && (
              <button
                type="button"
                className="dmps-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ==================== SERVICES GRID ==================== */}
        <motion.div
          className="dmps-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          transition={{ staggerChildren: reduce ? 0 : 0.06 }}
        >
          {filteredServices.map((sv, idx) => {
            const Icon = sv.icon;
            const isOpen = selectedService?.id === sv.id;

            return (
              <motion.article
                key={sv.id}
                className={`dmps-item${isOpen ? ' is-open' : ''}`}
                variants={{
                  hidden: { opacity: 0, y: reduce ? 0 : 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: EASE },
                  },
                }}
              >
                <div className="dmps-card-shell">
                  <span className="dmps-top-accent" aria-hidden="true" />

                  {/* Card Media Header */}
                  <div className={`dmps-media dmps-media--${sv.fit}`}>
                    <div className="dmps-pic">
                      <img
                        src={sv.img}
                        alt={sv.alt}
                        loading="lazy"
                        decoding="async"
                        draggable="false"
                      />
                    </div>
                    <span className="dmps-num" aria-label={`Service number ${sv.num}`}>
                      {sv.num}
                    </span>
                    <span className="dmps-cat-tag">{sv.category}</span>
                    <span className="dmps-ico" aria-hidden="true">
                      <Icon size={22} strokeWidth={2.2} />
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="dmps-body">
                    <h3 className="dmps-name">{sv.title}</h3>
                    <p className="dmps-desc">{sv.desc}</p>

                    {/* 4 Sub-services checklist */}
                    <div className="dmps-sublist-block">
                      <span className="dmps-sublist-label">Key Capabilities:</span>
                      <ul className="dmps-sublist" aria-label={`${sv.title} sub-services`}>
                        {sv.subServices.map((sub) => (
                          <li key={sub.name} className="dmps-sub-item">
                            <span className="dmps-sub-check" aria-hidden="true" />
                            <span className="dmps-sub-text">{sub.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Card Actions */}
                    <div className="dmps-actions">
                      <button
                        type="button"
                        className="dmps-more-btn"
                        aria-expanded={isOpen}
                        onClick={() => setSelectedService(isOpen ? null : sv)}
                      >
                        <span>{isOpen ? 'Close Scope' : 'Explore Scope'}</span>
                        <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
                      </button>

                      <a
                        href={`${ROUTES.contact}?service=${encodeURIComponent(sv.title)}`}
                        className="dmps-cta-link"
                        title={`Discuss ${sv.title} with our experts`}
                      >
                        <span>Inquire</span>
                        <ArrowUpRight size={15} strokeWidth={2.4} aria-hidden="true" />
                      </a>
                    </div>
                  </div>

                  {/* In-Card Deep Dive Drawer */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        className="dmps-drawer"
                        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduce ? 0 : 15 }}
                        transition={{ duration: reduce ? 0.1 : 0.32, ease: EASE }}
                      >
                        <button
                          type="button"
                          className="dmps-drawer-close"
                          onClick={() => setSelectedService(null)}
                          aria-label="Close detailed scope"
                        >
                          <X size={17} strokeWidth={2.6} />
                        </button>

                        <div className="dmps-drawer-header">
                          <span className="dmps-drawer-pill">
                            <Icon size={14} strokeWidth={2.2} />
                            {sv.num} &bull; {sv.short}
                          </span>
                          <h4 className="dmps-drawer-title">{sv.title}</h4>
                        </div>

                        <p className="dmps-drawer-detail">{sv.detail}</p>

                        <div className="dmps-drawer-breakdown">
                          <span className="dmps-drawer-label">Detailed Deliverables:</span>
                          <ul className="dmps-drawer-items">
                            {sv.subServices.map((sub) => (
                              <li key={sub.name} className="dmps-drawer-item">
                                <div className="dmps-drawer-item-title">
                                  <span className="dmps-drawer-check" aria-hidden="true" />
                                  <strong>{sub.name}</strong>
                                </div>
                                <p className="dmps-drawer-item-desc">{sub.desc}</p>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="dmps-drawer-footer">
                          <a
                            href={`${ROUTES.contact}?service=${encodeURIComponent(sv.title)}`}
                            className="dmps-drawer-action"
                          >
                            <span>Discuss {sv.title}</span>
                            <ArrowUpRight size={16} strokeWidth={2.5} />
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Empty search state */}
        {filteredServices.length === 0 && (
          <div className="dmps-empty">
            <p className="dmps-empty-title">No matching services found</p>
            <p className="dmps-empty-desc">
              We couldn&rsquo;t find any service matching &ldquo;{searchQuery}&rdquo;. Try another keyword or browse all categories.
            </p>
            <button
              type="button"
              className="dmps-empty-reset"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All Services');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}