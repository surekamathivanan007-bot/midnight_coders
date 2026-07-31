import { useState, useEffect, type FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Palette, Save, Search, Moon, Sun, Sparkles } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import type { PortfolioData, TemplateId, Theme } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

const templates: { id: TemplateId; name: string; desc: string; gradient: string }[] = [
  { id: 'aurora', name: 'Aurora', desc: 'Gradient hero, bold type', gradient: 'from-brand-500 via-accent-500 to-brand-600' },
  { id: 'minimal', name: 'Minimal', desc: 'Clean, content-first', gradient: 'from-gray-600 to-gray-900' },
  { id: 'bold', name: 'Bold', desc: 'High-contrast, expressive', gradient: 'from-amber-500 to-red-500' },
];

const accentColors = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

export function ThemePage() {
  const { data } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const { updatePortfolio } = usePortfolioData();

  const [template, setTemplate] = useState<TemplateId>('aurora');
  const [theme, setTheme] = useState<Theme>('dark');
  const [accent, setAccent] = useState('#6366f1');
  const [slug, setSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTemplate(data.portfolio.template);
    setTheme(data.portfolio.theme);
    setAccent(data.portfolio.accent_color);
    setSlug(data.portfolio.slug);
    setSeoTitle(data.portfolio.seo_title ?? '');
    setSeoDescription(data.portfolio.seo_description ?? '');
    setSeoKeywords(data.portfolio.seo_keywords ?? '');
  }, [data.portfolio]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePortfolio({
        template,
        theme,
        accent_color: accent,
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''),
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        seo_keywords: seoKeywords || null,
      });
      toast('Theme & SEO settings saved', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <SEO title="Theme & SEO — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Theme & SEO</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Customize the look and search visibility of your portfolio.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Template */}
        <Card>
          <CardHeader>
            <CardTitle>Template</CardTitle>
            <CardDescription>Choose a starting design for your portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={cn(
                    'rounded-2xl overflow-hidden border-2 transition-all text-left',
                    template === t.id ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10',
                  )}
                >
                  <div className={`h-24 bg-gradient-to-br ${t.gradient} relative`}>
                    <div className="absolute inset-0 bg-grid-pattern bg-[size:16px_16px] opacity-20" />
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme + accent */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Set the color theme and accent for your portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {(['dark', 'light'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTheme(t)}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
                      theme === t ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10' : 'border-gray-200 dark:border-white/5 hover:border-gray-300',
                    )}
                  >
                    {t === 'dark' ? <Moon className="w-5 h-5 text-brand-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    <span className="font-medium text-sm capitalize">{t} mode</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Accent color</label>
              <div className="flex flex-wrap gap-2.5">
                {accentColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setAccent(c)}
                    className={cn('w-9 h-9 rounded-full transition-all', accent === c ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a0f] scale-110' : 'hover:scale-105')}
                    style={{ backgroundColor: c, boxShadow: accent === c ? `0 0 0 2px ${c}` : undefined }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* URL slug */}
        <Card>
          <CardHeader>
            <CardTitle>Public URL</CardTitle>
            <CardDescription>Your portfolio will be available at this path.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 shrink-0">/u/</span>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="your-slug" hint="Lowercase letters, numbers, and hyphens only" />
            </div>
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Search className="w-4 h-4 text-brand-500" /> SEO Settings</CardTitle>
            <CardDescription>Control how your portfolio appears in search results.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input label="Meta title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Jane Doe — Product Designer" hint={`${seoTitle.length}/60 characters`} />
            <Textarea label="Meta description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="A short description for search engines..." rows={3} hint={`${seoDescription.length}/160 characters`} />
            <Input label="Keywords" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="product designer, UX, portfolio" hint="Comma-separated keywords" />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} leftIcon={<Save className="w-4 h-4" />} size="lg">Save settings</Button>
        </div>
      </form>
    </div>
  );
}
