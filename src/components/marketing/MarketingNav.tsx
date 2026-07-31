import { Link, useNavigate } from 'react-router-dom';
import { Zap, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function MarketingNav() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Features',     href: '#features' },
    { label: 'Templates',    href: '#templates' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQ',          href: '#faq' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div
        className={cn(
          'transition-all duration-300',
          scrolled
            ? 'glass-strong shadow-soft border-b border-white/[0.06]'
            : 'bg-transparent',
        )}
      >
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-lg shadow-brand-500/40 group-hover:shadow-brand-500/60 transition-shadow">
              <Zap className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="text-xl font-bold font-display tracking-tight text-gray-900 dark:text-white">
              Portal<span className="gradient-text-warm">X</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-[0.875rem] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100/80 dark:hover:bg-white/[0.05] transition-all duration-150"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>

            {user ? (
              <Button size="sm" onClick={() => navigate('/dashboard')}>Dashboard</Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/login')}>
                  Log in
                </Button>
                <Button size="sm" onClick={() => navigate('/signup')}>
                  Get started
                </Button>
              </>
            )}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[0.06]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={cn('md:hidden overflow-hidden transition-all duration-300', mobileOpen ? 'max-h-72' : 'max-h-0')}>
          <div className="px-5 py-4 space-y-1 border-t border-white/[0.06]">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.05] rounded-xl"
              >
                {l.label}
              </a>
            ))}
            {!user && (
              <button onClick={() => navigate('/login')} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/[0.05] rounded-xl">
                Log in
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
