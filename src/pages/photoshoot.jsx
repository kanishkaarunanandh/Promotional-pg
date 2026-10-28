import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useInView, AnimatePresence } from 'framer-motion';
import {
  Check,
  ArrowRight,
  Sparkles,
  Camera,
  Video,
  Layers,
  ShieldCheck,
  Clock,
  Palette,
  Eye,
  Zap,
  ChevronDown,
  Award,
  PackageCheck,
  RotateCw,
  Sliders,
  CheckCircle2,
  X,
  ExternalLink,
  Film,
  Maximize2,
  Package,
  User,
  Monitor,
  Rocket,
  MessageSquare,
  Calendar,
  Image as ImageIcon,
  Star,
  TrendingUp,
  Scale
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StickyCTA from '../components/StickyCTA';
import { ROUTES } from '../utils/sectionNav';
import './photoshoot.css';

// Visual Assets
import modelImg from '../assets/model.jpg';
import productImg from '../assets/product.jpg';
import footwareImg from '../assets/footware.jpg';
import jewelleryImg from '../assets/jewellery.jpg';
import foodDrinkImg from '../assets/food_drink.jpg';
import electronicsImg from '../assets/electronics.jpg';
import homeDecorImg from '../assets/home_decor.jpg';

// Redesigned Asymmetrical Services Section Assets
import serviceProductImg from '../assets/service_product_photography.jpg';
import serviceModelImg from '../assets/service_model_fashion.jpg';
import serviceEcommerceImg from '../assets/service_ecommerce_listings.jpg';
import serviceCampaignImg from '../assets/service_campaigns_reels.jpg';

// Selected Work / Portfolio Assets matching reference specification
import portfolioPerfumeImg from '../assets/portfolio_perfume.jpg';
import portfolioModelImg from '../assets/portfolio_model.jpg';
import portfolioHeadphonesImg from '../assets/portfolio_headphones.jpg';
import portfolioBtsImg from '../assets/portfolio_bts.jpg';
import portfolioJuiceImg from '../assets/portfolio_juice.jpg';
import portfolioSmartwatchImg from '../assets/portfolio_smartwatch.jpg';

// Redesigned 4-Step Production Workflow Assets matching reference specification
import workflowBriefImg from '../assets/workflow_brief_notepad.png';
import workflowStudioImg from '../assets/workflow_studio_softbox.png';
import workflowCameraImg from '../assets/workflow_camera_monitor.png';
import workflowLaptopImg from '../assets/workflow_laptop_gallery.png';
import workflowPerfumeSetupImg from '../assets/workflow_perfume_setup.png';

// AtrioWings Studio Advantage Assets Matching Reference Specification
import advantageStudioSetupImg from '../assets/advantage_studio_setup.png';
import advantageProductionImg from '../assets/advantage_production.png';
import advantageTurnaroundImg from '../assets/advantage_turnaround.png';
import advantageComplianceImg from '../assets/advantage_compliance.png';
import advantageCamerasImg from '../assets/advantage_cameras.png';
import advantageTetheredImg from '../assets/advantage_tethered.png';
import advantageCommercialImg from '../assets/advantage_commercial.png';

const EASE = [0.22, 1, 0.36, 1];
const CONTACT_HREF = ROUTES.contact;

// Selected Work Category Filters
const WORK_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'product', label: 'Product' },
  { id: 'model', label: 'Model' },
  { id: 'ecommerce', label: 'E-commerce' },
];

// Six Showcase Projects with Authentic Editorial & Studio Photography
const SELECTED_WORK_PROJECTS = [
  {
    id: 'perfume',
    title: 'Lumière Fragrance',
    category: 'product',
    categoryLabel: 'Luxury Product',
    tag: 'Product',
    img: portfolioPerfumeImg,
    isVideo: false,
    client: 'Lumière Parfums Paris',
    summary: 'Commercial studio editorial on natural travertine stone with daylight simulation.',
    baseRotation: -3,
    floatDuration: 5.4,
    floatDelay: 0,
    floatY: 9,
    cardClass: 'ps-pf-card--perfume',
  },
  {
    id: 'fashion',
    title: 'Fall Collection',
    category: 'model',
    categoryLabel: 'Fashion Lookbook',
    tag: 'Model',
    img: portfolioModelImg,
    isVideo: true,
    client: 'Aura Threads Couture',
    summary: 'High-fashion editorial lookbook featuring contemporary beige coat and fedora hat outdoor portrait.',
    baseRotation: -1.5,
    floatDuration: 6.2,
    floatDelay: 0.8,
    floatY: 11,
    cardClass: 'ps-pf-card--fashion',
  },
  {
    id: 'headphones',
    title: 'Aural Acoustics',
    category: 'ecommerce',
    categoryLabel: 'E-commerce Product',
    tag: 'E-commerce',
    img: portfolioHeadphonesImg,
    isVideo: false,
    client: 'Aural Audio Tech',
    summary: 'E-commerce product shoot of premium wireless headphones on cobalt blue geometric podiums.',
    baseRotation: 1.5,
    floatDuration: 4.8,
    floatDelay: 1.4,
    floatY: 8,
    cardClass: 'ps-pf-card--headphones',
  },
  {
    id: 'bts',
    title: 'Behind the Scenes',
    category: 'product',
    categoryLabel: 'Studio Shoot',
    tag: 'Video',
    img: portfolioBtsImg,
    isVideo: true,
    client: 'Studio Commercial Set',
    summary: 'Behind-the-scenes cinematography production featuring cinema camera rig, tungsten lights, and studio crew.',
    baseRotation: -1,
    floatDuration: 5.8,
    floatDelay: 0.4,
    floatY: 10,
    cardClass: 'ps-pf-card--bts',
  },
  {
    id: 'juice',
    title: 'Fresh & Healthy',
    category: 'product',
    categoryLabel: 'Food Photography',
    tag: 'Product',
    img: portfolioJuiceImg,
    isVideo: true,
    client: 'PureCitrus Juices',
    summary: 'Artisanal beverage product photography with fresh mint and condensation on rustic wood tabletop.',
    baseRotation: 2.2,
    floatDuration: 5.2,
    floatDelay: 1.8,
    floatY: 9,
    cardClass: 'ps-pf-card--juice',
  },
  {
    id: 'smartwatch',
    title: 'Apex Chrono Smartwatch',
    category: 'ecommerce',
    categoryLabel: 'Product Photography',
    tag: 'Product',
    img: portfolioSmartwatchImg,
    isVideo: false,
    client: 'Apex Wearables',
    summary: 'Minimalist consumer electronics product shoot of sleek smartwatch on clean architectural pedestal.',
    baseRotation: 3,
    floatDuration: 6.6,
    floatDelay: 1.0,
    floatY: 7,
    cardClass: 'ps-pf-card--smartwatch',
  },
];

// 6 Core Categories for the Marquee
const CATEGORIES = [
  { id: 'fashion', label: 'FASHION', desc: 'Lookbooks, apparel styling & in-house model campaigns' },
  { id: 'jewellery', label: 'JEWELLERY', desc: 'Precision macro sparkle, diamonds & luxury watches' },
  { id: 'beauty', label: 'COSMETICS', desc: 'Skincare textures, cosmetic dropper bottles & splash lighting' },
  { id: 'food-drink', label: 'FOOD & DRINK', desc: 'Artisan cocktails, gourmet packaging & beverage splashes' },
  { id: 'electronics', label: 'ELECTRONICS', desc: 'Hardware industrial specs, matte finishes & cyan neon cues' },
  { id: 'home-decor', label: 'HOME DÉCOR', desc: 'Sculptural ceramics, ambient scented candles & marble sets' },
];

// Photography & Video Studio Capabilities
const STUDIO_CAPABILITIES = [
  {
    icon: Camera,
    title: 'E-Commerce Product Photography',
    badge: '100% Amazon / Flipkart Compliant',
    desc: 'Pure RGB 255 white-background images, clean drop shadows, crisp details, and ghost mannequin angles that pass marketplace algorithms on the first attempt.',
    features: ['Zero Rejected Uploads', 'RGB 255 White & Transparent PNG', '360° Multi-Angle Sets'],
  },
  {
    icon: Palette,
    title: 'In-House Model & Fashion Shoots',
    badge: 'Models, Stylists & Hair/Makeup Included',
    desc: 'Complete editorial lookbook and campaign production. We provide vetted male and female fashion models, wardrobe stylists, and professional beauty makeup artists.',
    features: ['Male & Female Model Roster', 'Apparel Steaming & On-Set Styling', 'High-Fashion & Commercial Looks'],
  },
  {
    icon: Video,
    title: 'Commercial Video Ads & 4K Reels',
    badge: 'Engineered For High ROAS',
    desc: 'High-converting 15s and 30s video commercials tailored for Instagram Reels, Meta Ads, TikTok, and YouTube. Includes dynamic motion, voiceover, and hooks.',
    features: ['Dynamic 9:16 & 16:9 Cuts', 'Motion Graphics & Text Callouts', 'Sound Design & Royalty-Free Audio'],
  },
  {
    icon: Sparkles,
    title: 'Creative Lifestyle & Tabletop Sets',
    badge: 'Bespoke Props & Custom Sets',
    desc: 'Tell an emotional brand story with curated aesthetic backgrounds, natural light simulations, customized textures (marble, wood, concrete), and premium props.',
    features: ['100+ Studio Backdrops', 'Live Botanical & Liquid Sets', 'Brand-Matched Color Grading'],
  },
  {
    icon: RotateCw,
    title: '360° Interactive Product Spin',
    badge: 'Boosts Conversion by 40%',
    desc: 'Smooth, 24 to 72-frame interactive rotating product views and stop-motion animations. Lets shoppers inspect materials and details from every single perspective.',
    features: ['Interactive HTML5 / GIF / MP4', 'Mobile Touch-Optimized', 'Smooth Frame Interpolation'],
  },
  {
    icon: Layers,
    title: 'High-End Retouching & Post-Production',
    badge: 'Pixel-Level Master Retouching',
    desc: 'Advanced post-production by senior digital artists: frequency separation skin retouching, dust and scratch cleanup, color accuracy matching, and composite lighting.',
    features: ['Color Calibration (sRGB / Adobe RGB)', 'Dust & Blemish Elimination', 'Clipping Path & Clipping Mask'],
  },
];

// The AtrioWings Studio Advantage - 6 Connected Cards with Supporting Photography
const WHY_CHOOSE_STUDIO = [
  {
    id: 1,
    icon: Package,
    title: 'All-Inclusive Studio Production',
    text: 'You ship the products—we handle everything else. Casting vetted models, sourcing props, booking makeup artists, camera crew, and final retouching.',
    photo: advantageProductionImg,
    photoAlt: 'Professional photography crew on studio set with softboxes and models',
    floatDuration: 4.8,
    floatDist: 5,
    floatDelay: 0.1,
  },
  {
    id: 2,
    icon: Zap,
    title: 'Lightning 3–5 Day Turnaround',
    text: 'Stop waiting weeks for campaign assets. We deliver initial digital contact sheets within 48 hours and final master-retouched files within 3 to 5 business days.',
    photo: advantageTurnaroundImg,
    photoAlt: 'Laptop display showing curated product photography ready for delivery',
    floatDuration: 5.4,
    floatDist: 6,
    floatDelay: 0.7,
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: '100% Platform Compliance Guarantee',
    text: 'Every file strictly matches Amazon A+, Flipkart, Myntra, Shopify, and Google Shopping technical guidelines.',
    photo: advantageComplianceImg,
    photoAlt: 'E-commerce packaging box verified for marketplace standards',
    floatDuration: 4.5,
    floatDist: 5,
    floatDelay: 1.3,
  },
  {
    id: 4,
    icon: Video,
    title: 'Cinema Grade Cameras & Broncolor Strobes',
    text: 'Shoot on 60MP+ full-frame and medium-format camera bodies paired with cinema lenses and color-calibrated Broncolor / Profoto strobes.',
    photo: advantageCamerasImg,
    photoAlt: 'Cinema grade camera body with professional high-resolution optical lens',
    floatDuration: 5.2,
    floatDist: 6,
    floatDelay: 0.4,
  },
  {
    id: 5,
    icon: Monitor,
    title: 'Live Remote Tethered Monitor Access',
    text: 'Join our studio session remotely! Review high-resolution shots on our live tethered feed in real time from your laptop, giving instant feedback and approvals.',
    photo: advantageTetheredImg,
    photoAlt: 'Color-calibrated studio monitor streaming live tethered photoshoot feed',
    floatDuration: 4.9,
    floatDist: 5,
    floatDelay: 1.0,
  },
  {
    id: 6,
    icon: Scale,
    title: 'Full Commercial Usage Rights',
    text: 'No confusing usage tiers or surprise royalty renewals. You receive 100% unrestricted global commercial rights across e-commerce, print, outdoor billboard, and paid ads.',
    photo: advantageCommercialImg,
    photoAlt: 'Business partners shaking hands confirming unrestricted commercial licensing rights',
    floatDuration: 5.6,
    floatDist: 6,
    floatDelay: 0.6,
  },
];

// 4 Studio Advantage Performance Metrics
const ADVANTAGE_METRICS = [
  {
    icon: Camera,
    end: 50000,
    suffix: '+',
    decimals: 0,
    label: 'Products Shot & Retouched',
  },
  {
    icon: Star,
    end: 250,
    suffix: '+',
    decimals: 0,
    label: 'Active E-commerce Brands',
  },
  {
    icon: TrendingUp,
    end: 99.8,
    suffix: '%',
    decimals: 1,
    label: 'First-Time Platform Approval',
  },
  {
    icon: Zap,
    isStaticText: true,
    textVal: '3–5 Days',
    label: 'Average Delivery',
  },
];

// 4-Step Production Workflow Matching Reference Design Specification
const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Share your brief',
    desc: 'Tell us your products, platform and the look you want. We reply with a shot list and quote.',
    badgeIcon: Zap,
    badgeText: 'Quick & Easy',
    icon: MessageSquare,
    thumb: workflowBriefImg,
    thumbAlt: 'Handwritten creative brief notepad with pen',
    tilt: -1.2,
    yOffset: 14,
    floatDuration: 4.4,
    floatDistance: 9,
    rotDelta: 0.7,
    floatDelay: 0,
    thumbTilt: -3.5,
    thumbDuration: 3.6,
    thumbDelay: 0.3,
  },
  {
    step: '02',
    title: 'Plan & cast',
    desc: 'We pick models, props, sets and lighting moods, and confirm everything with you before the shoot.',
    badgeIcon: Calendar,
    badgeText: 'Perfect Planning',
    icon: Camera,
    thumb: workflowStudioImg,
    thumbAlt: 'Studio softbox lighting setup with product stand',
    tilt: 0.8,
    yOffset: -8,
    floatDuration: 5.2,
    floatDistance: 11,
    rotDelta: -0.8,
    floatDelay: 0.7,
    thumbTilt: 2.5,
    thumbDuration: 4.2,
    thumbDelay: 0.9,
  },
  {
    step: '03',
    title: 'Shoot day',
    desc: 'Ship your products to the studio, or join us on set and approve shots live as we go.',
    badgeIcon: Clock,
    badgeText: 'Live Updates',
    icon: Video,
    thumb: workflowCameraImg,
    thumbAlt: 'Cinema camera on tripod monitor showing product live',
    tilt: -0.6,
    yOffset: 10,
    floatDuration: 4.6,
    floatDistance: 8,
    rotDelta: 0.6,
    floatDelay: 1.4,
    thumbTilt: -2.5,
    thumbDuration: 3.9,
    thumbDelay: 0.5,
  },
  {
    step: '04',
    title: 'Edit & deliver',
    desc: 'Colour-corrected, retouched images in every size you need, through a private download gallery.',
    badgeIcon: CheckCircle2,
    badgeText: 'On Time Delivery',
    icon: ImageIcon,
    thumb: workflowLaptopImg,
    thumbAlt: 'Laptop displaying online photo gallery portal',
    tilt: 1.0,
    yOffset: -10,
    floatDuration: 5.5,
    floatDistance: 10,
    rotDelta: -0.9,
    floatDelay: 0.4,
    thumbTilt: 3.0,
    thumbDuration: 4.5,
    thumbDelay: 1.1,
  },
];

// FAQ Items
const FAQ_ITEMS = [
  {
    q: 'How do I send my products to your photography studio?',
    a: 'You can securely courier or drop off your products directly at our studio at No: 45, A Block, 3rd Avenue, Kumaran Nagar, Anna Nagar East, Chennai. Our intake team logs each SKU, inspects for transit damage, and prepares them under dust-free conditions. Once the shoot is complete, we carefully repack and return your samples or hold them for upcoming seasonal launches.',
  },
  {
    q: 'Are professional models and makeup artists provided by Atriowings?',
    a: 'Yes, absolutely! We maintain an in-house roster of professional commercial and fashion models (both male and female across diverse age groups and styles). Our shoot packages include professional on-set hair and makeup artists, garment steamers, and wardrobe stylists to ensure your clothing and accessories look flawless on camera.',
  },
  {
    q: 'What is your turnaround time for photography and commercial video ads?',
    a: 'Our standard turnaround is 3 to 5 business days after shoot completion. For urgent product launches, we also offer an expedited 48-hour delivery option. Initial unretouched preview proofs are uploaded to a private client gallery within 24–48 hours for immediate shot selection.',
  },
  {
    q: 'Do you create commercial video ads optimized for Instagram Reels and Meta Ads?',
    a: 'Yes! Our video production team shoots 4K vertical (9:16) video reels, 16:9 website hero banners, and 1:1 feed ads. We include captivating opening hooks, text overlays, dynamic speed ramps, sound effects, and licensed background music engineered specifically to maximize click-through rate and conversions on paid ad campaigns.',
  },
  {
    q: 'Will the product photos pass Amazon, Flipkart, and Shopify standards?',
    a: '100% guaranteed. We produce pure RGB 255 white-background hero shots, standard 1:1 and 4:5 ratios, minimum 2000x2000px high-resolution images for zoom compliance, and Amazon A+ content modules. If any marketplace ever flags a formatting requirement, our team resolves it within 24 hours at no cost.',
  },
  {
    q: 'Do I own full commercial rights to the photos and video ads?',
    a: 'Yes. Upon final delivery and project completion, you receive unrestricted, perpetual worldwide commercial rights. You can freely use your images and video assets across your website, Amazon, Flipkart, social media ads, print brochures, packaging, and billboard advertising without paying recurring royalty fees.',
  },
];

// Smooth Animated Counting Component for Viewport Entry
function AnimatedCounter({ end, duration = 2.2, suffix = '', decimals = 0, isVisible }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (isVisible && !started.current) {
      started.current = true;
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        const easeVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setCount(easeVal * end);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isVisible, end, duration]);

  const formatted = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return <span>{started.current ? formatted : '0'}{suffix}</span>;
}

export default function PhotoshootPage() {
  const reduce = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedWorkFilter, setSelectedWorkFilter] = useState('all');
  const [activePaginationIndex, setActivePaginationIndex] = useState(1);
  const marqueeRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.25 });

  useEffect(() => {
    document.title = 'Product Photography & Video Ads Studio | Atriowings';
    window.scrollTo(0, 0);
  }, []);

  const visibleProjects = SELECTED_WORK_PROJECTS.filter((p) => {
    if (selectedWorkFilter === 'all') return true;
    if (selectedWorkFilter === 'product') {
      return p.category === 'product' || p.tag === 'Product';
    }
    if (selectedWorkFilter === 'model') {
      return p.category === 'model' || p.tag === 'Model';
    }
    if (selectedWorkFilter === 'ecommerce') {
      return p.category === 'ecommerce' || p.tag === 'E-commerce' || p.id === 'perfume';
    }
    return true;
  });

  const handleNextFilter = () => {
    const currentIndex = WORK_FILTERS.findIndex((f) => f.id === selectedWorkFilter);
    const nextIndex = (currentIndex + 1) % WORK_FILTERS.length;
    setSelectedWorkFilter(WORK_FILTERS[nextIndex].id);
    setActivePaginationIndex(nextIndex);
  };

  const handlePrevFilter = () => {
    const currentIndex = WORK_FILTERS.findIndex((f) => f.id === selectedWorkFilter);
    const prevIndex = (currentIndex - 1 + WORK_FILTERS.length) % WORK_FILTERS.length;
    setSelectedWorkFilter(WORK_FILTERS[prevIndex].id);
    setActivePaginationIndex(prevIndex);
  };

  // When clicking category in Marquee: scroll smoothly to services section
  const handleMarqueeCategoryClick = (e, catId) => {
    e.preventDefault();
    setActiveCategory(catId);
    const target = document.getElementById('photoshoot-services');
    if (target) {
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="ps-page">
      {/* Universal Atriowings Navbar */}
      <Navbar activeLink="Services" email="info@atriowings.in" />

      <main className="ps-main">
        {/* =========================================================================
            1. HERO SECTION (1:1 match with user's reference image)
            ========================================================================= */}
        <section className="ps-hero" aria-labelledby="ps-hero-title">
          <div className="ps-hero-container">
            <div className="ps-hero-grid">
              {/* Left Column: Typography, Copy, CTA & Trust Points */}
              <motion.div
                className="ps-hero-left"
                initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduce ? 0.2 : 0.8, ease: EASE }}
              >
                {/* Eyebrow with cyan dash */}
                <div className="ps-hero-eyebrow">
                  <span className="ps-hero-eyebrow-dash" aria-hidden="true" />
                  <span>PRODUCT &amp; MODEL PHOTOGRAPHY STUDIO</span>
                </div>

                {/* Main Heading with line breaks and cyan accent */}
                <h1 className="ps-hero-title" id="ps-hero-title">
                  PRODUCTS<br />
                  THAT SELL.<br />
                  FACES THAT<br />
                  <span className="ps-hero-title-cyan">STAY.</span>
                </h1>

                {/* Subtitle */}
                <p className="ps-hero-desc">
                  Catalogue, e-commerce and campaign shoots for brands &mdash; with in-house models,
                  stylists and retouching, delivered ready for your website, marketplace listings and ads.
                </p>

                {/* CTA Action Buttons */}
                <div className="ps-hero-actions">
                  <a href={CONTACT_HREF} className="ps-btn ps-btn--primary">
                    <span>Book a shoot</span>
                    <ArrowRight size={18} strokeWidth={2.4} aria-hidden="true" />
                  </a>
                  <a
                    href="#photoshoot-services"
                    className="ps-btn ps-btn--secondary"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('photoshoot-services')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
                    }}
                  >
                    <span>Explore Services</span>
                  </a>
                </div>

                {/* Three Trust Checkmarks */}
                <div className="ps-hero-trust-list">
                  <div className="ps-hero-trust-item">
                    <Check className="ps-trust-check-icon" size={17} strokeWidth={3} aria-hidden="true" />
                    <span>Models &amp; styling included</span>
                  </div>
                  <div className="ps-hero-trust-item">
                    <Check className="ps-trust-check-icon" size={17} strokeWidth={3} aria-hidden="true" />
                    <span>Marketplace-ready files</span>
                  </div>
                  <div className="ps-hero-trust-item">
                    <Check className="ps-trust-check-icon" size={17} strokeWidth={3} aria-hidden="true" />
                    <span>Retouching in 3–5 days</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Visual 3-Card Showcase (Exact Composition from Image) */}
              <motion.div
                className="ps-hero-visual"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduce ? 0.2 : 0.9, delay: 0.1, ease: EASE }}
              >
                <div className="ps-visual-grid">
                  {/* Card 1: Left tall dark navy card with model photo and top cyan ring */}
                  <div className="ps-card ps-card--tall ps-card--navy">
                    <div className="ps-card-ring" aria-hidden="true" />
                    <div className="ps-card-inner">
                      <div className="ps-card-arch">
                        <img
                          src={modelImg}
                          alt="Fashion lookbook model photoshoot"
                          className="ps-card-img ps-card-img--model"
                          loading="eager"
                        />
                      </div>
                    </div>
                    <div className="ps-card-badge-wrap">
                      <span className="ps-card-badge">MODEL - FASHION LOOKBOOK</span>
                    </div>
                  </div>

                  {/* Card 2: Top Right soft ice-blue card with cosmetic beauty product */}
                  <div className="ps-card ps-card--beauty">
                    <div className="ps-card-inner">
                      <img
                        src={productImg}
                        alt="Cosmetic beauty dropper bottle on rustic wood"
                        className="ps-card-img ps-card-img--product"
                        loading="eager"
                      />
                    </div>
                    <div className="ps-card-badge-wrap">
                      <span className="ps-card-badge">PRODUCT - BEAUTY</span>
                    </div>
                  </div>

                  {/* Card 3: Bottom Right vibrant electric cyan card with flying footwear */}
                  <div className="ps-card ps-card--footwear">
                    <div className="ps-card-inner">
                      <img
                        src={footwareImg}
                        alt="High-speed dynamic footwear sneakers explosion"
                        className="ps-card-img ps-card-img--footwear"
                        loading="eager"
                      />
                    </div>
                    <div className="ps-card-badge-wrap">
                      <span className="ps-card-badge">E-COMMERCE - FOOTWEAR</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. THE SECOND HORIZONTAL CATEGORY NAVIGATION BAR (UPGRADED MARQUEE)
            ========================================================================= */}
        <section
          className="ps-category-bar"
          ref={marqueeRef}
          role="region"
          aria-label="Product photography and video categories marquee"
        >
          {/* Ambient low-intensity navy glow background */}
          <div className="ps-bar-ambient-glow" aria-hidden="true" />

          {/* Refined top accent line with moving light beam */}
          <div className="ps-bar-accent-line" aria-hidden="true">
            <div className="ps-bar-light-beam" />
          </div>

          {/* Edge gradient masks for seamless fade in and out */}
          <div className="ps-bar-edge-fade ps-bar-edge-fade--left" aria-hidden="true" />
          <div className="ps-bar-edge-fade ps-bar-edge-fade--right" aria-hidden="true" />

          {/* Continuous Infinite Marquee Track */}
          <div className="ps-marquee-viewport">
            <div className="ps-marquee-track">
              {/* Primary list (keyboard accessible, indexed by screen readers) */}
              <ul className="ps-marquee-group" aria-label="Product categories sequence">
                {CATEGORIES.map((item) => (
                  <li key={`orig-${item.id}`} className="ps-marquee-item">
                    <a
                      href={`#portfolio`}
                      className={`ps-category-link ${activeCategory === item.id ? 'ps-category-link--active' : ''}`}
                      onClick={(e) => handleMarqueeCategoryClick(e, item.id)}
                    >
                      <span className="ps-category-text">{item.label}</span>
                    </a>
                    {/* Soft cyan pulsing diamond separator */}
                    <span className="ps-category-sep" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>

              {/* Sequence 1 duplicate (aria-hidden and unfocusable for screen reader clarity) */}
              <ul className="ps-marquee-group ps-marquee-group--clone" aria-hidden="true">
                {CATEGORIES.map((item, idx) => (
                  <li key={`clone1-${idx}`} className="ps-marquee-item">
                    <span
                      className={`ps-category-link ps-category-link--clone ${activeCategory === item.id ? 'ps-category-link--active' : ''}`}
                      onClick={(e) => handleMarqueeCategoryClick(e, item.id)}
                    >
                      <span className="ps-category-text">{item.label}</span>
                    </span>
                    <span className="ps-category-sep" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>

              {/* Sequence 2 duplicate for seamless ultra-wide and 4K displays */}
              <ul className="ps-marquee-group ps-marquee-group--clone" aria-hidden="true">
                {CATEGORIES.map((item, idx) => (
                  <li key={`clone2-${idx}`} className="ps-marquee-item">
                    <span
                      className={`ps-category-link ps-category-link--clone ${activeCategory === item.id ? 'ps-category-link--active' : ''}`}
                      onClick={(e) => handleMarqueeCategoryClick(e, item.id)}
                    >
                      <span className="ps-category-text">{item.label}</span>
                    </span>
                    <span className="ps-category-sep" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>

              {/* Sequence 3 duplicate for 100% gapless continuous marquee */}
              <ul className="ps-marquee-group ps-marquee-group--clone" aria-hidden="true">
                {CATEGORIES.map((item, idx) => (
                  <li key={`clone3-${idx}`} className="ps-marquee-item">
                    <span
                      className={`ps-category-link ps-category-link--clone ${activeCategory === item.id ? 'ps-category-link--active' : ''}`}
                      onClick={(e) => handleMarqueeCategoryClick(e, item.id)}
                    >
                      <span className="ps-category-text">{item.label}</span>
                    </span>
                    <span className="ps-category-sep" aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
                      </svg>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. "ONE STUDIO. EVERY SHOT YOUR BRAND NEEDS." - REDESIGNED SERVICES SECTION (#photoshoot-services)
            ========================================================================= */}
        <section className="ps-services-hub" id="photoshoot-services" aria-labelledby="ps-services-hub-title">
          <div className="ps-container">
            {/* Header: Left Heading with Orbit Ring, Right Description */}
            <motion.div
              className="ps-services-header-row"
              initial={{ opacity: 0, y: reduce ? 0 : 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduce ? 0.2 : 0.7, ease: EASE }}
            >
              <div className="ps-services-title-col">
                <div className="ps-services-eyebrow">
                  <span className="ps-services-eyebrow-dash" aria-hidden="true" />
                  <span>OUR SERVICES</span>
                </div>
                <div className="ps-services-heading-wrap">
                  <h2 className="ps-services-main-heading" id="ps-services-hub-title">
                    ONE STUDIO.<br />
                    EVERY SHOT YOUR<br />
                    <span className="ps-services-heading-cyan">BRAND NEEDS.</span>
                  </h2>
                  {/* Decorative subtle blue orbit ring with cyan glowing dot */}
                  <div className="ps-services-orbit-ring" aria-hidden="true">
                    <span className="ps-services-orbit-dot" />
                  </div>
                </div>
              </div>

              <div className="ps-services-desc-col">
                <p className="ps-services-intro-text">
                  From product photography to lifestyle shoots, we create stunning visuals that help your brand stand out &mdash; across every platform, every time.
                </p>
                <span className="ps-services-desc-line" aria-hidden="true" />
              </div>
            </motion.div>

            {/* Asymmetrical 4-Card Services Grid */}
            <motion.div
              className="ps-services-asym-grid"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Card A — Product Photography (Left Tall Feature Card) */}
              <motion.div
                className="ps-asym-card ps-asym-card--product"
                initial={{ opacity: 0, y: reduce ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: reduce ? 0.2 : 0.65, delay: reduce ? 0 : 0.05, ease: EASE }}
              >
                {/* Continuous Traveling Border Light Beam */}
                <div className="ps-asym-card-border-beam" aria-hidden="true" />

                <div className="ps-card-bg-wrap">
                  <img
                    src={serviceProductImg}
                    alt="Lumière skincare serum bottle on travertine stone with monstera leaf"
                    className="ps-asym-img ps-asym-img--product"
                    loading="lazy"
                  />
                  <div className="ps-asym-gradient-overlay" />
                </div>

                <div className="ps-asym-content">
                  <div className="ps-asym-split-text-top">
                    <div className="ps-asym-icon-bubble">
                      <Package size={22} className="ps-bubble-icon" />
                    </div>
                    <h3 className="ps-asym-title">Product photography</h3>
                    <p className="ps-asym-desc">
                      Hero shots, detail close-ups and 360&deg; spins with controlled studio lighting.
                    </p>
                  </div>
                  <div className="ps-asym-split-text-bottom">
                    <div className="ps-asym-price-row">
                      <span className="ps-asym-price">From ₹1,999/ product</span>
                    </div>
                    <div className="ps-asym-action-row">
                      <a href={CONTACT_HREF} className="ps-asym-arrow-btn" aria-label="Book Product Photography">
                        <ArrowRight size={17} strokeWidth={2.4} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="ps-asym-badge-wrap ps-asym-badge-wrap--bottom-left">
                  <span className="ps-asym-badge">
                    <RotateCw size={13} strokeWidth={2.4} />
                    <span>360&deg; PRODUCT VIEW</span>
                  </span>
                </div>
              </motion.div>

              {/* Card B — Model & Fashion (Upper Middle Card) */}
              <motion.div
                className="ps-asym-card ps-asym-card--model"
                initial={{ opacity: 0, y: reduce ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: reduce ? 0.2 : 0.65, delay: reduce ? 0 : 0.12, ease: EASE }}
              >
                {/* Continuous Traveling Border Light Beam */}
                <div className="ps-asym-card-border-beam" aria-hidden="true" />

                <div className="ps-asym-split">
                  <div className="ps-asym-split-text">
                    <div className="ps-asym-split-text-top">
                      <div className="ps-asym-icon-bubble">
                        <User size={20} className="ps-bubble-icon" />
                      </div>
                      <h3 className="ps-asym-title">Model &amp; fashion</h3>
                      <p className="ps-asym-desc">
                        On-model apparel, jewellery and lookbooks with casting, hair, make-up and styling.
                      </p>
                    </div>
                    <div className="ps-asym-split-text-bottom">
                      <div className="ps-asym-price-row">
                        <span className="ps-asym-price">From ₹2,999/ look</span>
                      </div>
                      <div className="ps-asym-action-row">
                        <a href={CONTACT_HREF} className="ps-asym-arrow-btn" aria-label="Book Model & Fashion Shoot">
                          <ArrowRight size={17} strokeWidth={2.4} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="ps-asym-split-media">
                    <img
                      src={serviceModelImg}
                      alt="Editorial fashion photoshoot featuring model in contemporary beige blazer"
                      className="ps-asym-img ps-asym-img--model"
                      loading="lazy"
                    />
                    <div className="ps-asym-badge-wrap ps-asym-badge-wrap--bottom-right">
                      <span className="ps-asym-badge">
                        <Sparkles size={13} strokeWidth={2.4} />
                        <span>RETOUCHING INCLUDED</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card C — E-commerce Listings (Upper Right Card) */}
              <motion.div
                className="ps-asym-card ps-asym-card--ecommerce"
                initial={{ opacity: 0, y: reduce ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: reduce ? 0.2 : 0.65, delay: reduce ? 0 : 0.18, ease: EASE }}
              >
                {/* Continuous Traveling Border Light Beam */}
                <div className="ps-asym-card-border-beam" aria-hidden="true" />

                <div className="ps-asym-split">
                  <div className="ps-asym-split-text">
                    <div className="ps-asym-split-text-top">
                      <div className="ps-asym-icon-bubble">
                        <Monitor size={20} className="ps-bubble-icon" />
                      </div>
                      <h3 className="ps-asym-title">E-commerce listings</h3>
                      <p className="ps-asym-desc">
                        Clean white-background images ideal for Amazon, Flipkart, Myntra, Meesho and your own store.
                      </p>
                    </div>
                    <div className="ps-asym-split-text-bottom">
                      <div className="ps-asym-price-row">
                        <span className="ps-asym-price">From ₹1,499/ image</span>
                      </div>
                      <div className="ps-asym-action-row">
                        <a href={CONTACT_HREF} className="ps-asym-arrow-btn" aria-label="Book E-commerce Listings Shoot">
                          <ArrowRight size={17} strokeWidth={2.4} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="ps-asym-split-media">
                    <img
                      src={serviceEcommerceImg}
                      alt="Luxury liquid lipstick with applicator wand dripping gloss on warm peach background"
                      className="ps-asym-img ps-asym-img--ecommerce"
                      loading="lazy"
                    />
                    <div className="ps-asym-badge-wrap ps-asym-badge-wrap--top-right">
                      <span className="ps-asym-badge">
                        <Zap size={13} strokeWidth={2.4} />
                        <span>FAST TURNAROUND</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card D — Campaigns & Reels (Bottom Wide Card spanning 2 columns) */}
              <motion.div
                className="ps-asym-card ps-asym-card--campaigns"
                initial={{ opacity: 0, y: reduce ? 0 : 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: reduce ? 0.2 : 0.65, delay: reduce ? 0 : 0.24, ease: EASE }}
              >
                {/* Continuous Traveling Border Light Beam */}
                <div className="ps-asym-card-border-beam" aria-hidden="true" />

                <div className="ps-asym-split ps-asym-split--wide">
                  <div className="ps-asym-split-text ps-asym-split-text--wide">
                    <div className="ps-asym-split-text-top">
                      <div className="ps-asym-icon-bubble">
                        <Video size={20} className="ps-bubble-icon" />
                      </div>
                      <h3 className="ps-asym-title">Campaigns &amp; reels</h3>
                      <p className="ps-asym-desc">
                        Lifestyle scenes, product videos for launches and ads.
                      </p>
                    </div>
                    <div className="ps-asym-split-text-bottom">
                      <div className="ps-asym-price-row">
                        <span className="ps-asym-price">Custom quote</span>
                      </div>
                      <div className="ps-asym-action-row">
                        <a href={CONTACT_HREF} className="ps-asym-arrow-btn" aria-label="Inquire about Campaigns & Reels">
                          <ArrowRight size={17} strokeWidth={2.4} />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="ps-asym-split-media ps-asym-split-media--wide">
                    <img
                      src={serviceCampaignImg}
                      alt="On-set video production crew filming commercial cooking campaign in modern kitchen studio"
                      className="ps-asym-img ps-asym-img--campaigns"
                      loading="lazy"
                    />
                    <div className="ps-asym-split-gradient" />
                    <div className="ps-asym-badge-wrap ps-asym-badge-wrap--bottom-right">
                      <span className="ps-asym-badge">
                        <Rocket size={13} strokeWidth={2.4} />
                        <span>CAMPAIGN READY</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Quote Call-To-Action Area Below Grid */}
            <motion.div
              className="ps-services-cta-row"
              initial={{ opacity: 0, y: reduce ? 0 : 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.15, ease: EASE }}
            >
              <div className="ps-services-cta-flair ps-services-cta-flair--left" aria-hidden="true" />
              
              <div className="ps-services-cta-center">
                <a href={CONTACT_HREF} className="ps-services-cta-button">
                  <span>Get a free quote</span>
                  <ArrowRight size={18} strokeWidth={2.4} className="ps-cta-arrow" aria-hidden="true" />
                </a>

                <div className="ps-services-cta-divider" aria-hidden="true" />

                <div className="ps-services-cta-promise">
                  <div className="ps-services-cta-clock-wrap">
                    <Clock size={20} className="ps-services-cta-clock" />
                  </div>
                  <span className="ps-services-cta-time-text">
                    Reply with a shot list and price within 24 hours
                  </span>
                </div>
              </div>

              <div className="ps-services-cta-flair ps-services-cta-flair--right" aria-hidden="true" />
            </motion.div>
          </div>
        </section>

        {/* =========================================================================
            3. SELECTED WORK / OUR PORTFOLIO SECTION (#portfolio)
            ========================================================================= */}
        <section className="ps-selected-work" id="portfolio" aria-labelledby="ps-selected-work-title">
          {/* Subtle Ambient Radial Lighting Glow */}
          <div className="ps-pf-ambient-glow" aria-hidden="true" />

          <div className="ps-pf-container">
            {/* Top Bar: Left Heading + Description, Right Filter Pills */}
            <div className="ps-pf-header-row">
              <motion.div
                className="ps-pf-header-left"
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: reduce ? 0.2 : 0.6, ease: EASE }}
              >
                <div className="ps-pf-eyebrow">
                  <span className="ps-pf-eyebrow-line" aria-hidden="true" />
                  <span>OUR PORTFOLIO</span>
                  <span className="ps-pf-eyebrow-line" aria-hidden="true" />
                </div>
                <h2 className="ps-pf-main-heading" id="ps-selected-work-title">
                  SELECTED WORK<br />
                  <span className="ps-pf-heading-cyan">THAT SPEAKS</span><br />
                  FOR ITSELF.
                </h2>
                <p className="ps-pf-desc">
                  From product shots to creative campaigns, explore our best work across photography, video and design.
                </p>
              </motion.div>

              <motion.div
                className="ps-pf-header-right"
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.1, ease: EASE }}
              >
                <div className="ps-pf-filter-group" role="tablist" aria-label="Portfolio categories">
                  {WORK_FILTERS.map((filter) => {
                    const isActive = selectedWorkFilter === filter.id;
                    return (
                      <button
                        key={filter.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`ps-pf-filter-btn ${isActive ? 'ps-pf-filter-btn--active' : ''}`}
                        onClick={() => setSelectedWorkFilter(filter.id)}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Asymmetrical Floating Stage with Cards and Decorative Accents */}
            <div className="ps-pf-stage-wrap">
              {/* Vertical Pagination Dots (Left Margin) */}
              <div className="ps-pf-pagination-dots" aria-hidden="true">
                {[0, 1, 2, 3].map((dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    className={`ps-pf-dot ${activePaginationIndex === dotIdx ? 'ps-pf-dot--active' : ''}`}
                    onClick={() => {
                      setActivePaginationIndex(dotIdx);
                      setSelectedWorkFilter(WORK_FILTERS[dotIdx]?.id || 'all');
                    }}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              {/* Curved Orbit Line SVG with Continuous Travelling Cyan Dot */}
              <svg className="ps-pf-orbit-svg" viewBox="0 0 1200 480" fill="none" aria-hidden="true">
                <path
                  d="M 30,280 C 220,100 460,90 620,120 C 780,150 940,310 1170,250"
                  className="ps-pf-orbit-path"
                />
                <circle className="ps-pf-orbit-travelling-dot" r="6" />
                <circle cx="620" cy="120" r="18" className="ps-pf-orbit-node" />
                <polygon points="617,114 627,120 617,126" fill="#ffffff" />
              </svg>

              {/* 3D Floating Accents: Glossy Blue Sphere & Cyan Isometric Cube */}
              <motion.div
                className="ps-pf-floating-sphere"
                aria-hidden="true"
                animate={reduce ? {} : { y: [0, -14, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="ps-pf-floating-cube"
                aria-hidden="true"
                animate={reduce ? {} : { y: [0, -12, 0], rotate: [0, 8, 0] }}
                transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 40 40" className="ps-pf-cube-svg" fill="none">
                  {/* Isometric Top Face */}
                  <polygon points="20,2 38,11 20,20 2,11" fill="#38bdf8" />
                  {/* Left Face */}
                  <polygon points="2,11 20,20 20,38 2,29" fill="#0284c7" />
                  {/* Right Face */}
                  <polygon points="20,20 38,11 38,29 20,38" fill="#0369a1" />
                </svg>
              </motion.div>

              {/* Circular Next Navigation Control (Right Margin) */}
              <button
                type="button"
                className="ps-pf-nav-btn ps-pf-nav-btn--next"
                onClick={handleNextFilter}
                aria-label="Next projects view"
              >
                <ArrowRight size={20} strokeWidth={2.4} />
              </button>

              {/* Asymmetric Overlapping Floating Cards */}
              <div className="ps-pf-cards-stage">
                <AnimatePresence mode="popLayout">
                  {SELECTED_WORK_PROJECTS.map((project) => {
                    const isVisible = visibleProjects.some((p) => p.id === project.id);
                    if (!isVisible) return null;

                    return (
                      <motion.div
                        key={project.id}
                        layout
                        className={`ps-pf-card ${project.cardClass}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={
                          reduce
                            ? { opacity: 1, scale: 1 }
                            : {
                                opacity: 1,
                                scale: 1,
                                y: [0, -project.floatY, 0],
                                rotate: [
                                  project.baseRotation,
                                  project.baseRotation + (project.baseRotation >= 0 ? 0.8 : -0.8),
                                  project.baseRotation,
                                ],
                              }
                        }
                        exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.25 } }}
                        transition={
                          reduce
                            ? { duration: 0.2 }
                            : {
                                y: {
                                  duration: project.floatDuration,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: project.floatDelay,
                                },
                                rotate: {
                                  duration: project.floatDuration * 1.25,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: project.floatDelay,
                                },
                                layout: { duration: 0.4 },
                              }
                        }
                      >
                        {/* Luminous Glowing Cyan Border Track */}
                        <div className="ps-pf-card-border" aria-hidden="true" />

                        {/* Card Image */}
                        <div className="ps-pf-img-wrap">
                          <img
                            src={project.img}
                            alt={project.title}
                            className="ps-pf-card-img"
                            loading="lazy"
                          />
                          <div className="ps-pf-card-overlay" />
                        </div>

                        {/* Top-Left Pill Badge */}
                        <div className="ps-pf-card-badge">
                          <span>{project.tag}</span>
                        </div>


                        {/* Bottom Left Title/Category Info (Present on Featured Cards) */}
                        {(project.id === 'fashion' || project.id === 'bts' || project.id === 'juice') && (
                          <div className="ps-pf-card-meta">
                            <h3 className="ps-pf-card-title">{project.title}</h3>
                            <span className="ps-pf-card-sub">{project.categoryLabel}</span>
                          </div>
                        )}

                        {/* Bottom Right Circular Arrow Button */}
                        <a
                          href={CONTACT_HREF}
                          className="ps-pf-card-arrow"
                          aria-label={`View details for ${project.title}`}
                        >
                          <ArrowRight size={14} strokeWidth={2.4} />
                        </a>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Centered CTA: View All Work */}
            <motion.div
              className="ps-pf-cta-row"
              initial={{ opacity: 0, y: reduce ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.2, ease: EASE }}
            >
              <a href={CONTACT_HREF} className="ps-pf-cta-button">
                <span>View All Work</span>
                <ArrowRight size={18} strokeWidth={2.4} className="ps-pf-cta-arrow" aria-hidden="true" />
              </a>
            </motion.div>
          </div>
        </section>



        {/* =========================================================================
            5. THE ATRIOWINGS STUDIO ADVANTAGE (#why-choose)
            Polished Two-Column Composition & Seamless Timeline Architecture
            ========================================================================= */}
        <section className="ps-adv-section" id="why-choose" aria-labelledby="ps-adv-heading" style={{ scrollMarginTop: '110px' }}>
          {/* Subtle Ambient Background Lighting */}
          <div className="ps-adv-ambient-glow" aria-hidden="true" />
          <div className="ps-adv-ambient-orb ps-adv-ambient-orb--top" aria-hidden="true" />
          <div className="ps-adv-ambient-orb ps-adv-ambient-orb--bottom" aria-hidden="true" />

          <div className="ps-adv-container">
            <div className="ps-adv-grid">
              {/* Left Column: Eyebrow, Heading, Lead, Stats Card, CTA & Subtle Studio Backdrop */}
              <div className="ps-adv-left">
                {/* Subtle Studio Camera & Softbox Visual Watermark in Left Background */}
                <div className="ps-adv-studio-backdrop" aria-hidden="true">
                  <img
                    src={advantageStudioSetupImg}
                    alt=""
                    className="ps-adv-studio-img"
                    loading="lazy"
                  />
                </div>

                {/* Eyebrow Label with Cyan Dot */}
                <motion.div
                  className="ps-adv-eyebrow"
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reduce ? 0.2 : 0.5, ease: EASE }}
                >
                  <span className="ps-adv-eyebrow-dot" aria-hidden="true" />
                  <span>THE ATRIOWINGS STUDIO ADVANTAGE</span>
                </motion.div>

                {/* Main Heading with Integrated Cyan Gradient & Smooth Highlight Line */}
                <motion.h2
                  className="ps-adv-title"
                  id="ps-adv-heading"
                  initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reduce ? 0.2 : 0.55, delay: 0.1, ease: EASE }}
                >
                  Why Leading Brands<br />
                  Choose Us for<br />
                  <span className="ps-adv-highlight-wrap">
                    <span className="ps-adv-highlight-text">Product Photography &amp; Video</span>
                    <span className="ps-adv-heading-underline" aria-hidden="true">
                      <span className="ps-adv-heading-underline-beam" />
                    </span>
                  </span>
                </motion.h2>

                {/* Lead Description */}
                <motion.p
                  className="ps-adv-lead"
                  initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reduce ? 0.2 : 0.55, delay: 0.15, ease: EASE }}
                >
                  We don&rsquo;t just take photos; we engineer visual sales assets that captivate shoppers, eliminate returns, and maximize your advertising ROI.
                </motion.p>

                {/* Polished Horizontal Statistics Panel (4 Equal-Width Groups) */}
                <motion.div
                  className="ps-adv-stats-panel"
                  ref={statsRef}
                  initial={{ opacity: 0, y: reduce ? 0 : 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.2, ease: EASE }}
                >
                  <div className="ps-adv-stats-grid">
                    {ADVANTAGE_METRICS.map((metric, mIdx) => {
                      const MetricIcon = metric.icon;
                      return (
                        <div key={mIdx} className="ps-adv-stat-col">
                          <div className="ps-adv-stat-bubble" aria-hidden="true">
                            <MetricIcon size={17} strokeWidth={2.4} />
                          </div>
                          <div className="ps-adv-stat-num">
                            {metric.isStaticText ? (
                              metric.textVal
                            ) : (
                              <AnimatedCounter
                                end={metric.end}
                                suffix={metric.suffix}
                                decimals={metric.decimals}
                                isVisible={statsInView}
                              />
                            )}
                          </div>
                          <div className="ps-adv-stat-label">{metric.label}</div>
                          {mIdx < ADVANTAGE_METRICS.length - 1 && (
                            <span className="ps-adv-stat-divider" aria-hidden="true" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Prominent Pill CTA Button */}
                <motion.div
                  className="ps-adv-cta-wrap"
                  initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: reduce ? 0.2 : 0.55, delay: 0.25, ease: EASE }}
                >
                  <a href={CONTACT_HREF} className="ps-adv-cta-btn">
                    <span className="ps-adv-cta-text">Talk to Our Art Director</span>
                    <span className="ps-adv-cta-arrow-pill" aria-hidden="true">
                      <motion.span
                        animate={reduce ? {} : { x: [0, 3, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ display: 'inline-flex' }}
                      >
                        <ArrowRight size={17} strokeWidth={2.6} />
                      </motion.span>
                    </span>
                  </a>
                </motion.div>
              </div>

              {/* Right Column: Connected Timeline Rail & 6 Advantage Cards */}
              <div className="ps-adv-right">
                {/* Continuous Vertical Timeline Line with Travelling Light Pulse */}
                <div className="ps-adv-timeline-rail" aria-hidden="true">
                  <div className="ps-adv-timeline-line" />
                  <div className="ps-adv-timeline-beam" />
                </div>

                {/* 6 Connected Advantage Cards */}
                <div className="ps-adv-cards-list">
                  {WHY_CHOOSE_STUDIO.map((card, idx) => {
                    const CardIcon = card.icon;
                    return (
                      <motion.div
                        key={card.id}
                        className="ps-adv-card-wrap"
                        initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{ duration: reduce ? 0.2 : 0.5, delay: idx * 0.08, ease: EASE }}
                      >
                        {/* Timeline Node Centered Vertically to each Card */}
                        <div className="ps-adv-card-node" aria-hidden="true">
                          <span
                            className="ps-adv-node-ring"
                            style={{ animationDelay: `${idx * 0.45}s` }}
                          />
                          <span className="ps-adv-node-dot" />
                        </div>

                        {/* Card Component with Smooth Hover Lift & Soft Accent */}
                        <div className="ps-adv-card">
                          {/* Left Icon in Dark Navy Container */}
                          <div className="ps-adv-icon-box" aria-hidden="true">
                            <CardIcon size={20} strokeWidth={2.2} />
                          </div>

                          {/* Card Copy */}
                          <div className="ps-adv-card-content">
                            <h3 className="ps-adv-card-title">{card.title}</h3>
                            <p className="ps-adv-card-desc">{card.text}</p>
                          </div>

                          {/* Right Realistic Photo Thumbnail */}
                          <div className="ps-adv-photo-thumb">
                            <img
                              src={card.photo}
                              alt={card.photoAlt}
                              className="ps-adv-thumb-img"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. PRODUCTION WORKFLOW SECTION ("FROM BRIEF TO FINAL FILES")
            Matching Reference Specification
            ========================================================================= */}
        <section className="ps-workflow-section" id="workflow" aria-labelledby="ps-workflow-title">
          {/* Subtle Ambient Radial Lighting Glow */}
          <div className="ps-wf-ambient-glow" aria-hidden="true" />

          <div className="ps-wf-container">
            {/* Top Bar: Left Typography, Middle Handwritten Note, Right Perfume Visual */}
            <div className="ps-wf-header-grid">
              {/* Left Column: Heading, Eyebrow & Description */}
              <motion.div
                className="ps-wf-header-left"
                initial={{ opacity: 0, y: reduce ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: reduce ? 0.2 : 0.6, ease: EASE }}
              >
                <div className="ps-wf-eyebrow">
                  <span className="ps-wf-eyebrow-line" aria-hidden="true" />
                  <span>OUR WORKFLOW</span>
                </div>

                <h2 className="ps-wf-main-heading" id="ps-workflow-title">
                  FROM BRIEF TO<br />
                  <span className="ps-wf-heading-cyan">FINAL FILES</span>
                </h2>

                <p className="ps-wf-desc">
                  A simple, streamlined process to get stunning visuals &mdash; on time, every time.
                </p>
              </motion.div>

              {/* Center Script Annotation: "Your vision / our creative process" with Curved Arrow */}
              <motion.div
                className="ps-wf-handwritten-note"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: reduce ? 0.2 : 0.6, delay: 0.15, ease: EASE }}
                aria-hidden="true"
              >
                <span className="ps-wf-script-text">
                  Your vision<br />
                  our creative process
                </span>
                <svg className="ps-wf-script-arrow" viewBox="0 0 54 40" fill="none">
                  <path
                    d="M 6,6 C 26,4 42,16 46,32"
                    stroke="#1E7FD4"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 37,28 L 46,33 L 49,23"
                    stroke="#1E7FD4"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>

              {/* Right Column: Floating Perfume Visual on Pedestal with Halo Glow */}
              <motion.div
                className="ps-wf-top-visual"
                initial={{ opacity: 0, x: reduce ? 0 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: reduce ? 0.2 : 0.7, delay: 0.1, ease: EASE }}
                aria-hidden="true"
              >
                <div className="ps-wf-perfume-card">
                  <div className="ps-wf-perfume-halo" />
                  <img
                    src={workflowPerfumeSetupImg}
                    alt="Lumière product styling preview"
                    className="ps-wf-perfume-img"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>

            {/* Workflow Cards Wave Track with SVG Connecting Line & Arrow Nodes */}
            <div className="ps-wf-stage-wrap">
              {/* Connecting Wave Line with Continuous Travelling Glow Beam */}
              <svg className="ps-wf-wave-svg" viewBox="0 0 1200 160" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="psWfWaveGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06a3da" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0789e8" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <path
                  d="M 120,80 C 260,110 390,50 530,80 C 670,110 810,50 1080,80"
                  className="ps-wf-wave-path"
                />
                {/* Multi-particle Light Trail travelling across the wave */}
                <circle className="ps-wf-travelling-dot ps-wf-travelling-dot--glow" r="14" />
                <circle className="ps-wf-travelling-dot ps-wf-travelling-dot--tail2" r="10" />
                <circle className="ps-wf-travelling-dot ps-wf-travelling-dot--tail1" r="7" />
                <circle className="ps-wf-travelling-dot ps-wf-travelling-dot--head" r="5" />
              </svg>

              {/* The 4 Staggered Asymmetrical Cards with Continuous Animations */}
              <div className="ps-wf-cards-track">
                {WORKFLOW_STEPS.map((step, idx) => {
                  const StepIcon = step.icon;
                  const BadgeIcon = step.badgeIcon;
                  return (
                    <motion.div
                      key={step.step}
                      className="ps-wf-card-wrapper"
                      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: reduce ? 0.2 : 0.6, delay: idx * 0.1, ease: EASE }}
                    >
                      <motion.div
                        className={`ps-wf-card ps-wf-card--${step.step}`}
                        animate={
                          reduce
                            ? { y: step.yOffset, rotate: step.tilt }
                            : {
                                y: [step.yOffset, step.yOffset - step.floatDistance, step.yOffset],
                                rotate: [step.tilt, step.tilt + step.rotDelta, step.tilt],
                              }
                        }
                        transition={
                          reduce
                            ? {}
                            : {
                                y: {
                                  duration: step.floatDuration,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: step.floatDelay,
                                },
                                rotate: {
                                  duration: step.floatDuration * 1.15,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: step.floatDelay,
                                },
                              }
                        }
                      >
                        {/* Continuously Animated Gradient Glow Border */}
                        <div className="ps-wf-card-border" aria-hidden="true" />

                        {/* Card Header: Animated Icon & Pulsing Step Number */}
                        <div className="ps-wf-card-top">
                          <motion.div
                            className="ps-wf-icon-box"
                            animate={
                              reduce
                                ? {}
                                : {
                                    y: [0, -3.5, 0],
                                    scale: [1, 1.05, 1],
                                  }
                            }
                            transition={
                              reduce
                                ? {}
                                : {
                                    duration: 3.4,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: idx * 0.4,
                                  }
                            }
                          >
                            <StepIcon size={20} strokeWidth={2.2} />
                          </motion.div>
                          <motion.span
                            className="ps-wf-step-num"
                            animate={
                              reduce
                                ? {}
                                : {
                                    scale: [1, 1.06, 1],
                                    opacity: [0.72, 1, 0.72],
                                  }
                            }
                            transition={
                              reduce
                                ? {}
                                : {
                                    duration: 3.0,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: idx * 0.45,
                                  }
                            }
                          >
                            {step.step}
                          </motion.span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="ps-wf-card-title">{step.title}</h3>
                        <p className="ps-wf-card-desc">{step.desc}</p>

                        {/* Card Bottom: Pill Tag Badge on Left */}
                        <div className="ps-wf-card-bottom">
                          <div className="ps-wf-badge">
                            <BadgeIcon size={13} strokeWidth={2.4} className="ps-wf-badge-icon" />
                            <span>{step.badgeText}</span>
                          </div>
                        </div>

                        {/* Overlapping Realistic Photographic Thumbnail (Independently Floating + Hover Expand) */}
                        <motion.div
                          className={`ps-wf-card-thumb ps-wf-card-thumb--${step.step}`}
                          aria-hidden="true"
                          animate={
                            reduce
                              ? { y: 0, rotate: step.thumbTilt }
                              : {
                                  y: [0, -5.5, 0],
                                  rotate: [step.thumbTilt, step.thumbTilt + 1.6, step.thumbTilt],
                                }
                          }
                          transition={
                            reduce
                              ? {}
                              : {
                                  duration: step.thumbDuration || 4.0,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: step.thumbDelay || 0.4,
                                }
                          }
                          whileHover={{
                            scale: 1.12,
                            zIndex: 12,
                            transition: { duration: 0.25, ease: 'easeOut' },
                          }}
                        >
                          <img
                            src={step.thumb}
                            alt={step.thumbAlt}
                            className="ps-wf-thumb-img"
                            loading="lazy"
                          />
                        </motion.div>
                      </motion.div>

                      {/* Continuously Pulsing & Glowing Connecting Arrow Node */}
                      {idx < WORKFLOW_STEPS.length - 1 && (
                        <motion.div
                          className="ps-wf-arrow-node"
                          aria-hidden="true"
                          animate={
                            reduce
                              ? {}
                              : {
                                  x: [0, 4.5, 0],
                                  scale: [1, 1.08, 1],
                                  boxShadow: [
                                    '0 0 10px rgba(7, 137, 232, 0.45), 0 0 14px rgba(0, 229, 255, 0.3)',
                                    '0 0 18px rgba(0, 229, 255, 0.85), 0 0 28px rgba(0, 229, 255, 0.55)',
                                    '0 0 10px rgba(7, 137, 232, 0.45), 0 0 14px rgba(0, 229, 255, 0.3)',
                                  ],
                                }
                          }
                          transition={
                            reduce
                              ? {}
                              : {
                                  duration: 2.4,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: idx * 0.35,
                                }
                          }
                        >
                          <motion.span
                            className="ps-wf-arrow-icon"
                            animate={reduce ? {} : { x: [0, 2.5, 0] }}
                            transition={
                              reduce
                                ? {}
                                : {
                                    duration: 1.6,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                    delay: idx * 0.35,
                                  }
                            }
                          >
                            <ArrowRight size={13} strokeWidth={3} />
                          </motion.span>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. CLIENT FAQS SECTION
            ========================================================================= */}
        <section className="ps-section ps-faq" id="faq">
          <div className="ps-container ps-container--narrow">
            <div className="ps-section-header">
              <span className="ps-badge">COMMONLY ASKED QUESTIONS</span>
              <h2 className="ps-section-title">
                Everything You Need to Know About <span className="ps-text-cyan">Booking a Shoot</span>
              </h2>
            </div>

            <div className="ps-faq-list">
              {FAQ_ITEMS.map((faq, i) => (
                <div
                  key={i}
                  className={`ps-faq-item ${openFaq === i ? 'ps-faq-item--open' : ''}`}
                >
                  <button
                    type="button"
                    className="ps-faq-trigger"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={openFaq === i}
                  >
                    <span className="ps-faq-q">{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`ps-faq-chevron ${openFaq === i ? 'ps-faq-chevron--rotated' : ''}`}
                    />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      className="ps-faq-answer"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p>{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. FINAL HIGH-IMPACT CALL TO ACTION
            ========================================================================= */}
        <section className="ps-section ps-final-cta">
          <div className="ps-container">
            <div className="ps-cta-box">
              <div className="ps-cta-glow" aria-hidden="true" />
              <span className="ps-badge ps-badge--cyan">GET STARTED TODAY</span>
              <h2 className="ps-cta-title">Ready to Make Your Products Impossible to Ignore?</h2>
              <p className="ps-cta-text">
                Book a shoot date at our Chennai studio or request a customized quotation for your upcoming catalogue, lookbook, or commercial video ad campaign.
              </p>
              <div className="ps-cta-buttons">
                <a href={CONTACT_HREF} className="ps-btn ps-btn--primary ps-btn--lg">
                  <span>Book Your Studio Shoot</span>
                  <ArrowRight size={20} strokeWidth={2.4} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>



      {/* Universal Floating Sticky CTA & Atriowings Footer */}
      <StickyCTA />
      <Footer />
    </div>
  );
}
