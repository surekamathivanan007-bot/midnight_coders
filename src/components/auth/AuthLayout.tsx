import { Link, useNavigate } from 'react-router-dom';
import { Zap, Moon, Sun, ArrowLeft, Check } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { SEO } from '@/components/SEO';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  const { theme, toggleTheme } = useTheme();

  const perks = [
    'Free forever to get started',
    'Publish your portfolio in minutes',
    'No credit card required',
    'Premium templates included',
  ];

  return (
    <div className="min-h-screen flex">
      <SEO title={`${title} — PortalX`} />

      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col"
           style={{ background: 'linear-gradient(150deg, #0d0d14 0%, #13102b 50%, #0d0d14 100%)' }}>
        <div className="absolute inset-0 dot-grid opacity-30" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-500/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-[100px]" />
        {/* Top border glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-lg shadow-brand-500/40">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-display text-white">
              Portal<span className="gradient-text">X</span>
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-display text-4xl font-extrabold text-white leading-tight max-w-sm text-balance">
              Build a portfolio that{' '}
              <span className="gradient-text">opens doors.</span>
            </h2>
            <p className="mt-4 text-[0.95rem] text-white/50 max-w-sm leading-relaxed">
              Join thousands of professionals showcasing their work with a premium, no-code portfolio builder.
            </p>

            <div className="mt-8 space-y-3">
              {perks.map((p) => (
                <div key={p} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm text-white/60">{p}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-3">
                {[47, 12, 32, 15].map((id) => (
                  <img key={id} src={`https://i.pravatar.cc/80?img=${id}`} alt="" className="w-10 h-10 rounded-full border-2 border-white/10 object-cover" />
                ))}
              </div>
              <p className="text-sm text-white/40">Trusted by 10,000+ creators</p>
            </div>
          </div>

          <p className="text-xs text-white/25 relative z-10">© {new Date().getFullYear()} PortalX. All rights reserved.</p>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 flex flex-col bg-white dark:bg-surface-900">
        <div className="flex items-center justify-between p-5 sm:p-7">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back home
          </Link>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
          >
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-[400px]">
            {/* Mobile logo */}
            <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center">
                <Zap className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-xl font-bold font-display">Portal<span className="gradient-text-warm">X</span></span>
            </Link>

            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
            <p className="mt-2 text-[0.9rem] text-gray-500 dark:text-gray-400">{subtitle}</p>

            <div className="mt-8">{children}</div>
            {footer && (
              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">{footer}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
