import { FormEvent, useState } from 'react';
import { AxiosError } from 'axios';
import { loginUser, registerUser } from '../api/authApi';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/slices/authSlice';

interface ApiValidationError {
  field?: string;
  message: string;
}

interface ApiErrorResponse {
  success: boolean;
  message?: string;
  errors?: ApiValidationError[];
}

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
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errorData = err.response?.data as ApiErrorResponse | undefined;
        if (errorData?.errors && errorData.errors.length > 0) {
          const errorMessages = errorData.errors
            .map((e: ApiValidationError) => `${e.field ? `${e.field}: ` : ''}${e.message}`)
            .join(', ');
          setError(errorMessages);
        } else {
          setError(errorData?.message || err.message || (mode === 'login' ? 'Invalid credentials' : 'Unable to complete registration'));
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(mode === 'login' ? 'Invalid credentials' : 'Unable to complete registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return { name, setName, email, setEmail, password, setPassword, error, loading, onSubmit };
};
