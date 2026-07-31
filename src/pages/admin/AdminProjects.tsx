import { useEffect, useState } from 'react';
import { Search, FolderKanban, ExternalLink, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface AdminProject {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  tags: string[];
  featured: boolean;
  created_at: string;
  owner_email: string | null;
  owner_name: string | null;
}

export function AdminProjects() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [filtered, setFiltered] = useState<AdminProject[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, description, image_url, project_url, github_url, tags, featured, created_at, portfolio:portfolios(user_id, user:profiles(email, full_name))')
          .order('created_at', { ascending: false });
        if (error) throw error;
        const mapped = (data ?? []).map((p: Record<string, unknown>) => {
          const portfolio = p.portfolio as { user: { email: string; full_name: string } } | null;
          return {
            id: p.id as string,
            title: p.title as string,
            description: p.description as string | null,
            image_url: p.image_url as string | null,
            project_url: p.project_url as string | null,
            github_url: p.github_url as string | null,
            tags: p.tags as string[],
            featured: p.featured as boolean,
            created_at: p.created_at as string,
            owner_email: portfolio?.user?.email ?? null,
            owner_name: portfolio?.user?.full_name ?? null,
          };
        });
        setProjects(mapped);
        setFiltered(mapped);
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Failed to load projects', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  useEffect(() => {
    setFiltered(projects.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      (p.owner_email ?? '').toLowerCase().includes(query.toLowerCase()),
    ));
  }, [query, projects]);

  if (loading) return <div className="py-20 text-center text-gray-400">Loading projects...</div>;

  return (
    <div className="space-y-6">
      <SEO title="Manage Projects — PortalX Admin" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Projects</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{projects.length} projects across all portfolios</p>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search projects..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-11" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className="overflow-hidden card-hover">
            <div className="aspect-video bg-gradient-to-br from-brand-500/10 to-accent-500/10 overflow-hidden">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-500/30">
                  <FolderKanban className="w-10 h-10" />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm">{p.title}</h3>
                {p.featured && <Badge variant="brand"><Star className="w-3 h-3" /></Badge>}
              </div>
              {p.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{p.description}</p>}
              {p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.tags.slice(0, 3).map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs text-gray-400 truncate">{p.owner_name || p.owner_email || 'Unknown'}</span>
                {p.project_url && <a href={p.project_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-500"><ExternalLink className="w-4 h-4" /></a>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-12">
          <p className="text-center text-sm text-gray-400">{query ? `No projects match "${query}"` : 'No projects yet.'}</p>
        </Card>
      )}
    </div>
  );
}
