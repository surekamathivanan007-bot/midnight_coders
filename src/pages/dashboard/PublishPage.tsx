import { useState } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { Globe, Check, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import type { PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

export function PublishPage() {
  const { data } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const { updatePortfolio } = usePortfolioData();
  const navigate = useNavigate();
  const [publishing, setPublishing] = useState(false);

  const checklist = [
    { label: 'Profile photo & name', done: !!data.profile?.avatar_url && !!data.profile?.full_name },
    { label: 'Bio / about me', done: !!data.profile?.bio },
    { label: 'At least one project', done: data.projects.length > 0 },
    { label: 'At least one skill', done: data.skills.length > 0 },
    { label: 'Contact information', done: data.contacts.length > 0 },
    { label: 'Portfolio title set', done: !!data.portfolio.title },
  ];
  const ready = checklist.every((c) => c.done);
  const readyCount = checklist.filter((c) => c.done).length;

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await updatePortfolio({ is_published: true });
      toast('Your portfolio is live!', 'success');
      setTimeout(() => navigate(`/u/${data.portfolio.slug}`), 500);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Publish failed', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    try {
      await updatePortfolio({ is_published: false });
      toast('Portfolio unpublished', 'info');
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed', 'error');
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <SEO title="Publish — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Publish your portfolio</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Make your portfolio live and shareable with the world.</p>
      </div>

      {data.portfolio.is_published ? (
        <Card className="p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-brand-500/5" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-4">
              <Globe className="w-8 h-8" />
            </div>
            <Badge variant="success">Published</Badge>
            <h2 className="text-xl font-bold mt-3">Your portfolio is live!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Share your link with the world.</p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <Globe className="w-4 h-4 text-brand-500" />
              <span className="text-sm font-mono">/u/{data.portfolio.slug}</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href={`/u/${data.portfolio.slug}`} target="_blank" rel="noreferrer">
                <Button leftIcon={<Eye className="w-4 h-4" />}>View live portfolio</Button>
              </a>
              <Button variant="outline" onClick={handleUnpublish}>Unpublish</Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-brand-500" /> Pre-publish checklist</CardTitle>
              <CardDescription>Make sure your portfolio is ready before going live.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {checklist.map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <div className={cn('w-6 h-6 rounded-full flex items-center justify-center shrink-0', c.done ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400')}>
                      {c.done ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs">!</span>}
                    </div>
                    <span className={cn('text-sm', c.done ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400')}>{c.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-400">Readiness</span>
                  <span className="text-xs font-bold text-brand-500">{readyCount}/{checklist.length}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all" style={{ width: `${(readyCount / checklist.length) * 100}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5" />
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 flex items-center justify-center text-brand-500 mx-auto mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold">Ready to publish?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
                Your portfolio will be available at <span className="font-mono text-brand-500">/u/{data.portfolio.slug}</span>
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={handlePublish} loading={publishing} size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Publish now
                </Button>
                <Link to="/dashboard/preview">
                  <Button variant="outline" size="lg" leftIcon={<Eye className="w-4 h-4" />}>Preview first</Button>
                </Link>
              </div>
              {!ready && (
                <p className="mt-4 text-xs text-amber-500">Tip: complete the checklist above for a more complete portfolio.</p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
