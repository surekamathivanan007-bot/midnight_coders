import { useState, useEffect, type FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import type { PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Avatar } from '@/components/ui/Avatar';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

export function ProfilePage() {
  const { data } = useOutletContext<DashboardContext>();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const { updatePortfolio } = usePortfolioData();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(data.profile?.full_name ?? '');
    setBio(data.profile?.bio ?? '');
    setLocation(data.profile?.location ?? '');
    setAvatarUrl(data.profile?.avatar_url ?? null);
    setPortfolioTitle(data.portfolio.title ?? '');
    setTagline(data.portfolio.tagline ?? '');
  }, [data]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, bio, location, avatar_url: avatarUrl })
        .eq('id', user.id);
      if (profileError) throw profileError;

      await updatePortfolio({ title: portfolioTitle, tagline });
      await refreshProfile();
      toast('Profile saved successfully', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <SEO title="Profile — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your personal info and portfolio identity.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar + name */}
        <Card>
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>Your photo and name appear across your portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-5">
              <Avatar src={avatarUrl} name={fullName} size="xl" />
              <div className="flex-1">
                <ImageUpload
                  bucket="avatars"
                  userId={user!.id}
                  value={avatarUrl}
                  onUploaded={setAvatarUrl}
                  label="Profile photo"
                  aspect="square"
                  className="max-w-[200px]"
                />
              </div>
            </div>
            <Input
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              leftIcon={<User className="w-4 h-4" />}
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA"
            />
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
            <CardDescription>A short bio that introduces you to visitors.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="I'm a product designer passionate about building delightful experiences..."
              rows={5}
              hint={`${bio.length} characters`}
            />
          </CardContent>
        </Card>

        {/* Portfolio identity */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Header</CardTitle>
            <CardDescription>The title and tagline shown at the top of your portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              label="Portfolio title"
              value={portfolioTitle}
              onChange={(e) => setPortfolioTitle(e.target.value)}
              placeholder="Jane Doe — Product Designer"
            />
            <Input
              label="Tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Designing products people love to use"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving} leftIcon={<Save className="w-4 h-4" />} size="lg">
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
