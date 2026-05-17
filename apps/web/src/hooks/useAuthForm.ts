import { FormEvent, useState } from 'react';
import { loginUser, registerUser } from '../api/authApi';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';

export const useAuthForm = (mode: 'login' | 'register') => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent, onSuccess: () => void): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        await registerUser({ name, email, password });
      }
      const response = await loginUser({ email, password });
      dispatch(setCredentials({ token: response.token, user: response.user }));
      onSuccess();
    } catch {
      setError(mode === 'login' ? 'Invalid credentials' : 'Unable to complete registration');
    } finally {
      setLoading(false);
    }
  };

  return { name, setName, email, setEmail, password, setPassword, error, loading, onSubmit };
};
