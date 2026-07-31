import { NavLink, Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, User, GraduationCap, Briefcase, Sparkles, FolderKanban,
  FileText, Award, Trophy, FileCheck, Mail, Link2, Palette, Eye, LogOut,
  Menu, X, Moon, Sun, ExternalLink, Globe, ChevronRight, Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard',                 label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/dashboard/profile',         label: 'Profile',     icon: User },
  { to: '/dashboard/education',       label: 'Education',   icon: GraduationCap },
  { to: '/dashboard/experience',      label: 'Experience',  icon: Briefcase },
  { to: '/dashboard/skills',          label: 'Skills',      icon: Sparkles },
  { to: '/dashboard/projects',        label: 'Projects',    icon: FolderKanban },
  { to: '/dashboard/blog',            label: 'Blog',        icon: FileText },
  { to: '/dashboard/certificates',    label: 'Certificates',icon: Award },
  { to: '/dashboard/achievements',    label: 'Achievements',icon: Trophy },
  { to: '/dashboard/resume',          label: 'Resume',      icon: FileCheck },
  { to: '/dashboard/contact',         label: 'Contact',     icon: Mail },
  { to: '/dashboard/social',          label: 'Social Links',icon: Link2 },
  { to: '/dashboard/theme',           label: 'Theme & SEO', icon: Palette },
];

export function DashboardLayout() {
  const { profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data, loading } = usePortfolioData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return <FullPageSpinner label="Loading your dashboard…" />;

  const published = data.portfolio.is_published;
  const publicUrl  = `/u/${data.portfolio.slug}`;

  const completion = (() => {
    const checks = [
      !!profile?.full_name, !!profile?.avatar_url, !!profile?.bio,
      data.education.length > 0, data.experience.length > 0, data.skills.length > 0,
      data.projects.length > 0, data.blogPosts.length > 0, data.certificates.length > 0,
      data.achievements.length > 0, data.resumes.length > 0, data.contacts.length > 0,
      data.socialLinks.length > 0, !!data.portfolio.title,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  })();

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-900">

      {/* ── Sidebar ──────────────────────────────────────── */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-[232px] glass-strong flex flex-col transition-transform duration-300 lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200/60 dark:border-white/[0.06]">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center shadow-glow-sm">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Portal<span className="gradient-text-warm">X</span>
            </span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-700 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Publish status chip */}
        <div className="px-4 py-3">
          <div className={cn(
            'rounded-xl p-3 border text-sm transition-colors',
            published
              ? 'bg-emerald-50 dark:bg-emerald-500/[0.08] border-emerald-200 dark:border-emerald-500/20'
              : 'bg-gray-50 dark:bg-white/[0.03] border-gray-200/70 dark:border-white/[0.07]',
          )}>
            <div className="flex items-center gap-2">
              <span className={cn('w-2 h-2 rounded-full', published ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400')} />
              <span className="font-semibold text-xs text-gray-700 dark:text-gray-200">
                {published ? 'Portfolio Live' : 'Not Published'}
              </span>
            </div>
            {published && (
              <a href={publicUrl} target="_blank" rel="noreferrer"
                 className="mt-1.5 flex items-center gap-1 text-[11px] text-brand-500 hover:text-brand-600 font-medium">
                <Globe className="w-3 h-3" />{publicUrl}<ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 px-3 py-2 rounded-xl text-[0.83rem] font-medium transition-all duration-150',
                  isActive
                    ? 'bg-brand-500/10 dark:bg-brand-500/[0.12] text-brand-600 dark:text-brand-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white',
                )
              }
            >
              <item.icon className="w-[15px] h-[15px] shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-200/60 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl">
            <Avatar src={profile?.avatar_url} name={profile?.full_name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[0.8rem] font-semibold text-gray-900 dark:text-white truncate">{profile?.full_name || 'User'}</p>
              <p className="text-[0.7rem] text-gray-400 truncate">{profile?.email}</p>
            </div>
            <button onClick={handleSignOut} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Main ─────────────────────────────────────────── */}
      <div className="lg:pl-[232px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 glass-strong border-b border-gray-200/60 dark:border-white/[0.06] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <Breadcrumb pathname={location.pathname} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
            >
              {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </button>
            <Link to="/dashboard/preview">
              <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>Preview</Button>
            </Link>
            <Link to={published ? publicUrl : '/dashboard/publish'}>
              <Button size="sm" leftIcon={<Globe className="w-3.5 h-3.5" />}>
                {published ? 'View live' : 'Publish'}
              </Button>
            </Link>
          </div>
        </header>

        {/* Completion bar */}
        <div className="px-4 sm:px-6 pt-4">
          <div className="glass-card px-4 py-3 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Portfolio completion</span>
                <span className="text-xs font-bold text-brand-500">{completion}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-700"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-6 max-w-6xl mx-auto animate-fade-in">
          <Outlet context={{ data, loading }} />
        </main>
      </div>
    </div>
  );
}

function Breadcrumb({ pathname }: { pathname: string }) {
  const parts = pathname.split('/').filter(Boolean);
  const labels: Record<string, string> = {
    dashboard: 'Dashboard', profile: 'Profile', education: 'Education',
    experience: 'Experience', skills: 'Skills', projects: 'Projects',
    blog: 'Blog', certificates: 'Certificates', achievements: 'Achievements',
    resume: 'Resume', contact: 'Contact', social: 'Social Links',
    theme: 'Theme & SEO', preview: 'Preview', publish: 'Publish',
  };
  return (
    <div className="flex items-center gap-1 text-[0.82rem]">
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />}
          <span className={i === parts.length - 1 ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-400'}>
            {labels[p] || p}
          </span>
        </span>
      ))}
    </div>
  );
}
