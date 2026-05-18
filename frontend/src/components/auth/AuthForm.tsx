import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthForm } from '@/hooks/useAuthForm';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const { name, setName, email, setEmail, password, setPassword, error, loading, onSubmit } = useAuthForm(mode);

  const submit = (event: FormEvent) => onSubmit(event, () => navigate('/dashboard'));

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === 'register' && (
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </div>
      )}
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </div>
      {error && <AlertBanner message={error} />}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
      </Button>
    </form>
  );
};
