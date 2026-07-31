import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import type { Experience, PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { CrudList, type Column } from '@/components/dashboard/CrudList';
import { Input, Textarea } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

const emptyForm = {
  company: '',
  role: '',
  start_date: '',
  end_date: '',
  current: false,
  description: '',
};

export function ExperiencePage() {
  const { data } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const columns: Column<Experience>[] = [
    {
      key: 'role',
      label: 'Role',
      render: (e) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{e.role}</p>
          <p className="text-xs text-gray-400">{e.company}</p>
        </div>
      ),
    },
    {
      key: 'dates',
      label: 'Period',
      render: (e) => (
        <span className="text-gray-500 dark:text-gray-400">
          {formatDate(e.start_date)} — {e.current ? 'Present' : formatDate(e.end_date)}
        </span>
      ),
    },
  ];

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: Experience) => {
    setEditing(item);
    setForm({
      company: item.company,
      role: item.role,
      start_date: item.start_date ?? '',
      end_date: item.end_date ?? '',
      current: item.current,
      description: item.description ?? '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.company.trim() || !form.role.trim()) {
      toast('Company and role are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, end_date: form.current ? null : form.end_date };
      if (editing) {
        const { error } = await supabase.from('experience').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('experience').insert({ ...payload, portfolio_id: data.portfolio.id });
        if (error) throw error;
      }
      toast(editing ? 'Experience updated' : 'Experience added', 'success');
      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Experience) => {
    const { error } = await supabase.from('experience').delete().eq('id', item.id);
    if (error) throw error;
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <SEO title="Experience — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Experience</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Showcase your work history and roles.</p>
      </div>
      <CrudList<Experience>
        items={data.experience}
        columns={columns}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add experience"
        emptyTitle="No experience added yet"
        emptyDescription="Add your jobs, internships, and roles to build your professional timeline."
        emptyIcon={<Briefcase className="w-7 h-7" />}
        searchKeys={['company', 'role']}
        modalTitle={editing ? 'Edit experience' : 'Add experience'}
        modalDescription="Enter the details of your work experience."
        modalOpen={modalOpen}
        onCloseModal={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
        badges={(item) => item.current ? <Badge variant="success">Current</Badge> : null}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Senior Product Designer" />
            <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Inc." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start date" type="month" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            <Input label="End date" type="month" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} disabled={form.current} />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              checked={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
            />
            I currently work here
          </label>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What did you do and achieve in this role?" rows={3} />
        </div>
      </CrudList>
    </div>
  );
}
