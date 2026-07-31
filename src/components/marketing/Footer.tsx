import { Link } from 'react-router-dom';
import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

const cols = [
  {
    heading: 'Product',
    links: [
      { label: 'Features',   href: '#features' },
      { label: 'Templates',  href: '#templates' },
      { label: 'Get started', href: '/signup', internal: true },
      { label: 'Sign in',    href: '/login',  internal: true },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'FAQ',          href: '#faq' },
      { label: 'Admin',        href: '/admin', internal: true },
    ],
  },
];

const socials = [
  { icon: Twitter,  href: '#' },
  { icon: Github,   href: '#' },
  { icon: Linkedin, href: '#' },
];

export function Footer() {
  return (
    <footer className="relative border-t border-gray-200/60 dark:border-white/[0.06] bg-gray-50/40 dark:bg-surface-950/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <Zap className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-xl font-bold font-display tracking-tight">
                Portal<span className="gradient-text-warm">X</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              The premium portfolio builder with a built-in CMS. Create, customize, and publish your professional portfolio — no code required.
            </p>
            <div className="flex items-center gap-2 mt-6">
              {socials.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 border border-gray-200/60 dark:border-white/[0.06] transition-all duration-200"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">{col.heading}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.internal ? (
                      <Link to={l.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                        {l.label}
                      </Link>
                    ) : (
                      <a href={l.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors">
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} PortalX. All rights reserved.</p>
          <p className="text-xs text-gray-400">Built for creators, designers &amp; developers.</p>
        </div>
      </div>
    </footer>
  );
}
