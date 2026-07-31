import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Frown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { PortfolioData, Portfolio, Profile, Education, Experience, Skill, Project, BlogPost, Certificate, Achievement, Contact, SocialLink, Resume } from '@/lib/types';
import { PortfolioRenderer } from '@/components/portfolio/PortfolioRenderer';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';

export function PublicPortfolioPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      try {
        const { data: portfolio } = await supabase
          .from('portfolios')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();

        if (!portfolio) {
          setNotFound(true);
          return;
        }

        const p = portfolio as Portfolio;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', p.user_id)
          .maybeSingle();

        const [education, experience, skills, projects, blogPosts, certificates, achievements, contacts, socialLinks, resumes] = await Promise.all([
          supabase.from('education').select('*').eq('portfolio_id', p.id).order('sort_order'),
          supabase.from('experience').select('*').eq('portfolio_id', p.id).order('sort_order'),
          supabase.from('skills').select('*').eq('portfolio_id', p.id).order('sort_order'),
          supabase.from('projects').select('*').eq('portfolio_id', p.id).order('sort_order'),
          supabase.from('blog_posts').select('*').eq('portfolio_id', p.id).order('sort_order'),
          supabase.from('certificates').select('*').eq('portfolio_id', p.id).order('sort_order'),
          supabase.from('achievements').select('*').eq('portfolio_id', p.id).order('sort_order'),
          supabase.from('contacts').select('*').eq('portfolio_id', p.id),
          supabase.from('social_links').select('*').eq('portfolio_id', p.id).order('sort_order'),
          supabase.from('resumes').select('*').eq('portfolio_id', p.id).order('uploaded_at', { ascending: false }),
        ]);

        setData({
          portfolio: p,
          profile: profile as Profile | null,
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
        console.error('Failed to load portfolio:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <FullPageSpinner label="Loading portfolio..." />;

  if (notFound || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 flex items-center justify-center text-brand-500">
          <Frown className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Portfolio not found</h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
          This portfolio doesn't exist or hasn't been published yet.
        </p>
        <Link to="/">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>Back home</Button>
        </Link>
      </div>
    );
  }

  return <PortfolioRenderer data={data} />;
}
