import { useEffect, useState } from 'react';
import { Users, FolderKanban, FileText, Sparkles, Globe, TrendingUp, Award, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface AdminStats {
  totalUsers: number;
  publishedPortfolios: number;
  totalProjects: number;
  totalBlogPosts: number;
  totalSkills: number;
  totalPortfolios: number;
  totalCertificates: number;
  totalExperience: number;
}

interface RecentUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
}

export function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [users, portfolios, projects, blogPosts, skills, certificates, experience] = await Promise.all([
          supabase.from('profiles').select('id, email, full_name, avatar_url, is_admin, created_at', { count: 'exact', head: false }),
          supabase.from('portfolios').select('id, is_published', { count: 'exact' }),
          supabase.from('projects').select('id', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabase.from('skills').select('id', { count: 'exact', head: true }),
          supabase.from('certificates').select('id', { count: 'exact', head: true }),
          supabase.from('experience').select('id', { count: 'exact', head: true }),
        ]);

        const publishedCount = (portfolios.data ?? []).filter((p: { is_published: boolean }) => p.is_published).length;

        setStats({
          totalUsers: users.count ?? 0,
          totalPortfolios: portfolios.count ?? 0,
          publishedPortfolios: publishedCount,
          totalProjects: projects.count ?? 0,
          totalBlogPosts: blogPosts.count ?? 0,
          totalSkills: skills.count ?? 0,
          totalCertificates: certificates.count ?? 0,
          totalExperience: experience.count ?? 0,
        });

        setRecentUsers((users.data ?? []).slice(0, 5) as RecentUser[]);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !stats) {
    return <div className="py-20 text-center text-gray-400">Loading statistics...</div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-brand-500 to-brand-600' },
    { label: 'Published Portfolios', value: stats.publishedPortfolios, icon: Globe, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Total Portfolios', value: stats.totalPortfolios, icon: TrendingUp, color: 'from-sky-500 to-blue-600' },
    { label: 'Projects', value: stats.totalProjects, icon: FolderKanban, color: 'from-accent-500 to-accent-600' },
    { label: 'Blog Posts', value: stats.totalBlogPosts, icon: FileText, color: 'from-amber-500 to-orange-500' },
    { label: 'Skills', value: stats.totalSkills, icon: Sparkles, color: 'from-rose-500 to-pink-600' },
    { label: 'Certificates', value: stats.totalCertificates, icon: Award, color: 'from-violet-500 to-purple-600' },
    { label: 'Experience Entries', value: stats.totalExperience, icon: Briefcase, color: 'from-teal-500 to-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      <SEO title="Admin Overview — PortalX" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Platform statistics and recent activity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="p-5 card-hover">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recent users</h3>
        <div className="space-y-3">
          {recentUsers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No users yet.</p>
          ) : (
            recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-white/[0.03] last:border-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt={u.full_name || ''} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    (u.full_name || u.email)[0].toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.full_name || u.email}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                {u.is_admin && <Badge variant="brand">Admin</Badge>}
                <span className="text-xs text-gray-400 shrink-0">{formatDate(u.created_at)}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
