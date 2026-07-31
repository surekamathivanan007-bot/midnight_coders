import { Link, useOutletContext } from 'react-router-dom';
import {
  FolderKanban, FileText, GraduationCap, Briefcase, Sparkles, Award,
  Eye, Globe, ArrowRight, TrendingUp, Plus, CheckCircle2, Circle,
} from 'lucide-react';
import type { PortfolioData } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

export function DashboardHome() {
  const { data } = useOutletContext<DashboardContext>();

  const stats = [
    { label: 'Projects', value: data.projects.length, icon: FolderKanban, color: 'from-brand-500 to-brand-600' },
    { label: 'Blog Posts', value: data.blogPosts.length, icon: FileText, color: 'from-accent-500 to-accent-600' },
    { label: 'Skills', value: data.skills.length, icon: Sparkles, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Experience', value: data.experience.length, icon: Briefcase, color: 'from-amber-500 to-orange-500' },
    { label: 'Education', value: data.education.length, icon: GraduationCap, color: 'from-sky-500 to-blue-600' },
    { label: 'Certificates', value: data.certificates.length, icon: Award, color: 'from-rose-500 to-pink-600' },
  ];

  const checklist = [
    { label: 'Profile photo & name', done: !!data.profile?.avatar_url && !!data.profile?.full_name, to: '/dashboard/profile' },
    { label: 'About / bio', done: !!data.profile?.bio, to: '/dashboard/profile' },
    { label: 'Add skills', done: data.skills.length > 0, to: '/dashboard/skills' },
    { label: 'Add projects', done: data.projects.length > 0, to: '/dashboard/projects' },
    { label: 'Add experience', done: data.experience.length > 0, to: '/dashboard/experience' },
    { label: 'Add education', done: data.education.length > 0, to: '/dashboard/education' },
    { label: 'Upload resume', done: data.resumes.length > 0, to: '/dashboard/resume' },
    { label: 'Set contact info', done: data.contacts.length > 0, to: '/dashboard/contact' },
    { label: 'Add social links', done: data.socialLinks.length > 0, to: '/dashboard/social' },
    { label: 'Set SEO meta', done: !!data.portfolio.seo_title, to: '/dashboard/theme' },
  ];

  const doneCount = checklist.filter((c) => c.done).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {data.profile?.full_name?.split(' ')[0] || 'there'}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Here's an overview of your portfolio.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 card-hover">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Publish banner */}
        <Card className="lg:col-span-2 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-accent-500/5" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge variant={data.portfolio.is_published ? 'success' : 'warning'}>
                  {data.portfolio.is_published ? 'Published' : 'Draft'}
                </Badge>
                <h2 className="text-xl font-bold mt-3">
                  {data.portfolio.title || 'Your Portfolio'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {data.portfolio.is_published
                    ? `Live at /u/${data.portfolio.slug}`
                    : 'Publish your portfolio to share it with the world.'}
                </p>
              </div>
              <div className="hidden sm:block">
                <Globe className="w-12 h-12 text-brand-500/30" />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {data.portfolio.is_published ? (
                <a href={`/u/${data.portfolio.slug}`} target="_blank" rel="noreferrer">
                  <Button rightIcon={<ArrowRight className="w-4 h-4" />}>View live portfolio</Button>
                </a>
              ) : (
                <Link to="/dashboard/publish">
                  <Button rightIcon={<ArrowRight className="w-4 h-4" />}>Publish now</Button>
                </Link>
              )}
              <Link to="/dashboard/preview">
                <Button variant="outline" leftIcon={<Eye className="w-4 h-4" />}>Preview</Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* Completion checklist */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-500" /> Setup checklist
            </h3>
            <Badge variant="brand">{doneCount}/{checklist.length}</Badge>
          </div>
          <div className="space-y-2.5">
            {checklist.map((c) => (
              <Link
                key={c.label}
                to={c.to}
                className="flex items-center gap-3 group"
              >
                {c.done ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0" />
                )}
                <span className={`text-sm flex-1 ${c.done ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300 group-hover:text-brand-500'}`}>
                  {c.label}
                </span>
                {!c.done && <Plus className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-brand-500" />}
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent projects */}
      {data.projects.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent projects</h3>
            <Link to="/dashboard/projects" className="text-sm text-brand-500 hover:text-brand-600 font-medium">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.projects.slice(0, 3).map((p) => (
              <div key={p.id} className="rounded-xl border border-gray-100 dark:border-white/5 overflow-hidden group">
                <div className="aspect-video bg-gradient-to-br from-brand-500/10 to-accent-500/10 overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-500/30">
                      <FolderKanban className="w-10 h-10" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-medium text-sm truncate">{p.title}</p>
                  {p.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tags.slice(0, 3).map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
