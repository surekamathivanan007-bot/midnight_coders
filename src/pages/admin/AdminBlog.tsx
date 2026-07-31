import { useEffect, useState } from 'react';
import { Search, FileText, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDateLong } from '@/lib/utils';

interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  owner_name: string | null;
  owner_email: string | null;
  portfolio_slug: string | null;
}

export function AdminBlog() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [filtered, setFiltered] = useState<AdminBlogPost[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, excerpt, cover_image, published, published_at, created_at, portfolio:portfolios(slug, user:profiles(email, full_name))')
          .order('created_at', { ascending: false });
        if (error) throw error;
        const mapped = (data ?? []).map((p: Record<string, unknown>) => {
          const portfolio = p.portfolio as { slug: string; user: { email: string; full_name: string } } | null;
          return {
            id: p.id as string,
            title: p.title as string,
            slug: p.slug as string,
            excerpt: p.excerpt as string | null,
            cover_image: p.cover_image as string | null,
            published: p.published as boolean,
            published_at: p.published_at as string | null,
            created_at: p.created_at as string,
            owner_name: portfolio?.user?.full_name ?? null,
            owner_email: portfolio?.user?.email ?? null,
            portfolio_slug: portfolio?.slug ?? null,
          };
        });
        setPosts(mapped);
        setFiltered(mapped);
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Failed to load blog posts', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  useEffect(() => {
    setFiltered(posts.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      (p.owner_email ?? '').toLowerCase().includes(query.toLowerCase()),
    ));
  }, [query, posts]);

  if (loading) return <div className="py-20 text-center text-gray-400">Loading blog posts...</div>;

  return (
    <div className="space-y-6">
      <SEO title="Manage Blog — PortalX Admin" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Blog Posts</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{posts.length} posts across all portfolios</p>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search posts..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-11" />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Post</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Author</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-white/[0.03] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-500/10 to-brand-500/10 overflow-hidden shrink-0">
                        {p.cover_image ? (
                          <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-accent-500/40"><FileText className="w-4 h-4" /></div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell truncate">{p.owner_name || p.owner_email || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{formatDateLong(p.published_at ?? p.created_at)}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <Badge variant="success"><Eye className="w-3 h-3" /> Published</Badge>
                    ) : (
                      <Badge variant="warning"><EyeOff className="w-3 h-3" /> Draft</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-sm text-gray-400 py-12">{query ? `No posts match "${query}"` : 'No blog posts yet.'}</p>}
      </Card>
    </div>
  );
}
