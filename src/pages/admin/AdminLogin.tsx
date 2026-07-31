import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { SEO } from '@/components/SEO';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Enter your credentials', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', data.user.id).maybeSingle();
      if (!profile?.is_admin) {
        await supabase.auth.signOut();
        toast('This account does not have admin access', 'error');
        return;
      }
      await refreshProfile();
      toast('Welcome, admin', 'success');
      navigate('/admin');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-[#0a0a0f] to-brand-950">
      <SEO title="Admin Login — PortalX" />
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-20" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white mx-auto mb-4 shadow-glow">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-sm text-gray-400 mt-1">Secure access for administrators only</p>
        </div>
        <form onSubmit={handleSubmit} className="glass-strong rounded-3xl p-7 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1.5">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@folio.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1.5">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>
          <Button type="submit" className="w-full" size="lg" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Sign in to admin
          </Button>
          <Link to="/" className="flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
        </form>
      </div>
    </div>
  );
}
