import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import type { Achievement, PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { CrudList, type Column } from '@/components/dashboard/CrudList';
import { Input, Textarea } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

const emptyForm = { title: '', description: '', date: '' };

export function AchievementsPage() {
  const { data } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const columns: Column<Achievement>[] = [
    {
      key: 'title',
      label: 'Achievement',
      render: (a) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{a.title}</p>
          <p className="text-xs text-gray-400 truncate max-w-xs">{a.description}</p>
        </div>
      ),
    },
    { key: 'date', label: 'Date', render: (a) => <span className="text-gray-500 dark:text-gray-400">{formatDate(a.date)}</span> },
  ];

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (a: Achievement) => {
    setEditing(a);
    setForm({ title: a.title, description: a.description ?? '', date: a.date ?? '' });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast('Title is required', 'error'); return; }
    setSaving(true);
    try {
      const payload = { title: form.title, description: form.description || null, date: form.date || null };
      if (editing) {
        const { error } = await supabase.from('achievements').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('achievements').insert({ ...payload, portfolio_id: data.portfolio.id });
        if (error) throw error;
      }
      toast(editing ? 'Achievement updated' : 'Achievement added', 'success');
      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: Achievement) => {
    const { error } = await supabase.from('achievements').delete().eq('id', a.id);
    if (error) throw error;
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <SEO title="Achievements — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Highlight your awards, recognitions, and milestones.</p>
      </div>
      <CrudList<Achievement>
        items={data.achievements}
        columns={columns}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add achievement"
        emptyTitle="No achievements added yet"
        emptyDescription="Add awards and recognitions to showcase your accomplishments."
        emptyIcon={<Trophy className="w-7 h-7" />}
        searchKeys={['title', 'description']}
        modalTitle={editing ? 'Edit achievement' : 'Add achievement'}
        modalOpen={modalOpen}
        onCloseModal={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
      >
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="1st Place Hackathon Winner" />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the achievement..." rows={3} />
          <Input label="Date" type="month" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
      </CrudList>
    </div>
  );
}
