import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, MailCheck } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';

export function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) throw error;
      setSent(true);
      toast('Reset link sent to your email', 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Failed to send reset email', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We sent a password reset link"
        footer={
          <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600">
            Back to sign in
          </Link>
        }
      >
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/15 to-accent-500/15 flex items-center justify-center text-brand-500 mx-auto mb-6">
            <MailCheck className="w-8 h-8" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We sent a password reset link to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>. Click the link in the email to reset your password.
          </p>
          <Button variant="outline" className="mt-6 w-full" onClick={() => setSent(false)}>
            Try a different email
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send a reset link"
      footer={
        <>
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
          leftIcon={<Mail className="w-4 h-4" />}
        />
        <Button type="submit" className="w-full" size="lg" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  );
}
