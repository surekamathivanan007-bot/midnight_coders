import { useRef, useState, type ChangeEvent } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  bucket: 'avatars' | 'portfolio-images';
  userId: string;
  value?: string | null;
  onUploaded: (url: string) => void;
  label?: string;
  aspect?: 'square' | 'video' | 'wide';
  className?: string;
}

export function ImageUpload({
  bucket,
  userId,
  value,
  onUploaded,
  label = 'Upload image',
  aspect = 'video',
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[21/9]',
  }[aspect];

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast('Please select an image file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast('Image must be under 5MB', 'error');
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) throw error;

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      const url = urlData.publicUrl;
      setPreview(url);
      onUploaded(url);
      toast('Image uploaded successfully', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden',
          aspectClass,
          dragOver
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10'
            : 'border-gray-300 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500',
        )}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white text-sm font-medium flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4" /> Replace
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                onUploaded('');
              }}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 p-6">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-sm">Uploading...</p>
              </>
            ) : (
              <>
                <UploadCloud className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">Click to upload or drag & drop</p>
                <p className="text-xs mt-1">PNG, JPG up to 5MB</p>
              </>
            )}
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
    </div>
  );
}
