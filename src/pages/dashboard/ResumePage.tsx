import { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileCheck, UploadCloud, Download, Trash2, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { PortfolioData } from '@/lib/types';
import { SEO } from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatDateLong } from '@/lib/utils';

interface DashboardContext {
  data: PortfolioData;
  loading: boolean;
}

export function ResumePage() {
  const { data } = useOutletContext<DashboardContext>();
  const { user } = useAuth();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast('Please upload a PDF file', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast('File must be under 10MB', 'error');
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user!.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('resumes').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(fileName);
      const { error: dbError } = await supabase.from('resumes').insert({
        portfolio_id: data.portfolio.id,
        file_url: urlData.publicUrl,
        file_name: file.name,
      });
      if (dbError) throw dbError;
      toast('Resume uploaded successfully', 'success');
      window.location.reload();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('resumes').delete().eq('id', id);
    if (error) {
      toast('Delete failed', 'error');
    } else {
      toast('Resume deleted', 'success');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <SEO title="Resume — PortalX Dashboard" />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resume</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Upload your resume so visitors can download it from your portfolio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload resume</CardTitle>
          <CardDescription>PDF files up to 10MB.</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onClick={() => inputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-colors cursor-pointer p-10 text-center"
          >
            {uploading ? (
              <div className="text-brand-500">
                <UploadCloud className="w-10 h-10 mx-auto mb-2 animate-pulse" />
                <p className="text-sm font-medium">Uploading...</p>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 flex items-center justify-center text-brand-500 mx-auto mb-3">
                  <FileCheck className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Click to upload your resume</p>
                <p className="text-xs text-gray-400 mt-1">PDF, up to 10MB</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
            className="hidden"
          />
        </CardContent>
      </Card>

      {data.resumes.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FileText className="w-7 h-7" />}
            title="No resume uploaded yet"
            description="Upload your resume to let visitors download it directly from your portfolio."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {data.resumes.map((r) => (
            <Card key={r.id} className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{r.file_name || 'Resume'}</p>
                <p className="text-xs text-gray-400">Uploaded {formatDateLong(r.uploaded_at)}</p>
              </div>
              <a href={r.file_url} target="_blank" rel="noreferrer" download>
                <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>Download</Button>
              </a>
              <button onClick={() => handleDelete(r.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
