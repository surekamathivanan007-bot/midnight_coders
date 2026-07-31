import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { BlogPost, PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { CrudList, type Column } from '@/components/dashboard/CrudList';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { slugify, formatDateLong } from '@/lib/utils';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

const emptyForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  cover_image: '',
  published: false,
};

export function BlogPage() {
  const { data } = useOutletContext<DashboardContext>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      label: 'Title',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-500/10 to-brand-500/10 overflow-hidden shrink-0">
            {p.cover_image ? (
              <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-accent-500/40">
                <FileText className="w-5 h-5" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">{p.title}</p>
            <p className="text-xs text-gray-400">/{p.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (p) => <span className="text-gray-500 dark:text-gray-400">{formatDateLong(p.published_at ?? p.created_at)}</span>,
    },
  ];

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: BlogPost) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? '',
      content: p.content ?? '',
      cover_image: p.cover_image ?? '',
      published: p.published,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast('Title is required', 'error');
      return;
    }
    const slug = form.slug || slugify(form.title);
    if (!slug) {
      toast('Could not generate a valid slug', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug,
        excerpt: form.excerpt || null,
        content: form.content || null,
        cover_image: form.cover_image || null,
        published: form.published,
        published_at: form.published ? new Date().toISOString() : null,
      };
      if (editing) {
        const { error } = await supabase.from('blog_posts').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_posts').insert({ ...payload, portfolio_id: data.portfolio.id });
        if (error) throw error;
      }
      toast(editing ? 'Post updated' : 'Post created', 'success');
      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: BlogPost) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', p.id);
    if (error) throw error;
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <SEO title="Blog — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Write and publish blog posts on your portfolio.</p>
      </div>
      <CrudList<BlogPost>
        items={data.blogPosts}
        columns={columns}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Write post"
        emptyTitle="No blog posts yet"
        emptyDescription="Share your thoughts, tutorials, and updates with your audience."
        emptyIcon={<FileText className="w-7 h-7" />}
        searchKeys={['title', 'excerpt']}
        modalTitle={editing ? 'Edit post' : 'Write a new post'}
        modalDescription="Compose your blog post."
        modalOpen={modalOpen}
        onCloseModal={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
        size="xl"
        badges={(item) => item.published ? <Badge variant="success"><Eye className="w-3 h-3" /> Published</Badge> : <Badge variant="warning"><EyeOff className="w-3 h-3" /> Draft</Badge>}
      >
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} placeholder="How I built my first app" />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="how-i-built-my-first-app" hint="The URL path for this post" />
          <Textarea label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="A short summary that appears in the blog list..." rows={2} />
          <ImageUpload
            bucket="portfolio-images"
            userId={user!.id}
            value={form.cover_image}
            onUploaded={(url) => setForm({ ...form, cover_image: url })}
            label="Cover image"
            aspect="video"
          />
          <Textarea label="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your post content here..." rows={10} />
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            Publish this post
          </label>
        </div>
      </CrudList>
    </div>
  );
}
