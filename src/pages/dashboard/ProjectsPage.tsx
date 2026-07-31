import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FolderKanban, Star, ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { Project, PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { CrudList, type Column } from '@/components/dashboard/CrudList';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { cn } from '@/lib/utils';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

const emptyForm = {
  title: '',
  description: '',
  image_url: '',
  project_url: '',
  github_url: '',
  tags: [] as string[],
  featured: false,
};

export function ProjectsPage() {
  const { data } = useOutletContext<DashboardContext>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  const columns: Column<Project>[] = [
    {
      key: 'title',
      label: 'Project',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/10 to-accent-500/10 overflow-hidden shrink-0">
            {p.image_url ? (
              <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-500/40">
                <FolderKanban className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">{p.title}</p>
            <p className="text-xs text-gray-400 truncate max-w-xs">{p.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.tags.slice(0, 3).map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
          {p.tags.length > 3 && <Badge variant="outline" className="text-[10px]">+{p.tags.length - 3}</Badge>}
        </div>
      ),
    },
  ];

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setTagInput('');
    setModalOpen(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description ?? '',
      image_url: p.image_url ?? '',
      project_url: p.project_url ?? '',
      github_url: p.github_url ?? '',
      tags: p.tags,
      featured: p.featured,
    });
    setTagInput('');
    setModalOpen(true);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm({ ...form, tags: [...form.tags, t] });
    }
    setTagInput('');
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast('Project title is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        image_url: form.image_url || null,
        project_url: form.project_url || null,
        github_url: form.github_url || null,
        tags: form.tags,
        featured: form.featured,
      };
      if (editing) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('projects').insert({ ...payload, portfolio_id: data.portfolio.id });
        if (error) throw error;
      }
      toast(editing ? 'Project updated' : 'Project added', 'success');
      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Project) => {
    const { error } = await supabase.from('projects').delete().eq('id', p.id);
    if (error) throw error;
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <SEO title="Projects — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Showcase your best work with images, links, and tags.</p>
      </div>
      <CrudList<Project>
        items={data.projects}
        columns={columns}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add project"
        emptyTitle="No projects added yet"
        emptyDescription="Add your projects to show off your work and accomplishments."
        emptyIcon={<FolderKanban className="w-7 h-7" />}
        searchKeys={['title', 'description']}
        modalTitle={editing ? 'Edit project' : 'Add project'}
        modalDescription="Fill in the details of your project."
        modalOpen={modalOpen}
        onCloseModal={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
        size="lg"
        badges={(item) => item.featured ? <Badge variant="brand"><Star className="w-3 h-3" /> Featured</Badge> : null}
      >
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="My Awesome Project" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="A brief description of what this project does..." rows={3} />
          <ImageUpload
            bucket="portfolio-images"
            userId={user!.id}
            value={form.image_url}
            onUploaded={(url) => setForm({ ...form, image_url: url })}
            label="Project image"
            aspect="video"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Live URL" value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} placeholder="https://..." leftIcon={<ExternalLink className="w-4 h-4" />} />
            <Input label="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." leftIcon={<Github className="w-4 h-4" />} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="Type a tag and press Enter"
              />
              <Button type="button" variant="outline" onClick={addTag}>Add</Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tags.map((t) => (
                  <Badge key={t} variant="brand" className="cursor-pointer" onClick={() => setForm({ ...form, tags: form.tags.filter((x) => x !== t) })}>
                    {t} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            Feature this project on your portfolio home
          </label>
        </div>
      </CrudList>
    </div>
  );
}
