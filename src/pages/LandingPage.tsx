import { Link, useNavigate } from 'react-router-dom';
import {
  Zap, ArrowRight, Layout, Palette, Search, Globe, Shield,
  Star, Check, ChevronDown, PenTool, Image, FileText, Award,
  Layers, ArrowUpRight, Sparkles, Users, BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { MarketingNav } from '@/components/marketing/MarketingNav';
import { Footer } from '@/components/marketing/Footer';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

/* ─── Data ───────────────────────────────────────────── */
const features = [
  { icon: Layout,   title: 'Drag-free CMS',        desc: 'Fill clean forms in your dashboard and watch your portfolio update instantly — no code, no drag-and-drop.' },
  { icon: Palette,  title: 'Premium templates',     desc: 'Start from gorgeous templates, pick your accent colour, toggle dark/light mode in one click.' },
  { icon: Image,    title: 'Media uploads',         desc: 'Upload profile photos, project screenshots, and certificate images with instant CDN-backed preview.' },
  { icon: Search,   title: 'SEO built-in',          desc: 'Craft custom meta titles, descriptions, and keywords for every published portfolio page.' },
  { icon: Globe,    title: 'Instant publish',       desc: 'Go live on a clean public URL in seconds. Share anywhere — LinkedIn, Twitter, job applications.' },
  { icon: FileText, title: 'Blog & writing',        desc: 'Write and publish blog posts with rich excerpts, cover images, and draft/publish toggle.' },
  { icon: PenTool,  title: 'Projects & case studies', desc: 'Showcase your work with tags, live links, GitHub URLs, and featured spotlights.' },
  { icon: Shield,   title: 'Secure by design',      desc: 'Row-level security ensures only you can edit. Visitors only see what you publish.' },
];

const templates = [
  {
    name: 'Aurora',
    desc: 'Gradient hero, bold typography, dark-first',
    tags: ['Dark', 'Gradient', 'Bold'],
    from: '#6366f1', to: '#a855f7',
    preview: [
      { w: '60%', h: 8,  op: 0.9 },
      { w: '40%', h: 5,  op: 0.6 },
      { w: '80%', h: 3,  op: 0.3 },
      { w: '55%', h: 3,  op: 0.25 },
    ],
  },
  {
    name: 'Minimal',
    desc: 'Content-first, generous whitespace, light',
    tags: ['Light', 'Clean', 'Simple'],
    from: '#64748b', to: '#1e293b',
    preview: [
      { w: '50%', h: 6,  op: 0.9 },
      { w: '35%', h: 4,  op: 0.5 },
      { w: '75%', h: 2,  op: 0.25 },
      { w: '60%', h: 2,  op: 0.2 },
    ],
  },
  {
    name: 'Bold',
    desc: 'High-contrast, expressive, attention-grabbing',
    tags: ['Dark', 'Vibrant', 'Expressive'],
    from: '#f59e0b', to: '#ef4444',
    preview: [
      { w: '65%', h: 9,  op: 0.9 },
      { w: '45%', h: 5,  op: 0.6 },
      { w: '80%', h: 3,  op: 0.3 },
      { w: '50%', h: 3,  op: 0.25 },
    ],
  },
];

const testimonials = [
  { name: 'Sarah Chen',    role: 'Product Designer @ Figma',       quote: 'I had my portfolio live in under an hour. The templates look like they cost thousands to build.',        avatar: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Marcus Reid',   role: 'Full-stack Engineer @ Stripe',   quote: 'The CMS approach is brilliant. I update my projects from the dashboard and changes go live instantly.',  avatar: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Priya Sharma',  role: 'Data Scientist @ DeepMind',      quote: 'Finally a portfolio builder that doesn\'t force cookie-cutter templates. The customization is unreal.',   avatar: 'https://i.pravatar.cc/150?img=32' },
  { name: 'James Okafor',  role: 'UX Researcher @ Google',         quote: 'Dark mode, beautiful gradients, and sharp typography — it feels like a premium SaaS product.',           avatar: 'https://i.pravatar.cc/150?img=15' },
];

const faqs = [
  { q: 'Do I need to know how to code?', a: 'Not at all. PortalX is a fully no-code portfolio builder. Fill in forms in a clean dashboard and your portfolio updates live.' },
  { q: 'Can I customize the look?', a: 'Yes — choose from premium templates, toggle dark/light theme, and set a custom accent colour. SEO meta tags are also fully editable.' },
  { q: 'How does publishing work?', a: 'When you\'re ready, hit Publish. Your portfolio goes live on a public URL like /u/your-slug — shareable anywhere, instantly.' },
  { q: 'Can I upload my resume?', a: 'Yes. Upload a PDF resume and visitors can download it directly from your live portfolio\'s contact section.' },
  { q: 'Is my data secure?', a: 'Every portfolio is protected by row-level security. Only you can edit your data; the public can only see what you\'ve published.' },
  { q: 'Can I write blog posts?', a: 'Absolutely. The built-in blog lets you create posts with titles, excerpts, cover images, and full content — all managed from the CMS.' },
];

const stats = [
  { value: '12+',    label: 'Content sections' },
  { value: '3',      label: 'Premium templates' },
  { value: '1-click', label: 'Publish to live URL' },
  { value: '100%',   label: 'No code required' },
];

/* ─── Sub-components ──────────────────────────────────── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200/70 dark:border-white/[0.06] last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="font-display font-semibold text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
          {q}
        </span>
        <ChevronDown className={cn('w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300', open && 'rotate-180')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-48 pb-5' : 'max-h-0')}>
        <p className="text-[0.9rem] text-gray-500 dark:text-gray-400 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, idx }: { icon: typeof Layout; title: string; desc: string; idx: number }) {
  return (
    <div
      className="group relative glass-card p-6 card-hover animate-fade-in-up"
      style={{ animationDelay: `${idx * 60}ms`, animationFillMode: 'both' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 text-white shadow-md transition-transform duration-300 group-hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-display font-semibold text-[0.95rem] text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Mock dashboard preview inside hero ─── */
function HeroDashboardPreview() {
  const sections = ['Profile', 'Education', 'Experience', 'Skills', 'Projects', 'Blog', 'Resume'];
  const statItems = [
    { label: 'Projects', val: 6, icon: Layers, color: '#6366f1' },
    { label: 'Blog Posts', val: 4, icon: FileText, color: '#a855f7' },
    { label: 'Skills', val: 14, icon: BarChart3, color: '#10b981' },
    { label: 'Certificates', val: 3, icon: Award, color: '#f59e0b' },
  ];
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Glow halos */}
      <div className="absolute -inset-8 bg-gradient-to-r from-brand-500/25 via-accent-500/20 to-brand-400/25 rounded-3xl blur-2xl" />
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.6)]"
           style={{ background: 'linear-gradient(160deg,#13131e,#0d0d14)' }}>
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex-1 mx-4">
            <div className="h-5 rounded-md bg-white/[0.06] flex items-center px-3">
              <span className="text-[10px] text-white/30 font-mono">portalx.app/dashboard</span>
            </div>
          </div>
        </div>

        <div className="flex h-64 sm:h-72">
          {/* Sidebar */}
          <div className="w-40 shrink-0 border-r border-white/[0.05] p-3 flex flex-col gap-1">
            {sections.map((s, i) => (
              <div key={s} className={cn(
                'h-7 rounded-lg px-3 flex items-center text-[10px] font-medium transition-colors',
                i === 0
                  ? 'bg-brand-500/20 text-brand-300'
                  : 'text-white/30 hover:text-white/50',
              )}>
                {s}
              </div>
            ))}
          </div>

          {/* Main area */}
          <div className="flex-1 p-4 overflow-hidden">
            {/* Greeting */}
            <div className="h-4 w-40 rounded-md bg-white/10 mb-4" />
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {statItems.map((st) => (
                <div key={st.label} className="rounded-xl p-3" style={{ background: `${st.color}12`, border: `1px solid ${st.color}25` }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <st.icon className="w-3 h-3" style={{ color: st.color }} />
                    <span className="text-[9px] text-white/40">{st.label}</span>
                  </div>
                  <span className="text-lg font-bold font-display" style={{ color: st.color }}>{st.val}</span>
                </div>
              ))}
            </div>
            {/* Publish banner */}
            <div className="rounded-xl p-3 flex items-center justify-between" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
              <div>
                <div className="h-2.5 w-28 rounded bg-white/20 mb-1.5" />
                <div className="h-2 w-20 rounded bg-white/10" />
              </div>
              <div className="h-7 w-20 rounded-lg text-[10px] font-semibold text-white flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>
                Publish →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen font-sans">
      <SEO
        title="PortalX — Premium Portfolio Builder with CMS"
        description="Build, customize, and publish a stunning professional portfolio. Premium templates, SEO tools, blog, projects, and more — no code required."
        keywords="portfolio builder, cms, no code portfolio, professional portfolio, portfolio website"
      />
      <MarketingNav />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 dot-grid opacity-60" />
        {/* Top border glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 flex flex-col items-center gap-12">
          {/* Badge */}
          <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-brand-500/25 shadow-glow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
            </span>
            <span className="text-[0.8rem] font-semibold text-brand-600 dark:text-brand-300">
              No-code portfolio builder with CMS
            </span>
          </div>

          {/* Headline */}
          <div className="text-center space-y-4 max-w-4xl animate-fade-in-up">
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold leading-[1.04] text-gray-900 dark:text-white text-balance">
              Build a portfolio{' '}
              <br className="hidden sm:block" />
              that{' '}
              <span className="gradient-text">gets you hired.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed text-balance">
              Create a stunning professional portfolio with a lightweight CMS — add projects, skills, experience, and blog posts, then publish in one click.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up animation-delay-200">
            <Button
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/signup')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              {user ? 'Open dashboard' : 'Start building — free'}
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              See a live demo
              <ArrowUpRight className="w-4 h-4 ml-1 opacity-60" />
            </Button>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-gray-500 dark:text-gray-400 animate-fade-in-up animation-delay-300">
            {['Free to start', 'No credit card', 'Publish instantly', 'No code needed'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                {t}
              </span>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="w-full animate-fade-in-up animation-delay-500">
            <HeroDashboardPreview />
          </div>
        </div>
      </section>

      {/* ── MARQUEE LOGOS (social proof) ─────────────────── */}
      <div className="relative border-y border-gray-200/60 dark:border-white/[0.05] bg-gray-50/30 dark:bg-white/[0.01] py-5 overflow-hidden">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Used by professionals from
        </p>
        <div className="flex overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {['Google', 'Stripe', 'Figma', 'Notion', 'Linear', 'Vercel', 'Spotify', 'Airbnb',
              'Google', 'Stripe', 'Figma', 'Notion', 'Linear', 'Vercel', 'Spotify', 'Airbnb'].map((c, i) => (
              <span key={i} className="text-base font-bold font-display text-gray-300 dark:text-white/15 tracking-tight">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="glass-card p-6 text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
            >
              <p className="font-display text-4xl font-extrabold gradient-text mb-1">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-bg opacity-40" />
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-label mb-4 inline-flex">
              <Sparkles className="w-3 h-3" /> Features
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              Everything you need{' '}
              <span className="gradient-text">to stand out</span>
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              A complete toolkit for building and managing a professional presence online.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} idx={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ────────────────────────────────────── */}
      <section id="templates" className="py-24 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-label mb-4 inline-flex">
            <Layout className="w-3 h-3" /> Templates
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Start from a{' '}
            <span className="gradient-text">premium design</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Pick a template, then make it yours — custom accent, theme, SEO.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((t) => (
            <div key={t.name} className="group glass-card overflow-hidden card-hover">
              {/* Preview window */}
              <div className="relative h-52 overflow-hidden" style={{ background: `linear-gradient(135deg, ${t.from}22, ${t.to}22)` }}>
                {/* Dot grid overlay */}
                <div className="absolute inset-0 dot-grid opacity-40" />
                {/* Mock UI */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 gap-2">
                  {/* Avatar + name row */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full" style={{ background: `linear-gradient(135deg,${t.from},${t.to})` }} />
                    <div className="space-y-1">
                      <div className="h-2 w-24 rounded" style={{ background: `${t.from}80` }} />
                      <div className="h-1.5 w-16 rounded" style={{ background: `${t.from}40` }} />
                    </div>
                  </div>
                  {t.preview.map((row, i) => (
                    <div key={i} className="h-[var(--h)] rounded-lg" style={{ '--h': `${row.h * 3}px`, width: row.w, background: `${t.from}`, opacity: row.op } as React.CSSProperties} />
                  ))}
                </div>
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-12" style={{ background: `linear-gradient(to top, ${t.from}30, transparent)` }} />
              </div>

              <div className="p-5 flex flex-col gap-3">
                <div>
                  <h3 className="font-display font-bold text-gray-900 dark:text-white">{t.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {t.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/signup')}>
                  Use this template
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section id="testimonials" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(99,102,241,0.07), transparent)' }} />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="section-label mb-4 inline-flex">
              <Users className="w-3 h-3" /> Testimonials
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              Loved by{' '}
              <span className="gradient-text">10,000+ creators</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="glass-card p-7 card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'both' }}
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[0.95rem] text-gray-700 dark:text-gray-200 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="mt-6 flex items-center gap-3 pt-5 border-t border-gray-100 dark:border-white/[0.06]">
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-white dark:ring-white/10" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="py-16 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden p-12 md:p-16 text-center"
             style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #2d1b69 40%, #1a1040 100%)' }}>
          {/* Top border glow */}
          <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
          {/* Glow orbs */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-accent-500/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 dot-grid opacity-20" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
              <Zap className="w-4 h-4 text-brand-300" />
              <span className="text-sm font-semibold text-brand-200">Start for free today</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white leading-tight text-balance">
              Ready to build your{' '}
              <span className="gradient-text">dream portfolio?</span>
            </h2>
            <p className="mt-4 text-lg text-white/60 max-w-xl mx-auto">
              Join PortalX and publish a professional portfolio in minutes — no code, no hassle, no excuses.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate(user ? '/dashboard' : '/signup')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-white text-gray-900 hover:bg-gray-50 shadow-2xl shadow-white/20 font-bold"
              >
                {user ? 'Go to dashboard' : 'Get started free'}
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section id="faq" className="py-24 max-w-3xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <span className="section-label mb-4 inline-flex">FAQ</span>
          <h2 className="font-display text-4xl font-bold text-gray-900 dark:text-white">
            Frequently asked questions
          </h2>
        </div>
        <div className="glass-card px-6 sm:px-8 py-2">
          {faqs.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
