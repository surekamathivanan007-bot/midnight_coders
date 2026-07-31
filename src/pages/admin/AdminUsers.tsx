import { useEffect, useState } from 'react';
import { Search, ShieldCheck, Globe, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  portfolio_slug: string | null;
  portfolio_published: boolean | null;
}

export function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filtered, setFiltered] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url, is_admin, created_at, portfolios(slug, is_published)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        const mapped = (data ?? []).map((u: Record<string, unknown>) => {
          const portfolios = u.portfolios as { slug: string; is_published: boolean }[] | null;
          return {
            id: u.id as string,
            email: u.email as string,
            full_name: u.full_name as string | null,
            avatar_url: u.avatar_url as string | null,
            is_admin: u.is_admin as boolean,
            created_at: u.created_at as string,
            portfolio_slug: portfolios?.[0]?.slug ?? null,
            portfolio_published: portfolios?.[0]?.is_published ?? null,
          };
        });
        setUsers(mapped);
        setFiltered(mapped);
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Failed to load users', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  useEffect(() => {
    setFiltered(users.filter((u) =>
      u.email.toLowerCase().includes(query.toLowerCase()) ||
      (u.full_name ?? '').toLowerCase().includes(query.toLowerCase()),
    ));
  }, [query, users]);

  const toggleAdmin = async (user: AdminUser) => {
    try {
      const { error } = await supabase.from('profiles').update({ is_admin: !user.is_admin }).eq('id', user.id);
      if (error) throw error;
      toast(user.is_admin ? 'Admin access removed' : 'Admin access granted', 'success');
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, is_admin: !u.is_admin } : u));
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to update', 'error');
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Loading users...</div>;

  return (
    <div className="space-y-6">
      <SEO title="Manage Users — PortalX Admin" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{users.length} registered users</p>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-11" />
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Joined</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Portfolio</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 dark:border-white/[0.03] last:border-0 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={u.avatar_url} name={u.full_name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{u.full_name || 'Unnamed'}</p>
                        <p className="text-xs text-gray-400 truncate">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{formatDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    {u.portfolio_slug ? (
                      <div className="flex items-center gap-2">
                        {u.portfolio_published && <Badge variant="success"><Globe className="w-3 h-3" /> Live</Badge>}
                        <a href={`/u/${u.portfolio_slug}`} target="_blank" rel="noreferrer" className="text-xs text-brand-500 hover:text-brand-600 inline-flex items-center gap-1">
                          /u/{u.portfolio_slug} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No portfolio</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleAdmin(u)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${u.is_admin ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {u.is_admin ? 'Admin' : 'Make admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-sm text-gray-400 py-12">No users found.</p>}
      </Card>
    </div>
  );
}
