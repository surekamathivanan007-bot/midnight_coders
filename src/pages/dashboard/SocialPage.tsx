import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link2, Plus, X, Pencil, Trash2, Github, Twitter, Linkedin, Globe, Instagram, Youtube, Facebook } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import type { SocialLink, PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

const platforms = [
  'github', 'twitter', 'linkedin', 'instagram', 'youtube', 'facebook', 'dribbble', 'behance', 'website', 'email',
];

const platformIcons: Record<string, typeof Github> = {
  github: Github, twitter: Twitter, linkedin: Linkedin, instagram: Instagram, youtube: Youtube,
  facebook: Facebook, website: Globe, email: Link2, dribbble: Globe, behance: Globe,
};

export function SocialPage() {
  const { data } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [platform, setPlatform] = useState('github');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<SocialLink | null>(null);

  const openAdd = () => { setEditing(null); setPlatform('github'); setUrl(''); setModalOpen(true); };
  const openEdit = (s: SocialLink) => { setEditing(s); setPlatform(s.platform); setUrl(s.url); setModalOpen(true); };

  const handleSave = async () => {
    if (!url.trim()) { toast('URL is required', 'error'); return; }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from('social_links').update({ platform, url }).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('social_links').insert({ platform, url, portfolio_id: data.portfolio.id });
        if (error) throw error;
      }
      toast(editing ? 'Link updated' : 'Link added', 'success');
      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: SocialLink) => {
    const { error } = await supabase.from('social_links').delete().eq('id', s.id);
    if (error) {
      toast('Delete failed', 'error');
    } else {
      toast('Link deleted', 'success');
      window.location.reload();
    }
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <SEO title="Social Links — PortalX Dashboard" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Social Links</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add links to your social profiles.</p>
        </div>
        {data.socialLinks.length > 0 && <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openAdd}>Add link</Button>}
      </div>

      {data.socialLinks.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Link2 className="w-7 h-7" />}
            title="No social links yet"
            description="Add links to your GitHub, LinkedIn, Twitter, and other profiles."
            action={<Button onClick={openAdd}>Add your first link</Button>}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.socialLinks.map((s) => {
            const Icon = platformIcons[s.platform] ?? Globe;
            return (
              <Card key={s.id} className="p-5 card-hover group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 flex items-center justify-center text-brand-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{s.platform}</p>
                      <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-brand-500 truncate block max-w-[180px]">{s.url}</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-brand-500 rounded-lg"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => setConfirmDelete(s)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit link' : 'Add social link'}
        size="sm"
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave} loading={saving}>Save</Button></>}
      >
        <div className="space-y-4">
          <Select label="Platform" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {platforms.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
          </Select>
          <Input label="URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </div>
      </Modal>

      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete this link?"
        size="sm"
        footer={<><Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Button><Button variant="danger" onClick={() => confirmDelete && handleDelete(confirmDelete)}>Delete</Button></>}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">This social link will be removed from your portfolio.</p>
      </Modal>
    </div>
  );
}
