import { Fragment, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import './dmp-tools.css'; // import AFTER the page stylesheet

const EASE = [0.22, 1, 0.36, 1];

/* Brand marks: Simple Icons path data (CC0), inlined so no extra dependency is needed.
   Ahrefs, Adobe Express, Canva and Looker Studio have no mark in that set, so they get a neutral
   initials badge instead of an imitation logo. Swap in the official SVGs if you have them. */
const MARKS = {
  gsc: { c: '#458CF5', d: 'M8.548 1.156L6.832 2.872v1.682h1.716zm0 3.398v.035H6.832v-.035H3.386L0 7.844v3.577h2.826V8.94c0-.525.429-.954.954-.954h16.476c.525 0 .954.43.954.954v2.48h2.754V7.844l-3.386-3.29H17.3v.035h-1.717v-.035zm7.035 0H17.3V2.872l-1.717-1.716zM8.679 1.188V2.84h6.773V1.188zm11.471 7.07a.834.834 0 00-.132.01l-.543.002c-5.216.014-10.432-.008-15.648.01-.435-.063-.794.436-.716.883v2.264h17.812c-.016-.888.045-1.782-.034-2.666-.104-.342-.427-.502-.739-.502zm-15.422.634a.689.698 0 01.689.698.689.698 0 01-.689.697.689.698 0 01-.688-.697.689.698 0 01.688-.698zm2.134 0a.689.698 0 01.689.698.689.698 0 01-.689.697.689.698 0 01-.688-.697.689.698 0 01.688-.698zM.036 11.645v9.156c0 1.05.858 1.908 1.907 1.908h.883V11.645zm21.174 0v11.064h.882c1.05 0 1.908-.858 1.908-1.908v-9.156zM4.057 13.133v6.85h6.137v-6.85zm13.243.021v3.777l-1.708.977-1.708-.977v-3.758a4.006 4.006 0 000 7.23v2.441h3.457v-2.442a4.006 4.006 0 00-.041-7.248zm-13.243 8.26v1.43h7.925v-1.43z' },
  ga4: { c: '#E37400', d: 'M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9984a2.9808 2.9808 0 01-.3677-.0208c-1.528-.226-2.6477-1.5558-2.6105-3.1V3.1204c-.0369-1.5458 1.0856-2.8762 2.6157-3.1 1.6361-.1915 3.1178.9796 3.3093 2.6158.014.1201.0208.241.0202.3619zM4.1326 18.0548c-1.6417 0-2.9726 1.331-2.9726 2.9726C1.16 22.6691 2.4909 24 4.1326 24s2.9726-1.3309 2.9726-2.9726-1.331-2.9726-2.9726-2.9726zm7.8728-9.0098c-.0171 0-.0342 0-.0513.0003-1.6495.0904-2.9293 1.474-2.891 3.1256v7.9846c0 2.167.9535 3.4825 2.3505 3.763 1.6118.3266 3.1832-.7152 3.5098-2.327.04-.1974.06-.3983.0593-.5998v-8.9585c.003-1.6474-1.33-2.9852-2.9773-2.9882z' },
  semrush: { c: '#FF642D', d: 'M20.698 11.911c0 .444-.226.516-.79.516-.596 0-.706-.1-.77-.554-.118-1.152-.896-2.13-2.201-2.24-.418-.034-.518-.19-.518-.706 0-.48.074-.708.446-.708 2.265.01 3.833 1.832 3.833 3.69v.002zm3.3 0c0-3.456-2.338-7.11-7.74-7.11H5.52c-.218 0-.354.11-.354.31 0 .109.082.209.156.26.388.31.97.654 1.73 1.036.743.372 1.323.616 1.903.852.246.1.336.208.336.344 0 .19-.136.308-.4.308H.372c-.254 0-.372.164-.372.326 0 .136.044.254.162.372.69.726 1.796 1.596 3.4 2.604 1.466.91 2.98 1.74 4.533 2.492.236.11.308.236.308.372-.008.154-.126.28-.4.28H4.1c-.216 0-.344.12-.344.3 0 .1.08.226.19.326.888.808 2.311 1.688 4.207 2.494 2.53 1.08 5.094 1.721 7.98 1.721 5.465 0 7.867-4.087 7.867-7.289l-.002.002zm-7.133 5.104c-2.794 0-5.132-2.276-5.132-5.114 0-2.794 2.33-5.04 5.132-5.04 2.863 0 5.111 2.24 5.111 5.04a5.086 5.086 0 0 1-5.111 5.114z' },
  gads: { c: '#4285F4', d: 'M3.9998 22.9291C1.7908 22.9291 0 21.1383 0 18.9293s1.7908-3.9998 3.9998-3.9998 3.9998 1.7908 3.9998 3.9998-1.7908 3.9998-3.9998 3.9998zm19.4643-6.0004L15.4632 3.072C14.3586 1.1587 11.9121.5028 9.9988 1.6074S7.4295 5.1585 8.5341 7.0718l8.0009 13.8567c1.1046 1.9133 3.5511 2.5679 5.4644 1.4646 1.9134-1.1046 2.568-3.5511 1.4647-5.4644zM7.5137 4.8438L1.5645 15.1484A4.5 4.5 0 0 1 4 14.4297c2.5597-.0075 4.6248 2.1585 4.4941 4.7148l3.2168-5.5723-3.6094-6.25c-.4499-.7793-.6322-1.6394-.5878-2.4784z' },
  meta: { c: '#0866FF', d: 'M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z' },
  buffer: { c: '#231F20', d: 'M1.371 5.476L11.943 0l10.686 5.476-10.686 5.495zm3.36 4.81l7.212 3.547 7.288-3.547 3.398 1.655-10.686 5.202L1.371 11.94zm0 6.171l7.212 3.911 7.288-3.91 3.398 1.815L11.943 24 1.371 18.273z' },
  mailchimp: { c: '#241C15', d: 'M11.267 0C6.791-.015-1.82 10.246 1.397 12.964l.79.669a3.88 3.88 0 0 0-.22 1.792c.084.84.518 1.644 1.22 2.266.666.59 1.542.964 2.392.964 1.406 3.24 4.62 5.228 8.386 5.34 4.04.12 7.433-1.776 8.854-5.182.093-.24.488-1.316.488-2.267 0-.956-.54-1.352-.885-1.352-.01-.037-.078-.286-.172-.586-.093-.3-.19-.51-.19-.51.375-.563.382-1.065.332-1.35-.053-.353-.2-.653-.496-.964-.296-.311-.902-.63-1.753-.868l-.446-.124c-.002-.019-.024-1.053-.043-1.497-.014-.32-.042-.822-.197-1.315-.186-.668-.508-1.253-.911-1.627 1.112-1.152 1.806-2.422 1.804-3.511-.003-2.095-2.576-2.729-5.746-1.416l-.672.285A678.22 678.22 0 0 0 12.7.504C12.304.159 11.817.002 11.267 0zm.073.873c.166 0 .322.019.465.058.297.084 1.28 1.224 1.28 1.224s-1.826 1.013-3.52 2.426c-2.28 1.757-4.005 4.311-5.037 7.082-.811.158-1.526.618-1.963 1.253-.261-.218-.748-.64-.834-.804-.698-1.326.761-3.902 1.781-5.357C5.834 3.44 9.37.867 11.34.873zm3.286 3.273c.04-.002.06.05.028.074-.143.11-.299.26-.413.414a.04.04 0 0 0 .031.064c.659.004 1.587.235 2.192.574.041.023.012.103-.034.092-.915-.21-2.414-.369-3.97.01-1.39.34-2.45.863-3.224 1.426-.04.028-.086-.023-.055-.06.896-1.035 1.999-1.935 2.987-2.44.034-.018.07.019.052.052-.079.143-.23.447-.278.678-.007.035.032.063.062.042.615-.42 1.684-.868 2.622-.926zm3.023 3.205l.056.001a.896.896 0 0 1 .456.146c.534.355.61 1.216.638 1.845.015.36.059 1.229.074 1.478.034.571.184.651.487.751.17.057.33.098.563.164.706.198 1.125.4 1.39.658.157.162.23.333.253.497.083.608-.472 1.36-1.942 2.041-1.607.746-3.557.935-4.904.785l-.471-.053c-1.078-.145-1.693 1.247-1.046 2.201.417.615 1.552 1.015 2.688 1.015 2.604 0 4.605-1.111 5.35-2.072a.987.987 0 0 0 .06-.085c.036-.055.006-.085-.04-.054-.608.416-3.31 2.069-6.2 1.571 0 0-.351-.057-.672-.182-.255-.1-.788-.344-.853-.891 2.333.72 3.801.039 3.801.039a.072.072 0 0 0 .042-.072.067.067 0 0 0-.074-.06s-1.911.283-3.718-.378c.197-.64.72-.408 1.51-.345a11.045 11.045 0 0 0 3.647-.394c.818-.234 1.892-.697 2.727-1.356.281.618.38 1.299.38 1.299s.219-.04.4.073c.173.106.299.326.213.895-.176 1.063-.628 1.926-1.387 2.72a5.714 5.714 0 0 1-1.666 1.244c-.34.18-.704.334-1.087.46-2.863.935-5.794-.093-6.739-2.3a3.545 3.545 0 0 1-.189-.522c-.403-1.455-.06-3.2 1.008-4.299.065-.07.132-.153.132-.256 0-.087-.055-.179-.102-.243-.374-.543-1.669-1.466-1.409-3.254.187-1.284 1.31-2.189 2.357-2.135.089.004.177.01.266.015.453.027.85.085 1.223.1.625.028 1.187-.063 1.853-.618.225-.187.405-.35.71-.401.028-.005.092-.028.215-.028zm.022 2.18a.42.42 0 0 0-.06.005c-.335.054-.347.468-.228 1.04.068.32.187.595.32.765.175-.02.343-.022.498 0 .089-.205.104-.557.024-.942-.112-.535-.261-.872-.554-.868zm-3.66 1.546a1.724 1.724 0 0 0-1.016.326c-.16.117-.311.28-.29.378.008.032.031.056.088.063.131.015.592-.217 1.122-.25.374-.023.684.094.923.2.239.104.386.173.443.113.037-.038.026-.11-.031-.204-.118-.192-.36-.387-.618-.497a1.601 1.601 0 0 0-.621-.129zm4.082.81c-.171-.003-.313.186-.317.42-.004.236.131.43.303.432.172.003.314-.185.318-.42.004-.236-.132-.429-.304-.432zm-3.58.172c-.05 0-.102.002-.155.008-.311.05-.483.152-.593.247-.094.082-.152.173-.152.237a.075.075 0 0 0 .075.076c.07 0 .228-.063.228-.063a1.98 1.98 0 0 1 1.001-.104c.157.018.23.027.265-.026.01-.016.022-.049-.01-.1-.063-.103-.311-.269-.66-.275zm2.26.4c-.127 0-.235.051-.283.148-.075.154.035.363.246.466.21.104.443.063.52-.09.075-.155-.035-.364-.246-.467a.542.542 0 0 0-.237-.058zm-11.635.024c.048 0 .098 0 .149.003.73.04 1.806.6 2.052 2.19.217 1.41-.128 2.843-1.449 3.069-.123.02-.248.029-.374.026-1.22-.033-2.539-1.132-2.67-2.435-.145-1.44.591-2.548 1.894-2.811.117-.024.252-.04.398-.042zm-.07.927a1.144 1.144 0 0 0-.847.364c-.38.418-.439.988-.366 1.19.027.073.07.094.1.098.064.008.16-.039.22-.2a1.2 1.2 0 0 0 .017-.052 1.58 1.58 0 0 1 .157-.37.689.689 0 0 1 .955-.199c.266.174.369.5.255.81-.058.161-.154.469-.133.721.043.511.357.717.64.738.274.01.466-.143.515-.256.029-.067.005-.107-.011-.125-.043-.053-.113-.037-.18-.021a.638.638 0 0 1-.16.022.347.347 0 0 1-.294-.148c-.078-.12-.073-.3.013-.504.011-.028.025-.058.04-.092.138-.308.368-.825.11-1.317-.195-.37-.513-.602-.894-.65a1.135 1.135 0 0 0-.138-.01z' },
  hubspot: { c: '#FF7A59', d: 'M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z' },
};

const BADGES = { ahrefs: 'Ah', adobe: 'Ae', canva: 'Cv', looker: 'LS' };

const CATEGORIES = [
  { id: 'seo', label: 'SEO & Research', short: 'SEO', tools: [
    { id: 'gsc', name: 'Google Search Console', purpose: 'Monitor search performance, indexing and visibility.' },
    { id: 'ga4', name: 'Google Analytics 4', purpose: 'Understand site traffic and how visitors behave.' },
    { id: 'semrush', name: 'Semrush', purpose: 'Keyword, competitor and site research.' },
    { id: 'ahrefs', name: 'Ahrefs', purpose: 'Backlink and keyword analysis.' } ] },
  { id: 'ads', label: 'Advertising', short: 'Advertising', tools: [
    { id: 'gads', name: 'Google Ads', purpose: 'Plan and optimize search, display and video campaigns.' },
    { id: 'meta', name: 'Meta Ads Manager', purpose: 'Run and measure Facebook and Instagram campaigns.' } ] },
  { id: 'social', label: 'Social Media Management', short: 'Social', tools: [
    { id: 'meta', name: 'Meta Business Suite', purpose: 'Plan, publish and manage social content and messages.' },
    { id: 'buffer', name: 'Buffer', purpose: 'Schedule posts and track social engagement.' } ] },
  { id: 'creative', label: 'Content & Creative', short: 'Creative', tools: [
    { id: 'canva', name: 'Canva', purpose: 'Design social posts and marketing creatives.' },
    { id: 'adobe', name: 'Adobe Express', purpose: 'Produce quick branded graphics and short videos.' } ] },
  { id: 'auto', label: 'Email Marketing & Automation', short: 'Automation', tools: [
    { id: 'mailchimp', name: 'Mailchimp', purpose: 'Build email campaigns and audience segments.' },
    { id: 'hubspot', name: 'HubSpot', purpose: 'Manage leads, nurturing and marketing automation.' } ] },
  { id: 'analytics', label: 'Analytics & Reporting', short: 'Analytics', tools: [
    { id: 'looker', name: 'Looker Studio', purpose: 'Build dashboards and clear campaign reports.' },
    { id: 'ga4', name: 'Google Analytics 4', purpose: 'Measure conversions and campaign results.' } ] },
];

// hub (500,350) -> inner edge of each cluster (viewBox 1000x700; rows sit at 1/6, 3/6, 5/6)
const LINES = [
  'M500 350 C 420 350, 390 117, 296 117',
  'M500 350 C 420 350, 390 350, 296 350',
  'M500 350 C 420 350, 390 583, 296 583',
  'M500 350 C 580 350, 610 117, 704 117',
  'M500 350 C 580 350, 610 350, 704 350',
  'M500 350 C 580 350, 610 583, 704 583',
];
const SLOT = [
  { gridColumn: 1, gridRow: 1 }, { gridColumn: 1, gridRow: 2 }, { gridColumn: 1, gridRow: 3 },
  { gridColumn: 3, gridRow: 1 }, { gridColumn: 3, gridRow: 2 }, { gridColumn: 3, gridRow: 3 },
];

function Logo({ id }) {
  const m = MARKS[id];
  return (
    <span className={`dmpt-logo${m ? '' : ' is-badge'}`} aria-hidden="true">
      {m ? (
        <svg viewBox="0 0 24 24" focusable="false"><path d={m.d} fill={m.c} /></svg>
      ) : (
        <b>{BADGES[id]}</b>
      )}
    </span>
  );
}

const FILTERS = [{ id: 'all', label: 'All Tools' }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.short }))];
const FLOAT = [5.8, 6.6, 7.4, 6.2, 7, 5.5];

export default function DmpTools() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState('all');
  const [hover, setHover] = useState(null);   // { cat, tool }
  const [pinned, setPinned] = useState(null);
  const info = hover || pinned;
  const infoTool = info ? CATEGORIES.find((c) => c.id === info.cat)?.tools.find((t) => t.id === info.tool) : null;
  const infoCat = info ? CATEGORIES.find((c) => c.id === info.cat) : null;

  const dim = (cid) => filter !== 'all' && filter !== cid;
  const lit = (cid) => (info && info.cat === cid) || filter === cid;

  return (
    <section id="dmp-tools" className="dmpt" aria-labelledby="dmp-tools-title">
      <div className="dmpt-bg" aria-hidden="true"><span className="dmpt-glow" /></div>
      <div className="dmpt-inner">
        <div className="dmpt-head">
          <motion.p className="dmpt-kicker" initial={reduce ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE }}>
            <span className="dmpt-kicker-line" aria-hidden="true" />OUR DIGITAL TOOLKIT
          </motion.p>
          <motion.h2 id="dmp-tools-title" className="dmpt-title" initial={reduce ? false : 'hidden'} whileInView="visible" viewport={{ once: true, amount: 0.6 }}>
            {['The Tools Behind', 'Smarter Digital Growth'].map((l, i) => (
              <Fragment key={l}>
                <span className="dmpt-line">
                  <motion.span className={`dmpt-line-in${i ? ' dmpt-grad' : ''}`} variants={{ hidden: { y: '110%' }, visible: { y: 0 } }} transition={{ duration: 0.75, ease: EASE, delay: 0.1 * i }}>{l}</motion.span>
                </span>
              </Fragment>
            ))}
          </motion.h2>
          <motion.p className="dmpt-sub" initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}>
            We use industry-leading platforms to research, create, optimize, automate, and measure campaigns that deliver meaningful results.
          </motion.p>
        </div>

        <div className="dmpt-filters" role="group" aria-label="Filter tools by category">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className={`dmpt-filter${filter === f.id ? ' is-on' : ''}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="dmpt-stage">
          {/* connection lines (desktop only) */}
          <svg className="dmpt-lines" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="dmpt-lg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#1E7FD4" /><stop offset="1" stopColor="#06A3DA" />
              </linearGradient>
            </defs>
            {LINES.map((d, i) => {
              const on = lit(CATEGORIES[i].id);
              return (
                <g key={d} className={`dmpt-line-g${on ? ' is-lit' : ''}${dim(CATEGORIES[i].id) ? ' is-dim' : ''}`}>
                  <motion.path d={d} fill="none" stroke={on ? 'url(#dmpt-lg)' : '#BFD6EC'} strokeWidth={on ? 2.2 : 1.3} vectorEffect="non-scaling-stroke"
                    initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1.1, ease: EASE, delay: 0.3 + i * 0.1 }} />
                  {!reduce && (
                    <circle cx="0" cy="0" r="3.4" fill="#06A3DA" opacity="0" className="dmpt-travel">
                      <animateMotion dur={`${6 + i * 0.7}s`} repeatCount="indefinite" path={d} begin={`${i * 0.8}s`} />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur={`${6 + i * 0.7}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="dmpt-hub-wrap">
            <span className="dmpt-orbit dmpt-orbit--1" aria-hidden="true"><i /></span>
            <span className="dmpt-orbit dmpt-orbit--2" aria-hidden="true"><i /></span>
            <motion.div className="dmpt-hub" initial={reduce ? false : { opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }}>
              <span className="dmpt-hub-pulse" aria-hidden="true" />
              <TrendingUp size={26} strokeWidth={2.2} aria-hidden="true" />
              <span className="dmpt-hub-text">DIGITAL<br />GROWTH</span>
            </motion.div>
          </div>

          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.id}
              className={`dmpt-cluster${dim(c.id) ? ' is-dim' : ''}${lit(c.id) ? ' is-lit' : ''} dmpt-cluster--${i < 3 ? 'l' : 'r'}`}
              style={{ '--col': SLOT[i].gridColumn, '--row': SLOT[i].gridRow }}
              initial={reduce ? false : { opacity: 0, x: i < 3 ? -26 : 26 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: EASE, delay: 0.1 + (i % 3) * 0.1 }}
            >
              <h3 className="dmpt-cat">{c.label}</h3>
              <ul className="dmpt-tools">
                {c.tools.map((t, k) => {
                  const isOn = info && info.cat === c.id && info.tool === t.id;
                  return (
                    <motion.li
                      key={`${c.id}-${t.id}`}
                      animate={reduce ? undefined : { y: [0, -4, 0] }}
                      transition={reduce ? undefined : { duration: FLOAT[(i + k) % FLOAT.length], repeat: Infinity, ease: 'easeInOut', delay: -(i * 0.9 + k * 1.7) }}
                    >
                      <button
                        type="button"
                        className={`dmpt-chip${isOn ? ' is-on' : ''}`}
                        aria-pressed={pinned && pinned.cat === c.id && pinned.tool === t.id ? true : false}
                        onMouseEnter={() => setHover({ cat: c.id, tool: t.id })}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover({ cat: c.id, tool: t.id })}
                        onBlur={() => setHover(null)}
                        onClick={() => setPinned((p) => (p && p.cat === c.id && p.tool === t.id ? null : { cat: c.id, tool: t.id }))}
                      >
                        <Logo id={t.id} />
                        <span className="dmpt-chip-text">
                          <span className="dmpt-chip-name">{t.name}</span>
                          <span className="dmpt-chip-purpose">{t.purpose}</span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="dmpt-info" aria-live="polite">
          {infoTool ? (
            <>
              <Logo id={infoTool.id} />
              <span><strong>{infoTool.name}</strong><em>{infoCat.label}</em>{infoTool.purpose}</span>
            </>
          ) : (
            <span className="dmpt-info-hint">Hover over, focus, or tap a tool to see how we use it.</span>
          )}
        </div>

       
      </div>
    </section>
  );
}