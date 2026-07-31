import { useEffect, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface AdminSkill {
  id: string;
  name: string;
  category: string | null;
  proficiency: number;
  owner_name: string | null;
  owner_email: string | null;
}

export function AdminSkills() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [filtered, setFiltered] = useState<AdminSkill[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('id, name, category, proficiency, portfolio:portfolios(user:profiles(email, full_name))')
          .order('name');
        if (error) throw error;
        const mapped = (data ?? []).map((s: Record<string, unknown>) => {
          const portfolio = s.portfolio as { user: { email: string; full_name: string } } | null;
          return {
            id: s.id as string,
            name: s.name as string,
            category: s.category as string | null,
            proficiency: s.proficiency as number,
            owner_name: portfolio?.user?.full_name ?? null,
            owner_email: portfolio?.user?.email ?? null,
          };
        });
        setSkills(mapped);
        setFiltered(mapped);
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Failed to load skills', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  useEffect(() => {
    setFiltered(skills.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      (s.category ?? '').toLowerCase().includes(query.toLowerCase()),
    ));
  }, [query, skills]);

  if (loading) return <div className="py-20 text-center text-gray-400">Loading skills...</div>;

  const grouped = filtered.reduce<Record<string, AdminSkill[]>>((acc, s) => {
    const key = s.category || 'General';
    (acc[key] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <SEO title="Manage Skills — PortalX Admin" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Skills</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">{skills.length} skills across all portfolios</p>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input placeholder="Search skills..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-11" />
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([cat, items]) => (
          <Card key={cat} className="p-5">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{cat} ({items.length})</h3>
            <div className="flex flex-wrap gap-2">
              {items.map((s) => (
                <div key={s.id} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-sm">
                  <span className="font-medium">{s.name}</span>
                  <div className="w-10 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${s.proficiency}%` }} />
                  </div>
                  <span className="text-xs text-gray-400">{s.owner_name || s.owner_email?.split('@')[0] || ''}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="p-12">
          <p className="text-center text-sm text-gray-400">{query ? `No skills match "${query}"` : 'No skills yet.'}</p>
        </Card>
      )}
    </div>
  );
}
