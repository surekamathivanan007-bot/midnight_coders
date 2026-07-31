import { useState, useEffect, type FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import type { Contact, PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

export function ContactPage() {
  const { data } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const existing = data.contacts[0];
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEmail(existing?.email ?? '');
    setPhone(existing?.phone ?? '');
    setLocation(existing?.location ?? '');
    setWebsite(existing?.website ?? '');
  }, [existing]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        email: email || null,
        phone: phone || null,
        location: location || null,
        website: website || null,
      };
      if (existing) {
        const { error } = await supabase.from('contacts').update(payload).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('contacts').insert({ ...payload, portfolio_id: data.portfolio.id });
        if (error) throw error;
      }
      toast('Contact info saved', 'success');
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <SEO title="Contact — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact Information</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">How visitors can reach you.</p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Contact details</CardTitle>
            <CardDescription>Shown in the contact section of your portfolio.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" leftIcon={<Mail className="w-4 h-4" />} />
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" leftIcon={<Phone className="w-4 h-4" />} />
            <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" leftIcon={<MapPin className="w-4 h-4" />} />
            <Input label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yoursite.com" leftIcon={<Globe className="w-4 h-4" />} />
          </CardContent>
        </Card>
        <div className="flex justify-end mt-6">
          <Button type="submit" loading={saving} leftIcon={<Save className="w-4 h-4" />} size="lg">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
