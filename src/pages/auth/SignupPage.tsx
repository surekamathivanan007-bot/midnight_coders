import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

export function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!fullName.trim()) e.name = 'Name is required';
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      if (data.user) {
        await refreshProfile();
        toast('Account created! Welcome to PortalX.', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Sign up failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const pwChecks = [
    { ok: password.length >= 6, label: 'At least 6 characters' },
    { ok: /[A-Z]/.test(password) || /[a-z]/.test(password), label: 'Contains letters' },
    { ok: /[0-9]/.test(password), label: 'Contains a number' },
  ];

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Build your portfolio in minutes — free"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-500 hover:text-brand-600">Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full name"
          type="text"
          name="fullName"
          placeholder="Jane Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.name}
          leftIcon={<User className="w-4 h-4" />}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
        />
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            leftIcon={<Lock className="w-4 h-4" />}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-[38px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {password.length > 0 && (
          <div className="space-y-1.5">
            {pwChecks.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-xs">
                <Check className={`w-3.5 h-3.5 ${c.ok ? 'text-emerald-500' : 'text-gray-300 dark:text-gray-600'}`} />
                <span className={c.ok ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400'}>{c.label}</span>
              </div>
            ))}
          </div>
        )}
        <Button type="submit" className="w-full" size="lg" loading={loading} rightIcon={<ArrowRight className="w-4 h-4" />}>
          Create account
        </Button>
        <p className="text-xs text-gray-400 text-center">
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </AuthLayout>
  );
}
