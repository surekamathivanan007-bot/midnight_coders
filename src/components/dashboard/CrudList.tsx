import { useState, type ReactNode } from 'react';
import { Plus, Search, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface CrudListProps<T> {
  items: T[];
  columns: Column<T>[];
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => Promise<void>;
  addLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon: ReactNode;
  searchKeys: (keyof T)[];
  modalTitle: string;
  modalDescription?: string;
  modalOpen: boolean;
  onCloseModal: () => void;
  onSave: () => Promise<void>;
  saving: boolean;
  children: ReactNode;
  badges?: (item: T) => ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function CrudList<T extends { id: string }>({
  items,
  columns,
  onAdd,
  onEdit,
  onDelete,
  addLabel,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  searchKeys,
  modalTitle,
  modalDescription,
  modalOpen,
  onCloseModal,
  onSave,
  saving,
  children,
  badges,
  size = 'md',
}: CrudListProps<T>) {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = items.filter((item) =>
    searchKeys.some((k) => String(item[k] ?? '').toLowerCase().includes(query.toLowerCase())),
  );

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await onDelete(confirmDelete);
      toast('Deleted successfully', 'success');
      setConfirmDelete(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Delete failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  if (items.length === 0 && !query) {
    return (
      <>
        <Card>
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={emptyDescription}
            action={<Button leftIcon={<Plus className="w-4 h-4" />} onClick={onAdd}>{addLabel}</Button>}
          />
        </Card>
        <Modal
          open={modalOpen}
          onClose={onCloseModal}
          title={modalTitle}
          description={modalDescription}
          size={size}
          footer={
            <>
              <Button variant="ghost" onClick={onCloseModal}>Cancel</Button>
              <Button onClick={onSave} loading={saving}>Save</Button>
            </>
          }
        >
          {children}
        </Modal>
        <DeleteConfirm
          open={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-4">
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11"
          />
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={onAdd}>{addLabel}</Button>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-12">
          <p className="text-center text-gray-400 text-sm">No results for "{query}"</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="w-8 px-4 py-3"></th>
                  {columns.map((c) => (
                    <th key={String(c.key)} className={cn('text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3', c.className)}>
                      {c.label}
                    </th>
                  ))}
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 dark:border-white/[0.03] hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-gray-300 dark:text-gray-700">
                      <GripVertical className="w-4 h-4" />
                    </td>
                    {columns.map((c) => (
                      <td key={String(c.key)} className={cn('px-4 py-3 text-sm', c.className)}>
                        {c.render ? c.render(item) : String(item[c.key as keyof T] ?? '')}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {badges?.(item)}
                        <button onClick={() => onEdit(item)} className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmDelete(item)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100 dark:divide-white/5">
            {filtered.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    {columns.map((c) => (
                      <div key={String(c.key)} className="text-sm">
                        {c.render ? c.render(item) : String(item[c.key as keyof T] ?? '')}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => onEdit(item)} className="p-2 text-gray-400 hover:text-brand-500 rounded-lg">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setConfirmDelete(item)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {badges?.(item) && <div className="mt-2">{badges(item)}</div>}
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={onCloseModal}
        title={modalTitle}
        description={modalDescription}
        size={size}
        footer={
          <>
            <Button variant="ghost" onClick={onCloseModal}>Cancel</Button>
            <Button onClick={onSave} loading={saving}>Save</Button>
          </>
        }
      >
        {children}
      </Modal>

      <DeleteConfirm
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </>
  );
}

function DeleteConfirm({
  open,
  onClose,
  onConfirm,
  deleting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete this item?"
      description="This action cannot be undone."
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={deleting}>Delete</Button>
        </>
      }
    >
      <p className="text-sm text-gray-500 dark:text-gray-400">Are you sure you want to delete this item? It will be removed from your portfolio immediately.</p>
    </Modal>
  );
}
