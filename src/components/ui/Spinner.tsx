import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Spinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return <Loader2 className={cn('animate-spin text-brand-500', sizes[size], className)} />;
}

export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-gray-100 dark:border-white/5" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
      </div>
      {label && <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">{label}</p>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('shimmer-bg animate-shimmer rounded-lg', className)} />;
}
