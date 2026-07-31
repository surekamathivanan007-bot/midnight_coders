import { useState, type FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import { GraduationCap, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import type { Education, PortfolioData } from '@/lib/types';
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
  institution: '',
  degree: '',
  field: '',
  start_date: '',
  end_date: '',
  description: '',
};

export function EducationPage() {
  const { data } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const columns: Column<Education>[] = [
    {
      key: 'institution',
      label: 'Institution',
      render: (e) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{e.institution}</p>
          <p className="text-xs text-gray-400">{e.degree}{e.field ? ` · ${e.field}` : ''}</p>
        </div>
      ),
    },
    {
      key: 'dates',
      label: 'Period',
      render: (e) => <span className="text-gray-500 dark:text-gray-400">{formatDate(e.start_date)} — {formatDate(e.end_date) || 'Present'}</span>,
    },
  ];

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item: Education) => {
    setEditing(item);
    setForm({
      institution: item.institution,
      degree: item.degree ?? '',
      field: item.field ?? '',
      start_date: item.start_date ?? '',
      end_date: item.end_date ?? '',
      description: item.description ?? '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.institution.trim()) {
      toast('Institution is required', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const { error } = await supabase.from('education').update(form).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('education').insert({ ...form, portfolio_id: data.portfolio.id });
        if (error) throw error;
      }
      toast(editing ? 'Education updated' : 'Education added', 'success');
      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Education) => {
    const { error } = await supabase.from('education').delete().eq('id', item.id);
    if (error) throw error;
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <SEO title="Education — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Education</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Add your academic background and qualifications.</p>
      </div>
      <CrudList<Education>
        items={data.education}
        columns={columns}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add education"
        emptyTitle="No education added yet"
        emptyDescription="Add your schools, degrees, and certifications to showcase your academic background."
        emptyIcon={<GraduationCap className="w-7 h-7" />}
        searchKeys={['institution', 'degree', 'field']}
        modalTitle={editing ? 'Edit education' : 'Add education'}
        modalDescription="Enter the details of your education."
        modalOpen={modalOpen}
        onCloseModal={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
      >
        <div className="space-y-4">
          <Input label="Institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Stanford University" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="B.S." />
            <Input label="Field of study" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} placeholder="Computer Science" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start date" type="month" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            <Input label="End date" type="month" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          </div>
          <Textarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Relevant coursework, honors, activities..." rows={3} />
        </div>
      </CrudList>
    </div>
  );
}
