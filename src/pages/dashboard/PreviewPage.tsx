import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Pencil, Globe } from 'lucide-react';
import type { PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

export function PreviewPage() {
  const { data } = useOutletContext<DashboardContext>();
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <SEO title="Live Preview — PortalX" />
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to dashboard
          </Button>
          <Badge variant="brand"><Eye className="w-3 h-3" /> Live Preview</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/theme">
            <Button variant="outline" size="sm" leftIcon={<Pencil className="w-4 h-4" />}>Customize</Button>
          </Link>
          <Link to={data.portfolio.is_published ? `/u/${data.portfolio.slug}` : '/dashboard/publish'}>
            <Button size="sm" leftIcon={<Globe className="w-4 h-4" />}>
              {data.portfolio.is_published ? 'View live' : 'Publish'}
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-soft-lg">
        <div className="h-9 bg-gray-100 dark:bg-white/5 flex items-center gap-2 px-4 border-b border-gray-200 dark:border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 rounded-md bg-white dark:bg-white/10 text-xs text-gray-400 font-mono">
              {data.portfolio.is_published ? `/u/${data.portfolio.slug}` : 'preview mode'}
            </div>
          </div>
        </div>
        <div className="max-h-[75vh] overflow-y-auto">
          <PortfolioRenderer data={data} isPreview />
        </div>
      </div>
    </div>
  );
}
