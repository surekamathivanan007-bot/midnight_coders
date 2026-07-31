import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { slugify } from '@/lib/utils';
import type {
  Portfolio,
  PortfolioData,
  Education,
  Experience,
  Skill,
  Project,
  BlogPost,
  Certificate,
  Achievement,
  Contact,
  SocialLink,
  Resume,
} from '@/lib/types';

const emptyData: PortfolioData = {
  portfolio: {
    id: '',
    user_id: '',
    slug: '',
    template: 'aurora',
    theme: 'dark',
    accent_color: '#6366f1',
    is_published: false,
    title: null,
    tagline: null,
    seo_title: null,
    seo_description: null,
    seo_keywords: null,
    created_at: '',
    updated_at: '',
  },
  profile: null,
  education: [],
  experience: [],
  skills: [],
  projects: [],
  blogPosts: [],
  certificates: [],
  achievements: [],
  contacts: [],
  socialLinks: [],
  resumes: [],
};

export function usePortfolioData() {
  const { user } = useAuth();
  const [data, setData] = useState<PortfolioData>(emptyData);
  const [loading, setLoading] = useState(true);

  const ensurePortfolio = useCallback(async (): Promise<Portfolio | null> => {
    if (!user) return null;
    const { data: existing } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) return existing as Portfolio;

    const baseSlug = slugify(user.email?.split('@')[0] || `user-${Date.now()}`);
    let slug = baseSlug;
    let slugOk = false;
    let attempts = 0;
    while (!slugOk && attempts < 10) {
      const { data: check } = await supabase.from('portfolios').select('id').eq('slug', slug).maybeSingle();
      if (!check) {
        slugOk = true;
      } else {
        slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;
      }
      attempts++;
    }

    const { data: created, error } = await supabase
      .from('portfolios')
      .insert({ slug })
      .select('*')
      .single();
    if (error) throw error;
    return created as Portfolio;
  }, [user]);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const portfolio = await ensurePortfolio();
      if (!portfolio) return;

      const [education, experience, skills, projects, blogPosts, certificates, achievements, contacts, socialLinks, resumes, profile] =
        await Promise.all([
          supabase.from('education').select('*').eq('portfolio_id', portfolio.id).order('sort_order'),
          supabase.from('experience').select('*').eq('portfolio_id', portfolio.id).order('sort_order'),
          supabase.from('skills').select('*').eq('portfolio_id', portfolio.id).order('sort_order'),
          supabase.from('projects').select('*').eq('portfolio_id', portfolio.id).order('sort_order'),
          supabase.from('blog_posts').select('*').eq('portfolio_id', portfolio.id).order('sort_order'),
          supabase.from('certificates').select('*').eq('portfolio_id', portfolio.id).order('sort_order'),
          supabase.from('achievements').select('*').eq('portfolio_id', portfolio.id).order('sort_order'),
          supabase.from('contacts').select('*').eq('portfolio_id', portfolio.id),
          supabase.from('social_links').select('*').eq('portfolio_id', portfolio.id).order('sort_order'),
          supabase.from('resumes').select('*').eq('portfolio_id', portfolio.id).order('uploaded_at', { ascending: false }),
          supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        ]);

      setData({
        portfolio,
        profile: profile.data as PortfolioData['profile'],
        education: (education.data as Education[]) ?? [],
        experience: (experience.data as Experience[]) ?? [],
        skills: (skills.data as Skill[]) ?? [],
        projects: (projects.data as Project[]) ?? [],
        blogPosts: (blogPosts.data as BlogPost[]) ?? [],
        certificates: (certificates.data as Certificate[]) ?? [],
        achievements: (achievements.data as Achievement[]) ?? [],
        contacts: (contacts.data as Contact[]) ?? [],
        socialLinks: (socialLinks.data as SocialLink[]) ?? [],
        resumes: (resumes.data as Resume[]) ?? [],
      });
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, ensurePortfolio]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const refresh = useCallback(() => fetchAll(), [fetchAll]);

  const updatePortfolio = useCallback(
    async (updates: Partial<Portfolio>) => {
      if (!data.portfolio.id) return;
      const { error } = await supabase.from('portfolios').update(updates).eq('id', data.portfolio.id);
      if (error) throw error;
      setData((prev) => ({ ...prev, portfolio: { ...prev.portfolio, ...updates } }));
    },
    [data.portfolio.id],
  );

  return { data, loading, refresh, updatePortfolio };
}
