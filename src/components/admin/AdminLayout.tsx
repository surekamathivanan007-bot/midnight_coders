import { NavLink, Link, useNavigate, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, FolderKanban, Sparkles, FileText, LogOut,
  Menu, X, Moon, Sun, ArrowLeft, ShieldCheck, Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/ui/Avatar';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin',         label: 'Overview',   icon: LayoutDashboard, end: true },
  { to: '/admin/users',   label: 'Users',      icon: Users },
  { to: '/admin/projects',label: 'Projects',   icon: FolderKanban },
  { to: '/admin/skills',  label: 'Skills',     icon: Sparkles },
  { to: '/admin/blog',    label: 'Blog Posts', icon: FileText },
];

export function AdminLayout() {
  const { user, profile, isAdmin, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return <FullPageSpinner label="Loading admin…" />;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface-900">
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-[232px] glass-strong flex flex-col transition-transform duration-300 lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-200/60 dark:border-white/[0.06]">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-base block leading-none">
                Portal<span className="gradient-text-warm">X</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-brand-500">Admin</span>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-400"><X className="w-5 h-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-xl text-[0.83rem] font-medium transition-all duration-150',
                  isActive
                    ? 'bg-brand-500/10 dark:bg-brand-500/[0.12] text-brand-600 dark:text-brand-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white',
                )
              }
            >
              <item.icon className="w-[15px] h-[15px]" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200/60 dark:border-white/[0.06] space-y-2">
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
          </Link>
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl">
            <Avatar src={profile?.avatar_url} name={profile?.full_name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-[0.8rem] font-semibold truncate">{profile?.full_name || 'Admin'}</p>
              <p className="text-[0.7rem] text-gray-400 truncate">{profile?.email}</p>
            </div>
            <button onClick={handleSignOut} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="lg:pl-[232px]">
        <header className="sticky top-0 z-20 h-16 glass-strong border-b border-gray-200/60 dark:border-white/[0.06] flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden text-gray-500"><Menu className="w-5 h-5" /></button>
            <div className="flex items-center gap-2 text-sm">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">Admin Panel</span>
            </div>
          </div>
          <button onClick={toggleTheme} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all">
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>
        </header>

        <main className="p-4 sm:p-6 max-w-6xl mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
