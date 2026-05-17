import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField } from '../common/InputField';
import { useAuthForm } from '../../hooks/useAuthForm';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const navigate = useNavigate();
  const { name, setName, email, setEmail, password, setPassword, error, loading, onSubmit } = useAuthForm(mode);

  const submit = (event: FormEvent) => onSubmit(event, () => navigate('/dashboard'));

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === 'register' && <InputField id="name" label="Name" value={name} onChange={setName} required />}
      <InputField id="email" label="Email" type="email" value={email} onChange={setEmail} required />
      <InputField id="password" label="Password" type="password" value={password} onChange={setPassword} required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
      </button>
    </form>
  );
};
