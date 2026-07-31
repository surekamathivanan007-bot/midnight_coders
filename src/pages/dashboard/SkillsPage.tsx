import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import type { Skill, PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

export function SkillsPage() {
  const { data } = useOutletContext<DashboardContext>();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [proficiency, setProficiency] = useState(80);
  const [saving, setSaving] = useState(false);

  const grouped = data.skills.reduce<Record<string, Skill[]>>((acc, s) => {
    const key = s.category || 'General';
    (acc[key] ??= []).push(s);
    return acc;
  }, {});

  const openAdd = () => {
    setEditing(null);
    setName('');
    setCategory('');
    setProficiency(80);
    setModalOpen(true);
  };

  const openEdit = (s: Skill) => {
    setEditing(s);
    setName(s.name);
    setCategory(s.category ?? '');
    setProficiency(s.proficiency);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast('Skill name is required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload = { name, category: category || null, proficiency };
      if (editing) {
        const { error } = await supabase.from('skills').update(payload).eq('id', editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('skills').insert({ ...payload, portfolio_id: data.portfolio.id });
        if (error) throw error;
      }
      toast(editing ? 'Skill updated' : 'Skill added', 'success');
      setModalOpen(false);
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: Skill) => {
    const { error } = await supabase.from('skills').delete().eq('id', s.id);
    if (error) {
      toast('Delete failed', 'error');
    } else {
      toast('Skill deleted', 'success');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Skills — PortalX Dashboard" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Add your skills grouped by category.</p>
        </div>
        {data.skills.length > 0 && <Button leftIcon={<Sparkles className="w-4 h-4" />} onClick={openAdd}>Add skill</Button>}
      </div>

      {data.skills.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Sparkles className="w-7 h-7" />}
            title="No skills added yet"
            description="Add your technical and soft skills to show what you can do."
            action={<Button onClick={openAdd}>Add your first skill</Button>}
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, skills]) => (
            <Card key={cat} className="p-6">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">{cat}</h3>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="group inline-flex items-center gap-2 pl-3.5 pr-2 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-brand-300 dark:hover:border-brand-500/30 transition-colors"
                  >
                    <button onClick={() => openEdit(s)} className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {s.name}
                    </button>
                    <div className="w-12 h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${s.proficiency}%` }} />
                    </div>
                    <button onClick={() => handleDelete(s)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 transition-colors p-0.5">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit skill' : 'Add skill'}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Skill name" value={name} onChange={(e) => setName(e.target.value)} placeholder="React" />
          <Input label="Category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Frontend" hint="Group your skills (e.g. Frontend, Design, Tools)" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Proficiency: {proficiency}%</label>
            <input
              type="range"
              min={0}
              max={100}
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
