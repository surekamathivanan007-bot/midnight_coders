import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Award, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { Certificate, PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { CrudList, type Column } from '@/components/dashboard/CrudList';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { formatDate } from '@/lib/utils';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

const emptyForm = {
  title: '',
  issuer: '',
  issue_date: '',
  expiry_date: '',
  credential_url: '',
  image_url: '',
};

export function CertificatesPage() {
  const { data } = useOutletContext<DashboardContext>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const columns: Column<Certificate>[] = [
    {
      key: 'title',
      label: 'Certificate',
      render: (c) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{c.title}</p>
          <p className="text-xs text-gray-400">{c.issuer}</p>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Issued',
      render: (c) => <span className="text-gray-500 dark:text-gray-400">{formatDate(c.issue_date)}</span>,
    },
  ];

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c: Certificate) => {
    setEditing(c);
    setForm({
      title: c.title,
      issuer: c.issuer ?? '',
      issue_date: c.issue_date ?? '',
      expiry_date: c.expiry_date ?? '',
      credential_url: c.credential_url ?? '',
      image_url: c.image_url ?? '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast('Title is required', 'error'); return; }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        issuer: form.issuer || null,
        issue_date: form.issue_date || null,
        expiry_date: form.expiry_date || null,
        credential_url: form.credential_url || null,
        image_url: form.image_url || null,
      };
      if (editing) {
        const { error } = await supabase.from('certificates').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('certificates').insert({ ...payload, portfolio_id: data.portfolio.id });
        if (error) throw error;
      }
      toast(editing ? 'Certificate updated' : 'Certificate added', 'success');
      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Certificate) => {
    const { error } = await supabase.from('certificates').delete().eq('id', c.id);
    if (error) throw error;
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <SEO title="Certificates — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Certificates</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Add your professional certifications and credentials.</p>
      </div>
      <CrudList<Certificate>
        items={data.certificates}
        columns={columns}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={handleDelete}
        addLabel="Add certificate"
        emptyTitle="No certificates added yet"
        emptyDescription="Add your certifications to validate your skills and expertise."
        emptyIcon={<Award className="w-7 h-7" />}
        searchKeys={['title', 'issuer']}
        modalTitle={editing ? 'Edit certificate' : 'Add certificate'}
        modalOpen={modalOpen}
        onCloseModal={() => setModalOpen(false)}
        onSave={handleSave}
        saving={saving}
        size="lg"
      >
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="AWS Solutions Architect" />
          <Input label="Issuer" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} placeholder="Amazon Web Services" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Issue date" type="month" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
            <Input label="Expiry date" type="month" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
          </div>
          <Input label="Credential URL" value={form.credential_url} onChange={(e) => setForm({ ...form, credential_url: e.target.value })} placeholder="https://..." leftIcon={<ExternalLink className="w-4 h-4" />} />
          <ImageUpload bucket="portfolio-images" userId={user!.id} value={form.image_url} onUploaded={(url) => setForm({ ...form, image_url: url })} label="Certificate image" aspect="video" />
        </div>
      </CrudList>
    </div>
  );
}
